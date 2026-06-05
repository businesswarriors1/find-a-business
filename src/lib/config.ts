import "server-only";

// ---------------------------------------------------------------------------
// Client-safe environment variables (prefixed with NEXT_PUBLIC_)
// These are inlined at build time and safe to use in any context.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://findabusiness.com.au";

// ---------------------------------------------------------------------------
// Server-only environment variables
// These are ONLY accessible in server components, route handlers,
// server actions, and the proxy layer.
// ---------------------------------------------------------------------------

function requireServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server-side environment variable: ${name}`);
  }
  return value;
}

function getServerEnv(name: string): string | undefined {
  return process.env[name];
}

/** Supabase service role key — bypasses RLS. NEVER expose client-side. */
export const SUPABASE_SERVICE_ROLE_KEY = getServerEnv("SUPABASE_SERVICE_ROLE_KEY");

/** Resend API key for transactional emails. */
export const RESEND_API_KEY = getServerEnv("RESEND_API_KEY");

/** Upstash Redis REST URL for rate limiting. */
export const UPSTASH_REDIS_REST_URL = getServerEnv("UPSTASH_REDIS_REST_URL");

/** Upstash Redis REST token for rate limiting. */
export const UPSTASH_REDIS_REST_TOKEN = getServerEnv("UPSTASH_REDIS_REST_TOKEN");

/** Anthropic API key for the AI chat intake. */
export const ANTHROPIC_API_KEY = getServerEnv("ANTHROPIC_API_KEY");

/** Google Maps Embed API key. */
export const GOOGLE_MAPS_API_KEY = getServerEnv("GOOGLE_MAPS_API_KEY");

/** Slack webhook URL for listing/review alerts. */
export const SLACK_WEBHOOK_URL = getServerEnv("SLACK_WEBHOOK_URL");

/** Admin notification email. */
export const ADMIN_EMAIL = getServerEnv("ADMIN_EMAIL") ?? "admin@findabusiness.com.au";

// ---------------------------------------------------------------------------
// Validation helpers for boot-time checks
// ---------------------------------------------------------------------------

export function validateClientConfig(): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing required client-side env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
}

export function getServerEnvSafe(): Record<string, string | undefined> {
  return {
    SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY,
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
    ANTHROPIC_API_KEY,
    GOOGLE_MAPS_API_KEY,
    SLACK_WEBHOOK_URL,
    ADMIN_EMAIL,
  };
}
