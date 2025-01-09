import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { updateSession } from "../utils/supabase/middleware";

export async function middleware(request: any) {
  const token: any = await getToken({ req: request });
  request.nextauth = request.nextauth || {};
  request.nextauth.token = token;
  const pathname = request.nextUrl.pathname;
  let signInUrl;

  if (token?.user) {
    if (
      token?.user?.role === "sucursal" &&
      !pathname.startsWith("/puntodeventa")
    ) {
      signInUrl = new URL("/puntodeventa", request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (
      token?.user?.role === "sucursal_principal" &&
      !pathname.startsWith("/puntodeventa")
    ) {
      signInUrl = new URL("/puntodeventa", request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role === "manager" && !pathname.includes("admin")) {
      signInUrl = new URL("/admin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (pathname.includes("admin")) {
    //if admin user is not logged in
    if (!token) {
      signInUrl = new URL("/api/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role !== "manager") {
      signInUrl = new URL("/no-autorizado", request.url);
      return NextResponse.redirect(signInUrl);
    }

    if (token?.user?.role === "manager" && pathname.includes("/admin/videos")) {
      return await updateSession(request);
    }
    if (token?.user?.role === "manager" && pathname.includes("/admin/signup")) {
      return await updateSession(request);
    }
  }

  if (pathname.includes("puntodeventa")) {
    //if admin user is not logged in
    let signInUrl;
    if (!token) {
      signInUrl = new URL("/api/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (
      token?.user?.role === "sucursal_principal" &&
      pathname.includes("/puntodeventa/publicaciones")
    ) {
      return await updateSession(request);
    }
    if (
      token?.user?.role === "sucursal_principal" &&
      pathname.includes("/puntodeventa/signup")
    ) {
      return await updateSession(request);
    }

    if (
      token?.user?.role !== "sucursal" &&
      token?.user?.role !== "sucursal_principal"
    ) {
      signInUrl = new URL("/no-autorizado", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|icons|logos|covers).*)",
  ],
};
