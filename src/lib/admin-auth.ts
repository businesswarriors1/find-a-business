import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Verify the current request comes from a logged-in admin.
 *
 * Reads the Supabase session from cookies and validates the JWT via getUser()
 * (which calls Supabase Auth — it does not trust the cookie blindly). When
 * ADMIN_EMAIL is set, the user's email must match it (single-admin V1 model).
 *
 * Returns the authenticated user, or null if not authorised.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (allowed && data.user.email?.toLowerCase() !== allowed) return null;

  return data.user;
}
