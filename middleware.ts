import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/proposals", "/profile", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isProtected) {
    const sessionToken = request.cookies.get("better-auth.session_token");
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
