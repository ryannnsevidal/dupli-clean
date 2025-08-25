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

    // Get recent processing jobs
    const jobs = await prisma.processingJob.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 jobs
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
        error: true,
        payload: true
      }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching processing jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
