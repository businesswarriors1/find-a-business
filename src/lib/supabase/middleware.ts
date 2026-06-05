import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Updates the Supabase auth session in the proxy (middleware) layer.
 *
 * Called from `proxy.ts` for every request that matches the proxy matcher.
 * Refreshes expired tokens and sets updated cookies on the response.
 *
 * After calling this, pass the response and the supabase client
 * downstream. To check for a session later in RSC/route handlers,
 * use the server client which reads cookies directly.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Prevent CDNs from caching auth responses
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // IMPORTANT: MUST call getUser() (not getSession()) in the proxy layer.
  // getSession() reads the session from cookies without verification,
  // but we need to trigger a token refresh if the access token is expired.
  // DO NOT use getUser() to make authorization decisions in the proxy —
  // authorize in route handlers and server components instead.
  await supabase.auth.getUser();

  return { supabase, response: supabaseResponse };
}
