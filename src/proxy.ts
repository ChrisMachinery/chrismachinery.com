import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isProductDetailPath } from "./lib/productUrl";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  if (request.nextUrl.search && isProductDetailPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.search = "";
    return NextResponse.redirect(url, 301);
  }
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
