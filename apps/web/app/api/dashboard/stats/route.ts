import { NextResponse } from 'next/server';

export async function GET() {
  // Comprehensive synthetic test data statistics
  const demoStats = {
    totalFiles: 16, // Total files across all clusters
    totalAssets: 16,
    duplicateClusters: 5, // 5 clusters: vacation, screenshot, scan, paper, report
    totalDuplicates: 11, // 11 duplicates (non-keepers)
    storageUsed: 25.8 * 1024 * 1024, // ~25.8 MB total
    processingJobs: {
      pending: 2,
      processing: 1,
      completed: 156,
      failed: 3,
    },
    fileTypes: {
      images: 9, // 9 image files across 3 clusters
      pdfs: 5, // 5 PDF files across 2 clusters
    },
    cloudServices: 3,
    averageSimilarity: 0.91, // Average across all clusters
  };

  return NextResponse.json(demoStats);
}
