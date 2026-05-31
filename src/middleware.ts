import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

function localeFromPath(pathname: string): string | null {
  const seg = pathname.split("/")[1];
  return (locales as readonly string[]).includes(seg) ? seg : null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area is not localized — treat as default locale, LTR.
  if (pathname.startsWith("/admin")) {
    const headers = new Headers(req.headers);
    headers.set("x-locale", defaultLocale);
    return NextResponse.next({ request: { headers } });
  }

  const current = localeFromPath(pathname);
  if (current) {
    const headers = new Headers(req.headers);
    headers.set("x-locale", current);
    return NextResponse.next({ request: { headers } });
  }

  // No locale prefix → redirect to the default locale.
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
