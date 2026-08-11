import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  // const sessionCookie = request.cookies.get("sb-access-token")?.value;

  // const {pathname} = request.nextUrl;

  // const isProtectedRoute = pathname.startsWith("/parents") || pathname.startsWith("/registrar") || pathname.startsWith("/executive") || pathname.startsWith("/admin") || pathname.startsWith("/ops");

  // if (isProtectedRoute && !sessionCookie) {

  //   const loginUrl = new URL ("/login", request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  // return NextResponse.next();

}

  export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  };