import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const fs = url.searchParams.get("fs"); // e.g., "gdrive:Photos/2023"
    if (!fs) return NextResponse.json({ error: "fs required" }, { status: 400 });

    // Demo data for rclone file listings
    const demoItems = [
      {
        Path: "vacation_photos_2024",
        Name: "vacation_photos_2024",
        Size: 15728640,
        MimeType: "inode/directory",
        ModTime: "2024-01-15T10:30:00Z",
        IsDir: true
      },
      {
        Path: "vacation_sunset_original.jpg",
        Name: "vacation_sunset_original.jpg", 
        Size: 2516582,
        MimeType: "image/jpeg",
        ModTime: "2024-01-10T14:22:00Z",
        IsDir: false
      },
      {
        Path: "vacation_sunset_edited.jpg",
        Name: "vacation_sunset_edited.jpg",
        Size: 2202009,
        MimeType: "image/jpeg", 
        ModTime: "2024-01-10T15:45:00Z",
        IsDir: false
      },
      {
        Path: "research_paper_final.pdf",
        Name: "research_paper_final.pdf",
        Size: 2202009,
        MimeType: "application/pdf",
        ModTime: "2024-01-08T09:15:00Z", 
        IsDir: false
      },
      {
        Path: "dashboard_screenshot_2024.png",
        Name: "dashboard_screenshot_2024.png",
        Size: 819200,
        MimeType: "image/png",
        ModTime: "2024-01-12T16:30:00Z",
        IsDir: false
      }
    ];

    return NextResponse.json({ items: demoItems });
  } catch (error) {
    console.error("Failed to list rclone path:", error);
    return NextResponse.json({ error: "Failed to list path" }, { status: 500 });
  }
}
