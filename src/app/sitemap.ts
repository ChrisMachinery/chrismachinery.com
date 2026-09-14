import type { MetadataRoute } from "next";
import { getBlogPosts, getCatalogProducts } from "@/lib/sanity/fetch";
import { seriesList, SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

function localized(path: string) {
  return routing.locales.map((locale) => {
    const href =
      locale === "en"
        ? `${SITE_URL}${path}`
        : `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
    return href;
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getCatalogProducts(), getBlogPosts()]);
  const paths = [
    "/",
    "/about",
    "/solutions",
    "/blog",
    "/contact",
    "/customize",
    ...seriesList.map((series) => `/products/${series}`),
    ...products.map((item) => `/products/${item.series}/${item.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ];
  return paths.flatMap((path) =>
    localized(path).map((url) => ({ url, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 })),
  );
}
