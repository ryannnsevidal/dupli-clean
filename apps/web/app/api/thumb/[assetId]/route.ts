import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@dupli/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();
const s3 = new S3Client({ 
  forcePathStyle: true, 
  endpoint: process.env.S3_ENDPOINT, 
  region: process.env.S3_REGION, 
  credentials: { 
    accessKeyId: process.env.S3_ACCESS_KEY!, 
    secretAccessKey: process.env.S3_SECRET_KEY! 
  } 
});

export async function GET(
  _req: NextRequest, 
  { params }: { params: { assetId: string } }
) {
  try {
    const asset = await prisma.asset.findUnique({ 
      where: { id: params.assetId } 
    });
    
    if (!asset?.thumbKey) {
      return new NextResponse('not found', { status: 404 });
    }
    
    const res: any = await s3.send(new GetObjectCommand({ 
      Bucket: process.env.S3_BUCKET!, 
      Key: asset.thumbKey 
    }));
    
    const buf = Buffer.from(await res.Body!.transformToByteArray());
    
    return new NextResponse(buf, { 
      headers: { 
        'Content-Type': 'image/jpeg', 
        'Cache-Control': 'public, max-age=31536000, immutable' 
      } 
    });
  } catch (error) {
    console.error('Thumbnail error:', error);
    return new NextResponse('not found', { status: 404 });
  }
}
