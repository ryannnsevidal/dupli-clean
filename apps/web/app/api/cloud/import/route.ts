import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@dupli/db';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

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
    const { serviceId, paths, projectId } = body;

    if (!serviceId || !paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get cloud service configuration
    const cloudService = await prisma.cloudService.findFirst({
      where: {
        id: serviceId,
        ownerId: session.user.id,
        isActive: true
      }
    });

    if (!cloudService) {
      return NextResponse.json({ error: 'Cloud service not found' }, { status: 404 });
    }

    // Create processing job
    const processingJob = await prisma.processingJob.create({
      data: {
        ownerId: session.user.id,
        type: 'CLOUD_IMPORT',
        status: 'PENDING',
        payload: {
          serviceId,
          paths,
          projectId,
          serviceType: cloudService.type
        }
      }
    });

    // Queue background import job
    await ingest.add('cloud-import', {
      ownerId: session.user.id,
      jobId: processingJob.id,
      serviceId,
      paths,
      projectId
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        ownerId: session.user.id,
        action: 'cloud_import_started',
        payload: { 
          jobId: processingJob.id,
          serviceId, 
          paths: paths.length,
          serviceType: cloudService.type 
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      jobId: processingJob.id,
      message: `Started importing ${paths.length} files from ${cloudService.name}`
    });
  } catch (error) {
    console.error('Error starting cloud import:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }

    // Get job status
    const job = await prisma.processingJob.findFirst({
      where: {
        id: jobId,
        ownerId: session.user.id,
        type: 'CLOUD_IMPORT'
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      result: job.result,
      error: job.error,
      startedAt: job.startedAt,
      completedAt: job.completedAt
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
