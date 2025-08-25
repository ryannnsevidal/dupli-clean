import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@dupli/db';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const ownerId = session.user.id;

    // Get basic file statistics
    const [totalFiles, totalAssets, duplicateClusters] = await Promise.all([
      prisma.file.count({ where: { ownerId } }),
      prisma.asset.count({ where: { ownerId } }),
      prisma.duplicateCluster.count({ where: { ownerId } })
    ]);

    // Get total duplicates (non-keeper assets in clusters)
    const totalDuplicates = await prisma.clusterMember.count({
      where: {
        cluster: { ownerId },
        isKeeper: false
      }
    });

    // Get storage usage (sum of file sizes)
    const storageResult = await prisma.file.aggregate({
      where: { ownerId },
      _sum: { byteSize: true }
    });
    const storageUsed = Number(storageResult._sum.byteSize || 0);

    // Get file type breakdown
    const fileTypes = await prisma.file.groupBy({
      by: ['mimeType'],
      where: { ownerId },
      _count: { mimeType: true }
    });

    const images = fileTypes
      .filter(f => f.mimeType.startsWith('image/'))
      .reduce((sum, f) => sum + f._count.mimeType, 0);
    
    const pdfs = fileTypes
      .filter(f => f.mimeType === 'application/pdf')
      .reduce((sum, f) => sum + f._count.mimeType, 0);

    // Get processing job statistics
    const jobStats = await prisma.processingJob.groupBy({
      by: ['status'],
      where: { ownerId },
      _count: { status: true }
    });

    const processingJobs = {
      pending: jobStats.find(j => j.status === 'PENDING')?._count.status || 0,
      processing: jobStats.find(j => j.status === 'PROCESSING')?._count.status || 0,
      completed: jobStats.find(j => j.status === 'COMPLETED')?._count.status || 0,
      failed: jobStats.find(j => j.status === 'FAILED')?._count.status || 0,
    };

    // Get cloud services count
    const cloudServices = await prisma.cloudService.count({
      where: { ownerId, isActive: true }
    });

    return NextResponse.json({
      totalFiles,
      totalAssets,
      duplicateClusters,
      totalDuplicates,
      storageUsed,
      processingJobs,
      fileTypes: { images, pdfs },
      cloudServices
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
