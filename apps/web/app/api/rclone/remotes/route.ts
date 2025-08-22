import { NextResponse } from "next/server";
import { rc } from "@/lib/rclone";

export async function GET() {
  try {
    // returns the names of configured remotes
    const dump = await rc<{ remotes: Record<string, any> }>("config/dump");
    return NextResponse.json({ remotes: Object.keys(dump.remotes || {}) });
  } catch (error) {
    console.error("Failed to get rclone remotes:", error);
    return NextResponse.json({ error: "Failed to get remotes" }, { status: 500 });
  }
}
