import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 Proxy
 *
 * Runs before every matched request. Replaces deprecated middleware convention.
 * Currently: guards admin routes and sets security headers.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Admin Route Guard ────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session")?.value;

    if (!adminSession) {
      // In development we skip the guard to allow easy prototyping.
      if (process.env.NODE_ENV === "production") {
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // ─── Security Headers ─────────────────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  // Match all paths except static files, Next.js internals, and image assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
