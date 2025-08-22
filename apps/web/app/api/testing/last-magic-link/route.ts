import { NextRequest, NextResponse } from "next/server";
import Redis from "ioredis";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  
  const rc = new Redis(process.env.REDIS_URL!);
  const url = await rc.get(`test:last-magic:${email.toLowerCase()}`);
  
  if (!url) return NextResponse.json({ error: "not-found" }, { status: 404 });
  
  return NextResponse.json({ url });
}
