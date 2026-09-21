import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/blog/BlogList";
import { Hreflang } from "@/components/seo/JsonLd";
import { getBlogPosts, getSitePage } from "@/lib/sanity/fetch";
import { stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return withCanonical(locale, "/blog", {
    title: "Blog | Food Trailer Guides & Cases - Chris Machinery",
    description: "Buying guides, industry news, and customer case studies.",
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getBlogPosts();
  const page = await getSitePage("/blog");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path="/blog" />
      <h1 className="type-page">
        {stegaText(page?._id, "sitePage", "title", uiText(locale, page?.title, t("title")))}
      </h1>
      <p className="type-lede mt-3 mb-8 max-w-3xl">
        {stegaText(page?._id, "sitePage", "subtitle", uiText(locale, page?.subtitle, t("subtitle")))}
      </p>
      <BlogList posts={posts} />
    </div>
  );
}
