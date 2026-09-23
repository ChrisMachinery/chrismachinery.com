import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogList } from "@/components/blog/BlogList";
import { getBlogPosts, getSitePage } from "@/lib/sanity/fetch";
import { plainText, stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

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
  const t = await getTranslations();
  const posts = await getBlogPosts();
  const page = await getSitePage("/blog");
  const heading = stegaText(page?._id, "sitePage", "title", uiText(locale, page?.title, t("blog.title")));
  const lede = stegaText(page?._id, "sitePage", "subtitle", uiText(locale, page?.subtitle, t("blog.subtitle")));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.blog"), path: "/blog" },
        ])}
      />
      <JsonLd
        data={collectionPageJsonLd({
          locale,
          name: plainText(heading),
          description: plainText(lede),
          path: "/blog",
          items: posts.map((post) => ({
            name: plainText(post.title),
            path: `/blog/${post.slug}`,
          })),
        })}
      />
      <h1 className="type-page">{heading}</h1>
      <p className="type-lede mt-3 mb-8 max-w-3xl">{lede}</p>
      <BlogList posts={posts} />
    </div>
  );
}
