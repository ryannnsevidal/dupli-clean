export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/import",
    "/duplicates",
    "/settings",
    "/api/(?!auth|testing|healthz|metrics).*",
  ],
};
