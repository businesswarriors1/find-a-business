import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import type { Duration } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const rateLimiters = {
  chat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "fab:rl:chat",
    analytics: true,
    timeout: 3000,
  }),
  reviews: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 d"),
    prefix: "fab:rl:reviews",
    analytics: true,
    timeout: 3000,
  }),
  listing_request: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "1 h"),
    prefix: "fab:rl:listing",
    analytics: true,
    timeout: 3000,
  }),
};

export type RateLimitEndpoint = keyof typeof rateLimiters;

export async function rateLimit(ip: string, endpoint: RateLimitEndpoint) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60_000 };
  }
  try {
    const limiter = rateLimiters[endpoint];
    const result = await limiter.limit(`ip:${ip}`);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    return { success: true, limit: 999, remaining: 999, reset: Date.now() + 60_000 };
  }
}

export async function checkRateLimit(key: string, limit: number, duration: `${number} ${"h" | "d" | "m" | "s"}`) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return { success: true, limit, remaining: limit - 1, reset: Date.now() + 60_000 };
  }
  try {
    const rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, duration as Duration),
      prefix: `fab:rl:${key}`,
      timeout: 3000,
    });
    const result = await rl.limit(key);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    return { success: true, limit, remaining: limit - 1, reset: Date.now() + 60_000 };
  }
}
