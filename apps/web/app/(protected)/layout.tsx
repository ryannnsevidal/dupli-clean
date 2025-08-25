'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Demo mode - bypass authentication for testing
  const isDemo = true;
  const demoUser = { email: 'demo@dupliclean.com' };

  if (!isDemo && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isDemo && !session?.user) {
    router.push('/auth/signin');
    return null;
  }

  const currentUser = isDemo ? demoUser : session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl"> </div>
                <span className="font-bold text-xl text-gray-900">DupliClean</span>
              </Link>
              
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/import"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Import
                </Link>
                <Link 
                  href="/duplicates"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Duplicates
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isDemo && (
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                  DEMO MODE
                </div>
              )}
              <div className="text-sm text-gray-700">
                {currentUser?.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isDemo ? router.push('/') : signOut()}
              >
                {isDemo ? 'Exit Demo' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}
