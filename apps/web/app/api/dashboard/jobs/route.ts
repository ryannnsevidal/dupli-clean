import { NextResponse } from 'next/server';

export async function GET() {
  // Demo data for processing jobs
  const demoJobs = [
    {
      id: 'job-1',
      type: 'IMAGE_PROCESSING',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      startedAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: 'job-2',
      type: 'PDF_PROCESSING',
      status: 'PROCESSING',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      startedAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    },
    {
      id: 'job-3',
      type: 'DUPLICATE_DETECTION',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: 'job-4',
      type: 'CLOUD_IMPORT',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    },
    {
      id: 'job-5',
      type: 'IMAGE_PROCESSING',
      status: 'FAILED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 3 + 1000 * 30).toISOString(),
      error: 'Invalid file format',
    },
  ];

  return NextResponse.json(demoJobs);
}
