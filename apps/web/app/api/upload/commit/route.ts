import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { key, filename, mimeType, size } = await req.json();

    // Demo response for file commit
    const demoResponse = {
      fileId: `file-${Date.now()}`,
      status: 'UPLOADED',
      message: `File ${filename} uploaded successfully`,
      processingJobId: `job-${Date.now()}`,
    };

    return NextResponse.json(demoResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
