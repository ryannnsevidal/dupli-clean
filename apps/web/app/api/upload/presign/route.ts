import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { filename, mimeType } = await req.json();

    // Demo response for presigned URL
    const demoResponse = {
      url: `https://demo-s3.dupliclean.com/upload/${Date.now()}-${filename}`,
      key: `uploads/${Date.now()}-${filename}`,
      expiresIn: 3600, // 1 hour
    };

    return NextResponse.json(demoResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
