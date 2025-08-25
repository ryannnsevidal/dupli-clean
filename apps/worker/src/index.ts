import 'dotenv/config';
import { Worker as BullWorker, Queue, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { phash64FromGrayMatrix, bucket16, hammingHex64 } from '@dupli/hashing';
import { PrismaClient } from '@dupli/db';
import { execa } from 'execa';
import fs from 'node:fs/promises';
import path from 'node:path';

/***** Types *****/
interface IngestJobData {
  ownerId: string;
  fileId: string;
  storageKey: string;
  mimeType: string;
}

/***** Setup *****/
const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL!);
export const ingestQueue = new Queue<IngestJobData>('ingest', { connection });
new QueueEvents('ingest', { connection }); // backpressure/metrics hook

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

/***** Helpers *****/
async function downloadS3ToBuffer(Key: string): Promise<Buffer> {
  const res = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET!, Key }));
  const arr = await (res as any).Body.transformToByteArray();
  return Buffer.from(arr);
}

async function computePHashFromImageBuffer(buf: Buffer): Promise<{
  pHashHex: string;
  width: number | null;
  height: number | null;
  thumb: Buffer;
}> {
  const normalized = sharp(buf, { failOn: 'none' }).rotate();
  const { data } = await normalized
    .resize(32, 32, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const gray: number[][] = Array.from({ length: 32 }, (_, i) =>
    Array.from({ length: 32 }, (_, j) => data[i * 32 + j])
  );
  const pHashHex = phash64FromGrayMatrix(gray);
  const meta = await sharp(buf).metadata();
  const thumb = await sharp(buf).resize(480).jpeg({ mozjpeg: true }).toBuffer();
  return {
    pHashHex,
    width: meta.width ?? null,
    height: meta.height ?? null,
    thumb,
  };
}

async function storeThumb(assetId: string, thumb: Buffer): Promise<void> {
  const key = `thumbs/${assetId}.jpg`;
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: thumb,
      ContentType: 'image/jpeg',
    })
  );
  await prisma.asset.update({ where: { id: assetId }, data: { thumbKey: key } });
}

function clampBucket(n: number): number {
  if (n < 0) return 0;
  if (n > 0xffff) return 0xffff;
  return n;
}

async function clusterAsset(ownerId: string, assetId: string, hex: string): Promise<void> {
  const b = bucket16(hex);
  const buckets = [clampBucket(b - 1), b, clampBucket(b + 1)];
  const candidates = await prisma.hash.findMany({
    where: { kind: 'PHASH', bucket16: { in: buckets }, asset: { ownerId } },
    select: { hex64: true, assetId: true },
  });

  const neighbors: string[] = [];
  for (const c of candidates) {
    if (c.assetId === assetId) continue;
    const d = hammingHex64(hex, c.hex64);
    if (d <= 5) neighbors.push(c.assetId);
  }
  if (neighbors.length === 0) return;

  const existing = await prisma.clusterMember.findFirst({
    where: { assetId: { in: neighbors } },
    select: { clusterId: true },
  });
  const clusterId = existing ? existing.clusterId : (await prisma.duplicateCluster.create({ data: { ownerId } })).id;

  await prisma.$transaction(async (tx) => {
    await tx.clusterMember.upsert({
      where: { clusterId_assetId: { clusterId, assetId } },
      update: {},
      create: { clusterId, assetId },
    });
    for (const aId of neighbors) {
      await tx.clusterMember.upsert({
        where: { clusterId_assetId: { clusterId, assetId: aId } },
        update: {},
        create: { clusterId, assetId: aId },
      });
    }
    const members = await tx.clusterMember.findMany({
      where: { clusterId },
      include: { asset: true },
    });
    const keep = members
      .map((m) => m.asset)
      .sort((a, b) => {
        const ar = (a.width ?? 0) * (a.height ?? 0);
        const br = (b.width ?? 0) * (b.height ?? 0);
        if (ar !== br) return br - ar;
        return 0;
      })[0];
    if (keep) {
      await tx.clusterMember.updateMany({ where: { clusterId }, data: { isKeeper: false } });
      await tx.clusterMember.update({
        where: { clusterId_assetId: { clusterId, assetId: keep.id } },
        data: { isKeeper: true },
      });
    }
  });
}

async function handleImage(job: IngestJobData): Promise<void> {
  const buf = await downloadS3ToBuffer(job.storageKey);
  const { pHashHex, width, height, thumb } = await computePHashFromImageBuffer(buf);
  
  const asset = await prisma.asset.create({
    data: {
      fileId: job.fileId,
      ownerId: job.ownerId,
      kind: 'IMAGE',
      width: width ?? undefined,
      height: height ?? undefined,
    },
  });
  
  // Store hash
  await prisma.hash.create({
    data: { assetId: asset.id, kind: 'PHASH', hex64: pHashHex, bucket16: bucket16(pHashHex) },
  });
  
  await storeThumb(asset.id, thumb);
  await clusterAsset(job.ownerId, asset.id, pHashHex);
}

async function handlePdf(job: IngestJobData): Promise<void> {
  const tmp = `/tmp/pdf-${job.fileId}`;
  await fs.mkdir(tmp, { recursive: true });
  const pdfBuf = await downloadS3ToBuffer(job.storageKey);
  const pdfPath = path.join(tmp, 'doc.pdf');
  await fs.writeFile(pdfPath, pdfBuf);
  await execa('pdftoppm', ['-jpeg', '-r', '150', pdfPath, path.join(tmp, 'page')]);
  const files = (await fs.readdir(tmp)).filter((f) => f.startsWith('page-') && f.endsWith('.jpg')).sort();
  let pageIndex = 0;
  for (const file of files) {
    const p = path.join(tmp, file);
    const buf = await fs.readFile(p);
    const { pHashHex, width, height, thumb } = await computePHashFromImageBuffer(buf);
    
    const asset = await prisma.asset.create({
      data: {
        fileId: job.fileId,
        ownerId: job.ownerId,
        kind: 'PDF_PAGE',
        pageIndex,
        width: width ?? undefined,
        height: height ?? undefined,
      },
    });
    
    // Store hash
    await prisma.hash.create({
      data: { assetId: asset.id, kind: 'PHASH', hex64: pHashHex, bucket16: bucket16(pHashHex) },
    });
    
    await storeThumb(asset.id, thumb);
    await clusterAsset(job.ownerId, asset.id, pHashHex);
    pageIndex++;
  }
}

export const worker = new BullWorker<IngestJobData>(
  'ingest',
  async (job) => {
    const { mimeType } = job.data;
    if (mimeType === 'application/pdf') return handlePdf(job.data);
    if (mimeType.startsWith('image/')) return handleImage(job.data);
  },
  { connection }
);

worker.on('completed', (job) => console.log('completed', job.id));
worker.on('failed', (job, err) => console.error('failed', job?.id, err));
