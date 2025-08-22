import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@dupli/db';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { deleteDuplicatesSchema } from '@dupli/shared';

const prisma = new PrismaClient();
const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: { 
    accessKeyId: process.env.S3_ACCESS_KEY!, 
    secretAccessKey: process.env.S3_SECRET_KEY! 
  }
});

export async function POST(
  req: NextRequest, 
  { params }: { params: { clusterId: string } }
) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { deleteAssetIds } = deleteDuplicatesSchema.parse(body);
    const clusterId = params.clusterId;

    const members = await prisma.clusterMember.findMany({ 
      where: { clusterId }, 
      include: { 
        asset: { 
          include: { 
            file: true 
          } 
        } 
      } 
    });

    const deletable = members.filter(m => deleteAssetIds.includes(m.assetId));

    await prisma.$transaction(async (tx) => {
      for (const m of deletable) {
        // Delete from S3
        await s3.send(new DeleteObjectCommand({ 
          Bucket: process.env.S3_BUCKET!, 
          Key: m.asset.file.storageKey 
        }));

        // Delete thumbnail if exists
        if (m.asset.thumbKey) {
          await s3.send(new DeleteObjectCommand({ 
            Bucket: process.env.S3_BUCKET!, 
            Key: m.asset.thumbKey 
          }));
        }

        // Delete from database
        await tx.hash.deleteMany({ where: { assetId: m.assetId } });
        await tx.asset.delete({ where: { id: m.assetId } });
        await tx.file.delete({ where: { id: m.asset.fileId } });
      }

      // Create audit log
      await tx.auditLog.create({ 
        data: { 
          ownerId: session.user.id, 
          action: 'delete_duplicates', 
          payload: { clusterId, deleteAssetIds } 
        } 
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
