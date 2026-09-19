import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { SOLUTION_ARTICLES } from "../src/lib/solutionArticles";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function blocks(text: string) {
  return text.split(/\n+/).filter(Boolean).map((line, index) => ({
    _type: "block" as const,
    _key: `sol${index}`,
    style: line.startsWith("## ") ? "h2" : line.startsWith("### ") ? "h3" : "normal",
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `sols${index}`,
        text: line.replace(/^### /, "").replace(/^## /, "").replace(/^- /, ""),
        marks: [],
      },
    ],
  }));
}

async function main() {
  loadEnv();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing");
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-08-21",
    token,
    useCdn: false,
  });

  const docs = await client.fetch<{ _id: string; slug: string; content?: unknown[] }[]>(
    `*[_type=="solution" && defined(slug.current)]{_id, "slug": slug.current, content}`,
  );

  for (const doc of docs) {
    const article = SOLUTION_ARTICLES[doc.slug];
    if (!article) continue;
    if (Array.isArray(doc.content) && doc.content.length) {
      console.log(`keep ${doc._id} (content already set)`);
      await client.patch(doc._id).set({ lede: article.lede }).commit();
      continue;
    }
    await client
      .patch(doc._id)
      .set({ lede: article.lede, content: blocks(article.body) })
      .commit();
    console.log(`patched ${doc._id}`);
  }

  const posts = await client.fetch<{ _id: string }[]>(
    `*[_type=="blogPost" && slug.current=="uae-coffee-trailer-case"]{_id}`,
  );
  const uae = (await import("../src/data/posts")).posts.find((item) => item.slug === "uae-coffee-trailer-case");
  if (posts.length && uae) {
    for (const post of posts) {
      await client.patch(post._id).set({ body: blocks(uae.body), excerpt: uae.excerpt }).commit();
      console.log(`patched case study ${post._id}`);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
