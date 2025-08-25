import { NextResponse } from 'next/server';
import { PrismaClient } from '@dupli/db';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Test Redis connection (if available)
    let redisStatus = 'unknown';
    try {
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL);
      await redis.ping();
      redisStatus = 'connected';
      redis.disconnect();
    } catch (error) {
      redisStatus = 'disconnected';
    }
    
    // Test S3 connection (if available)
    let s3Status = 'unknown';
    try {
      const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
      const s3 = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
      });
      await s3.send(new ListBucketsCommand({}));
      s3Status = 'connected';
    } catch (error) {
      s3Status = 'disconnected';
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        database: 'connected',
        redis: redisStatus,
        s3: s3Status,
      },
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
