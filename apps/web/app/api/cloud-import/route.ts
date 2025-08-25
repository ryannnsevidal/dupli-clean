import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, folderPath } = body;

    // Demo response for cloud import
    const demoResponse = {
      jobId: `cloud-import-${Date.now()}`,
      status: 'PENDING',
      message: `Starting import from ${serviceId}${folderPath ? ` (${folderPath})` : ''}`,
      estimatedFiles: Math.floor(Math.random() * 100) + 50, // Random number between 50-150
      estimatedSize: (Math.random() * 5 + 1) * 1024 * 1024 * 1024, // Random size between 1-6 GB
    };

    return NextResponse.json(demoResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
