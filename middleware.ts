import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, validSession } from "@/lib/admin-auth";

// Everything under /admin needs a signed session, except the login page.
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  if (await validSession(req.cookies.get(SESSION_COOKIE)?.value)) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  const login = req.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
