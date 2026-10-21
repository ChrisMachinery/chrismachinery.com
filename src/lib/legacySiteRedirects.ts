/** Old WordPress / Elementor paths → current Next.js pages. */
const EXACT: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/food-trailer-photos": "/products/pod",
  "/food-trailers-photos": "/products/pod",
  "/trailer-photos": "/products/pod",
  "/trailer-pizza": "/solutions",
  "/pizza-trailer": "/solutions",
  "/coffee-trailer": "/solutions/coffee-shop",
  "/ice-cream-trailer": "/solutions/ice-cream",
  "/food-trailer": "/products/pod",
  "/food-truck": "/products/pod",
  "/airstream-food-trailer": "/products/airstream",
  "/container-food-trailer": "/products/container",
  "/square-food-trailer": "/products/square",
};

const LOCALES = ["es", "fr", "ar"] as const;

function splitLocale(pathname: string) {
  const match = pathname.match(/^\/(es|fr|ar)(?=\/|$)/);
  if (!match) return { locale: "", rest: pathname || "/" };
  const rest = pathname.slice(match[0].length) || "/";
  return { locale: match[1], rest: rest.startsWith("/") ? rest : `/${rest}` };
}

function withLocale(locale: string, path: string) {
  if (!locale) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

export function legacyPathRedirect(pathname: string): string | null {
  const clean = (pathname.replace(/\/+$/, "") || "/") as string;
  const { locale, rest } = splitLocale(clean);
  const key = rest.replace(/\/+$/, "") || "/";
  const mapped = EXACT[key];
  if (mapped) return withLocale(locale, mapped);
  if (/^\/elementor-\d+$/.test(key)) return withLocale(locale, "/");
  if (/^\/(wp-admin|wp-content|wp-includes|wp-json)(\/|$)/.test(key)) return withLocale(locale, "/");
  if (/^\/(category|tag|author|attachment|shop|cart|checkout|my-account)(\/|$)/.test(key)) {
    return withLocale(locale, "/");
  }
  if (/^\/feed(\/|$)/.test(key)) return withLocale(locale, "/");
  if (/^\/index\.(php|html)$/.test(key)) return withLocale(locale, "/");
  return null;
}

/** Static Next redirects for files the proxy matcher skips (php, uploads). */
export function legacyFileRedirects() {
  const rows: { source: string; destination: string; permanent: true }[] = [];
  const add = (source: string, destination: string) => {
    rows.push({ source, destination, permanent: true });
    for (const locale of LOCALES) {
      rows.push({
        source: `/${locale}${source}`,
        destination: destination === "/" ? `/${locale}` : `/${locale}${destination}`,
        permanent: true,
      });
    }
  };
  add("/elementor-:id", "/");
  add("/food-trailer-photos", "/products/pod");
  add("/food-trailers-photos", "/products/pod");
  add("/trailer-photos", "/products/pod");
  add("/trailer-pizza", "/solutions");
  add("/pizza-trailer", "/solutions");
  add("/about-us", "/about");
  add("/contact-us", "/contact");
  add("/wp-content/:path*", "/");
  add("/wp-includes/:path*", "/");
  add("/wp-admin/:path*", "/");
  add("/wp-json/:path*", "/");
  add("/wp-login.php", "/");
  add("/xmlrpc.php", "/");
  add("/index.php", "/");
  add("/feed", "/");
  add("/comments/feed", "/");
  return rows;
}
