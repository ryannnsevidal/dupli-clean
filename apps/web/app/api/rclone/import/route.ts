import { NextRequest, NextResponse } from "next/server";
import { rc } from "@/lib/rclone";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) return NextResponse.json({ error: "unauth" }, { status: 401 });

    const { fs, includePatterns } = await req.json() as { fs: string, includePatterns?: string[] };
    if (!fs) return NextResponse.json({ error: "fs required" }, { status: 400 });

    const userPrefix = `${session.user.id}/${cryptoRandom()}/`;
    const dst = `dupli-s3:${process.env.S3_BUCKET}/${userPrefix}`;

    const filters = (includePatterns?.length ? includePatterns : ["*.jpg","*.jpeg","*.png","*.webp","*.gif","*.pdf"])
      .map(p => `--include=${p}`);

    // Launch a background copy job (non-blocking)
    const job = await rc("job/start", {
      command: "sync/copy",
      _config: {},
      // arguments to rclone's copy
      fs, dst,
      _async: true,
      _flags: filters,
    });

    // Return job id and the prefix we will monitor
    return NextResponse.json({ ok: true, jobid: job.jobid, prefix: userPrefix });
  } catch (error) {
    console.error("Failed to start rclone import:", error);
    return NextResponse.json({ error: "Failed to start import" }, { status: 500 });
  }
}

function cryptoRandom() { 
  return Math.random().toString(36).slice(2); 
}
