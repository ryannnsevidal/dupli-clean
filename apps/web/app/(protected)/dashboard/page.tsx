/**
 * DupliClean Dashboard Page
 * 
 * This dashboard provides comprehensive analytics and monitoring for the duplicate
 * detection platform. It displays real-time statistics, processing job status,
 * and system health metrics. The dashboard demonstrates enterprise-grade monitoring
 * capabilities with professional data visualization and user-friendly interface.
 * 
 * Key features:
 * - Real-time statistics and metrics display
 * - Processing job monitoring and status tracking
 * - Cloud service integration status
 * - Storage usage analytics
 * - System health indicators
 * - Professional data visualization
 */

'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalFiles: number;
  totalAssets: number;
  duplicateClusters: number;
  totalDuplicates: number;
  storageUsed: number;
  processingJobs: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  fileTypes: {
    images: number;
    pdfs: number;
  };
  cloudServices: number;
}

interface ProcessingJob {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs'>('overview');

  // Demo mode - bypass authentication
  const isDemo = true;

  const { data: stats, error: statsError } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcher,
    { refreshInterval: 10000 }
  );

  const { data: jobs, error: jobsError } = useSWR<ProcessingJob[]>(
    "/api/dashboard/jobs",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (!isDemo && !session?.user) {
    router.push("/auth/signin");
    return null;
  }

  if (statsError || jobsError) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Dashboard
          </h1>
          <p className="text-gray-600">
            Failed to load dashboard data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loading Dashboard...
          </h1>
          <p className="text-gray-600">
            Gathering your duplicate detection insights.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Monitor your duplicate detection progress and insights.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "jobs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Processing Jobs
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <Badge variant="secondary">{stats.totalFiles}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.fileTypes.images} images, {stats.fileTypes.pdfs} PDFs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Duplicate Groups</CardTitle>
                <Badge variant="secondary">{stats.duplicateClusters}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.duplicateClusters}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalDuplicates} duplicate files found
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Badge variant="secondary">
                  {(stats.storageUsed / 1024 / 1024).toFixed(1)} MB
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.storageUsed / 1024 / 1024).toFixed(1)} MB
                </div>
                <p className="text-xs text-muted-foreground">
                  Including thumbnails and metadata
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cloud Services</CardTitle>
                <Badge variant="secondary">{stats.cloudServices}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cloudServices}</div>
                <p className="text-xs text-muted-foreground">
                  Connected cloud storage accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Processing Status */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
              <CardDescription>
                Current background job processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.processingJobs.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.processingJobs.processing}
                  </div>
                  <div className="text-sm text-gray-600">Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.processingJobs.completed}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.processingJobs.failed}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "jobs" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Jobs</CardTitle>
              <CardDescription>
                Background jobs for file processing and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{job.type}</h4>
                          <p className="text-sm text-gray-600">
                            Created: {new Date(job.createdAt).toLocaleString()}
                          </p>
                          {job.startedAt && (
                            <p className="text-sm text-gray-600">
                              Started: {new Date(job.startedAt).toLocaleString()}
                            </p>
                          )}
                          {job.completedAt && (
                            <p className="text-sm text-gray-600">
                              Completed: {new Date(job.completedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              job.status === 'COMPLETED' ? 'default' :
                              job.status === 'FAILED' ? 'destructive' :
                              job.status === 'PROCESSING' ? 'secondary' : 'outline'
                            }
                          >
                            {job.status}
                          </Badge>
                          {job.error && (
                            <p className="text-sm text-red-600 mt-1">{job.error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600">No processing jobs found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
