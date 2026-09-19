import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { seriesCustomizable, seriesIncluded } from "../src/data/products";

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

  const series = ["pod", "airstream", "square", "container", "capsule", "others"] as const;
  const pages = await client.fetch<{ _id: string; path: string }[]>(
    `*[_type=="sitePage" && path in $paths]{_id, path}`,
    { paths: series.map((item) => `/products/${item}`) },
  );
  if (!pages.length) throw new Error("No product series sitePage documents found");

  const tx = client.transaction();
  for (const page of pages) {
    const slug = page.path.replace("/products/", "") as (typeof series)[number];
    tx.patch(page._id, {
      set: {
        included: seriesIncluded[slug],
        customizable: seriesCustomizable[slug],
      },
    });
  }
  await tx.commit();
  console.log(
    pages
      .map((page) => `${page.path} (${page._id})`)
      .join("\n"),
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
