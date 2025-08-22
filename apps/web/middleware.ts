export { default } from "next-auth/middleware";

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
