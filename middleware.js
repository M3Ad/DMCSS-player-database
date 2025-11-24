import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  
  // Only protect /player and /coach routes
  // Don't interfere with redirects or the login page
  if (req.nextUrl.pathname.startsWith("/player") || req.nextUrl.pathname.startsWith("/coach")) {
    const supabase = createMiddlewareClient({ req, res });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Redirect to login if accessing protected routes without session
      if (!session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Middleware error:", error);
      // On error, redirect to login to be safe
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/player/:path*", "/coach/:path*"],
};
