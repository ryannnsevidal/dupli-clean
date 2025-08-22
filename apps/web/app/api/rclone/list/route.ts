import { NextRequest, NextResponse } from "next/server";
import { rc } from "@/lib/rclone";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const fs = url.searchParams.get("fs"); // e.g., "gdrive:Photos/2023"
    if (!fs) return NextResponse.json({ error: "fs required" }, { status: 400 });

    // Either call operations/list or lsjson via core/command
    const out = await rc("core/command", { command: "lsjson", arg: [fs] });
    return NextResponse.json({ items: out.result });
  } catch (error) {
    console.error("Failed to list rclone path:", error);
    return NextResponse.json({ error: "Failed to list path" }, { status: 500 });
  }
}
