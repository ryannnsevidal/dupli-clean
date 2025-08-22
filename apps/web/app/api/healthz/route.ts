import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: Date.now(),
    deps: {
      postgres: "assumed-up (see docker healthcheck)",
      redis: "assumed-up",
      s3: "assumed-up",
    },
  });
}
