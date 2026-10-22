import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/app/lib/admin-session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect everything under /admin except the login page + login API
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/api/admin/login");
  if (isLogin) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySessionToken(token);
  if (!ok) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
