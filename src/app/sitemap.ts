import type { MetadataRoute } from "next";
import { getBlogPosts, getCatalogProducts, getSolutions } from "@/lib/sanity/fetch";
import { seriesList } from "@/lib/site";
import { localeLanguageMap, localizedHref } from "@/lib/seoCanonical";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, solutions] = await Promise.all([
    getCatalogProducts(),
    getBlogPosts(),
    getSolutions(),
  ]);
  const paths = [
    "/",
    "/about",
    "/solutions",
    "/blog",
    "/contact",
    "/customize",
    ...seriesList.map((series) => `/products/${series}`),
    ...products.map((item) => `/products/${item.series}/${item.slug}`),
    ...solutions.map((item) => `/solutions/${item.slug}`),
    ...posts.map((post) => `/blog/${post.slug}`),
  ];
  return paths.map((path) => ({
    url: localizedHref("en", path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
    alternates: { languages: localeLanguageMap(path) },
  }));
}
