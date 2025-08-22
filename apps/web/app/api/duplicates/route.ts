import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@dupli/db';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ groups: [] });
    }

    const clusters = await prisma.duplicateCluster.findMany({ 
      where: { ownerId: session.user.id }, 
      include: { 
        members: { 
          include: { 
            asset: {
              include: {
                file: true
              }
            } 
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ groups: clusters });
  } catch (error) {
    console.error('Error fetching duplicates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
