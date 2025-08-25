import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fs, includePatterns } = await req.json() as { fs: string, includePatterns?: string[] };
    if (!fs) return NextResponse.json({ error: "fs required" }, { status: 400 });

    // Demo response for rclone import
    const demoResponse = {
      ok: true,
      jobid: `demo-job-${Date.now()}`,
      prefix: `demo-user/${Math.random().toString(36).slice(2)}/`,
      message: `Starting import from ${fs}`,
      estimatedFiles: Math.floor(Math.random() * 50) + 20, // 20-70 files
      estimatedSize: (Math.random() * 2 + 0.5) * 1024 * 1024 * 1024, // 0.5-2.5 GB
    };

    return NextResponse.json(demoResponse);
  } catch (error) {
    console.error("Failed to start rclone import:", error);
    return NextResponse.json({ error: "Failed to start import" }, { status: 500 });
  }
}
