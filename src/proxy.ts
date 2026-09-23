import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { isProductDetailPath } from "./lib/productUrl";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 301);
  }

  if (url.search && isProductDetailPath(pathname)) {
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  const blog = pathname.match(/^(\/(?:es|fr|ar))?\/blog\/([^/]+)\/?$/i);
  if (blog) {
    const localePrefix = blog[1] || "";
    const slug = blog[2];
    if (slug !== slug.toLowerCase()) {
      url.pathname = `${localePrefix}/blog/${slug.toLowerCase()}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return intl(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
