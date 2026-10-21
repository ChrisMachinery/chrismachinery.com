import type { MetadataRoute } from "next";
import { getBlogPosts, getCatalogProducts, getSitePage, getSolutions } from "@/lib/sanity/fetch";
import { resolveOthersCatalog } from "@/lib/othersCatalog";
import { routing } from "@/i18n/routing";
import { seriesList } from "@/lib/site";
import { localeLanguageMap, localizedHref } from "@/lib/seoCanonical";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, solutions, othersPage] = await Promise.all([
    getCatalogProducts(),
    getBlogPosts(),
    getSolutions(),
    getSitePage("/products/others"),
  ]);
  const others = resolveOthersCatalog(othersPage?._id, othersPage?.othersCards);
  const paths = [
    "/",
    "/about",
    "/solutions",
    "/blog",
    "/contact",
    "/customize",
    ...seriesList.map((series) => `/products/${series}`),
    ...products.filter((item) => item.series !== "others").map((item) => `/products/${item.series}/${item.slug}`),
    ...others.map((row) => `/products/others/${row.item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localizedHref(locale, path),
      changeFrequency: "weekly" as const,
      priority: path === "/" && locale === "en" ? 1 : 0.7,
      alternates: { languages: localeLanguageMap(path) },
    })),
  );
}
