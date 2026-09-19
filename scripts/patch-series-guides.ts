import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { seedSeriesGuide, type GuideSeries } from "../src/lib/seriesGuides";

const SERIES: GuideSeries[] = ["pod", "airstream", "square", "container", "capsule"];

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

  for (const series of SERIES) {
    const docs = await client.fetch<{ _id: string; podGuide?: unknown }[]>(
      `*[_type=="sitePage" && path==$path]{_id, podGuide}`,
      { path: `/products/${series}` },
    );
    if (!docs.length) {
      console.log(`skip ${series}: sitePage not found`);
      continue;
    }
    for (const doc of docs) {
      if (doc.podGuide) {
        console.log(`keep ${doc._id} (podGuide already set)`);
        continue;
      }
      await client.patch(doc._id).set({ podGuide: seedSeriesGuide(series) }).commit();
      console.log(`patched ${doc._id}`);
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
