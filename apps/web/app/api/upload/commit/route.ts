import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@dupli/db';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { uploadCommitSchema } from '@dupli/shared';

const prisma = new PrismaClient();
const ingest = new Queue('ingest', { 
  connection: new Redis(process.env.REDIS_URL!) 
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { key, filename, mimeType, byteSize, sha256Hex } = uploadCommitSchema.parse(body);

    const file = await prisma.file.create({ 
      data: { 
        projectId: await ensureDefaultProject(session.user.id), 
        ownerId: session.user.id, 
        originalName: filename, 
        mimeType, 
        byteSize: BigInt(byteSize), 
        storageKey: key, 
        sha256Hex, 
        status: 'UPLOADED' 
      } 
    });

    await ingest.add('ingest', { 
      ownerId: session.user.id, 
      fileId: file.id, 
      storageKey: key, 
      mimeType 
    });

    await prisma.file.update({ 
      where: { id: file.id }, 
      data: { status: 'PROCESSED' } 
    });

    return NextResponse.json({ ok: true, fileId: file.id });
  } catch (error) {
    console.error('Commit error:', error);
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}

async function ensureDefaultProject(ownerId: string) {
  const p = await prisma.project.findFirst({ where: { ownerId } });
  if (p) return p.id;
  const n = await prisma.project.create({ data: { ownerId } });
  return n.id;
}
