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

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // Get user's configured cloud services
    const cloudServices = await prisma.cloudService.findMany({
      where: { 
        ownerId: session.user.id,
        isActive: true 
      },
      select: {
        id: true,
        name: true,
        type: true,
        createdAt: true
      }
    });

    return NextResponse.json({ services: cloudServices });
  } catch (error) {
    console.error('Error fetching cloud services:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, config } = body;

    if (!name || !type || !config) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create cloud service configuration
    const cloudService = await prisma.cloudService.create({
      data: {
        ownerId: session.user.id,
        name,
        type,
        config: config, // Store encrypted config
        isActive: true
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        ownerId: session.user.id,
        action: 'cloud_service_added',
        payload: { serviceId: cloudService.id, type, name }
      }
    });

    return NextResponse.json({ 
      success: true, 
      service: {
        id: cloudService.id,
        name: cloudService.name,
        type: cloudService.type
      }
    });
  } catch (error) {
    console.error('Error creating cloud service:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
