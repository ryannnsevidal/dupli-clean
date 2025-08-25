import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  // Demo mode - allow all access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/import",
    "/duplicates", 
    "/settings",
    "/api/upload/:path*",
    "/api/duplicates/:path*",
    "/api/rclone/:path*",
    "/api/thumb/:path*",
  ],
};
