import { NextResponse } from "next/server";

// Cursor: wire real counters in shared logger/metrics later; stubbed for now.
let boot = Date.now();
export async function GET() {
  const lines = [
    `# HELP dupli_uptime_milliseconds Uptime since boot`,
    `# TYPE dupli_uptime_milliseconds gauge`,
    `dupli_uptime_milliseconds ${Date.now() - boot}`,
  ];
  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/plain; version=0.0.4" } });
}
