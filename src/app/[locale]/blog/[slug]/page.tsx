import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/sanity/fetch";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { PortableText } from "@/components/sanity/PortableText";
import { Hreflang } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/site";
import { stegaText } from "@/lib/sanity/visual";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return { title: `${post.title} | Chris Machinery`, description: post.excerpt };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMarkdown(body: string) {
  return body.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="type-section mt-8">{line.slice(3)}</h2>;
    if (line.startsWith("- ")) return <li key={i} className="ms-5 list-disc">{line.slice(2)}</li>;
    if (!line.trim()) return <br key={i} />;
    const html = escapeHtml(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="type-body mt-3" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const all = await getBlogPosts();
  const related = all.filter((item) => item.slug !== slug).slice(0, 3);

  const s = (path: string, text: string) => stegaText(post._id, "blogPost", path, text);
  const shareUrl = encodeURIComponent(`${SITE_URL}/blog/${slug}`);
  const shareTitle = encodeURIComponent(post.title);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Hreflang path={`/blog/${slug}`} />
      <ImgPlaceholder
        documentId={post._id}
        documentType="blogPost"
        path="coverImage"
        label={`博客大图 ${post.title}`}
        className="min-h-56 rounded-lg"
        src={post.coverUrl}
      />
      <p className="mt-6 text-sm">
        {s("publishedAt", post.date)} · {s("author", post.author)} · {s("category", post.category)}
      </p>
      <h1 className="type-page mt-2">{s("title", post.title)}</h1>
      <div className="mt-6">
        {post.bodyBlocks?.length ? (
          <PortableText value={post.bodyBlocks} documentId={post._id} documentType="blogPost" />
        ) : (
          renderMarkdown(s("body", post.body))
        )}
      </div>
      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        <span>Share:</span>
        <a
          className="underline"
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
        <a
          className="underline"
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
      </div>
      <h2 className="type-section mt-14">Related</h2>
      <div className="mt-4 grid gap-4">
        {related.map((item) => (
          <Link key={item.slug} href={`/blog/${item.slug}`} className="underline">
            {stegaText(item._id, "blogPost", "title", item.title)}
          </Link>
        ))}
      </div>
    </article>
  );
}
