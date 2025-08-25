import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Demo data for rclone remotes
    const demoRemotes = [
      "google-drive",
      "dropbox", 
      "onedrive",
      "box",
      "amazon-s3"
    ];
    
    return NextResponse.json({ remotes: demoRemotes });
  } catch (error) {
    console.error("Failed to get rclone remotes:", error);
    return NextResponse.json({ error: "Failed to get remotes" }, { status: 500 });
  }
}
