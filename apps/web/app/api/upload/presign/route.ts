import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { presignRequestSchema } from "@dupli/shared";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createSlidingWindowLimiter } from "@dupli/shared/rateLimit";

const s3 = new S3Client({
  forcePathStyle: true,
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const limit = createSlidingWindowLimiter({
  redisUrl: process.env.REDIS_URL!,
  windowSeconds: 10,
  max: 20, // 20 req/10s per user
  prefix: "presign",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(auth);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const key = `${session.user.id}`;
    const gate = await limit(key);
    if (!gate.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json();
    const validation = presignRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { filename, mimeType } = validation.data;
    const key = `${session.user.id}/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: mimeType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({
      url: signedUrl,
      key,
    });
  } catch (error) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
