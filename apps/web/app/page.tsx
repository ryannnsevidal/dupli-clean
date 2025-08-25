'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Temporarily bypass authentication for demo
  const isDemo = true;

  useEffect(() => {
    if (!isDemo && status === 'authenticated' && session?.user) {
      router.push('/dashboard');
    }
  }, [session, status, router, isDemo]);

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

  if (!isDemo && status === 'authenticated') {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🧹</div>
              <span className="font-bold text-xl text-gray-900">DupliClean</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find & Remove Duplicates
            <span className="text-blue-600"> Intelligently</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            DupliClean uses advanced ML algorithms and perceptual hashing to detect duplicate 
            images and PDFs across your entire digital collection. Save storage space and 
            organize your files with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Advanced Detection
            </h3>
            <p className="text-gray-600">
              Uses perceptual hashing and ML embeddings to find near-duplicates, 
              not just exact matches.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">☁️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Cloud Integration
            </h3>
            <p className="text-gray-600">
              Import files from Google Drive, Dropbox, OneDrive, and 50+ other 
              cloud services.
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast & Scalable
            </h3>
            <p className="text-gray-600">
              Background processing with hash bucketing for O(log n) performance 
              on large collections.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Cloud Services</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">ML Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">∞</div>
              <div className="text-gray-600">File Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Secure</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 DupliClean. Built with Next.js, TypeScript, and modern ML algorithms.
          </p>
        </div>
      </footer>
    </div>
  );
}
