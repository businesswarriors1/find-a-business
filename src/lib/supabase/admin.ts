import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import "server-only";

/**
 * Service-role Supabase client — bypasses RLS entirely.
 *
 * Uses SUPABASE_SERVICE_ROLE_KEY which MUST NEVER be exposed to the client.
 * This module is marked with "server-only" to prevent accidental client imports.
 *
 * ⚠️ Use sparingly — prefer the anon-key server client whenever possible
 * so RLS policies remain in effect.
 */
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "The admin client requires both environment variables."
    );
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Singleton — lazy-created on first access
let adminClient: ReturnType<typeof createAdminClient> | null = null;

export function createClient() {
  if (!adminClient) {
    adminClient = createAdminClient();
  }
  return adminClient;
}

/**
 * Reset the cached admin client (useful in tests).
 */
export function resetAdminClient() {
  adminClient = null;
}
