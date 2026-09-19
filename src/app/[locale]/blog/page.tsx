import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/blog/BlogList";
import { Hreflang } from "@/components/seo/JsonLd";
import { getBlogPosts, getSitePage } from "@/lib/sanity/fetch";
import { stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import type { Metadata } from "next";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Blog | Food Trailer Guides & Cases - Chris Machinery",
  description: "Buying guides, industry news, and customer case studies.",
};

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
      <h1 className="type-page mb-8">
        {stegaText(page?._id, "sitePage", "title", uiText(locale, page?.title, t("title")))}
      </h1>
      <BlogList posts={posts} />
    </div>
  );
}
