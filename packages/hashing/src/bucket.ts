import { bucket16 } from './phash';

// Re-export bucket16 from phash
export { bucket16 };

// Get candidate buckets for hash comparison
export function getCandidateBuckets(bucket: number): number[] {
  // Return the bucket and its neighbors for candidate search
  return [bucket - 1, bucket, bucket + 1].filter(b => b >= 0 && b <= 0xFFFF);
}

export function getBucketRange(hex64: string): number[] {
  const bucket = bucket16(hex64);
  return getCandidateBuckets(bucket);
}
