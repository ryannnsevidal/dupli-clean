import IORedis from "ioredis";

export function createSlidingWindowLimiter(opts: {
  redisUrl: string;
  windowSeconds: number;
  max: number;
  prefix?: string;
}) {
  const redis = new IORedis(opts.redisUrl);
  const prefix = opts.prefix ?? "ratelimit";
  return async function limit(key: string): Promise<{ allowed: boolean; remaining: number }> {
    const now = Date.now();
    const windowMs = opts.windowSeconds * 1000;
    const bucket = `${prefix}:${key}`;
    const tx = redis.multi();
    // use ZSET of timestamps, trim older than window
    tx.zremrangebyscore(bucket, 0, now - windowMs);
    tx.zadd(bucket, now, `${now}`);
    tx.zcard(bucket);
    tx.expire(bucket, opts.windowSeconds + 1);
    const [, , count] = (await tx.exec()) as [unknown, unknown, number, unknown];
    return { allowed: count <= opts.max, remaining: Math.max(0, opts.max - count) };
  };
}
