import { NextResponse } from 'next/server';

export async function GET() {
  // Demo data for cloud services
  const demoCloudServices = [
    {
      id: 'google-drive-1',
      name: 'Google Drive',
      type: 'GOOGLE_DRIVE',
      isActive: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      fileCount: 456,
      totalSize: 15.2 * 1024 * 1024 * 1024, // 15.2 GB
    },
    {
      id: 'dropbox-1',
      name: 'Dropbox',
      type: 'DROPBOX',
      isActive: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      fileCount: 234,
      totalSize: 8.7 * 1024 * 1024 * 1024, // 8.7 GB
    },
    {
      id: 'onedrive-1',
      name: 'OneDrive',
      type: 'ONEDRIVE',
      isActive: false,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
      fileCount: 123,
      totalSize: 3.1 * 1024 * 1024 * 1024, // 3.1 GB
    },
  ];

  return NextResponse.json(demoCloudServices);
}
