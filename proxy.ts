import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16 Proxy (formerly middleware.ts).
 *
 * Runs on every matched request. Handles:
 * 1. Supabase session refresh (token rotation)
 * 2. Admin route protection (/admin/* requires valid session)
 */
export async function proxy(request: NextRequest) {
  const { response, supabase } = await updateSession(request);

  // Protect /admin/* routes — redirect unauthenticated users to login
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow the login page itself to pass through
    if (request.nextUrl.pathname === "/admin/login") {
      return response;
    }

    // Check for a valid session
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|eot|ttf|otf)$).*)",
  ],
};
