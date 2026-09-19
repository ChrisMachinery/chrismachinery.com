"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Post } from "@/data/posts";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { stegaText } from "@/lib/sanity/visual";

const cats = ["All", "Case Study", "Buying Guide", "Industry News"] as const;

export function BlogList({ posts }: { posts: Post[] }) {
  const t = useTranslations("blog");
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const labels: Record<(typeof cats)[number], string> = {
    All: t("all"),
    "Buying Guide": t("buyingGuide"),
    "Industry News": t("industryNews"),
    "Case Study": t("caseStudy"),
  };
  const list = useMemo(
    () =>
      posts
        .filter((p) => cat === "All" || p.category === cat || p.tags?.includes(cat))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [cat, posts],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {cats.map((item) => (
          <button
            key={item}
            type="button"
            className={`min-touch rounded px-4 text-sm font-semibold ${cat === item ? "bg-accent" : "border border-black/10"}`}
            onClick={() => setCat(item)}
          >
            {labels[item]}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card-hover overflow-hidden rounded-lg border border-black/5">
            <ImgPlaceholder
              documentId={post._id}
              documentType="blogPost"
              path="coverImage"
              label={`博客封面 ${post.title}`}
              className="h-40"
              src={post.coverUrl}
            />
            <div className="p-4">
              <p className="text-xs">{post.date} · {labels[post.category as keyof typeof labels] || post.category}</p>
              <h2 className="type-card mt-2">{stegaText(post._id, "blogPost", "title", post.title)}</h2>
              <p className="type-body mt-2">{stegaText(post._id, "blogPost", "excerpt", post.excerpt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
