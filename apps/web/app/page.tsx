import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';
import { prisma } from '@dupli/db';

export default async function HomePage() {
  const session = await getServerSession(auth);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Check if user has any files
  const fileCount = await prisma.file.count({
    where: { ownerId: session.user.id }
  });

  if (fileCount === 0) {
    redirect('/import');
  } else {
    redirect('/duplicates');
  }
}
