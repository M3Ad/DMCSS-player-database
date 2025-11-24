import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if accessing protected routes without session
  if (!session && req.nextUrl.pathname.startsWith("/player")) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/";
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to player dashboard if accessing login page while authenticated
  if (session && req.nextUrl.pathname === "/") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/player";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/", "/player/:path*"],
};
