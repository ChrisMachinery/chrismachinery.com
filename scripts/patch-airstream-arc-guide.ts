import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { AIRSTREAM_ARC_GUIDE_DEFAULTS } from "../src/lib/airstreamArc";

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

  const docs = await client.fetch<{ _id: string; arcGuideNote?: string; arcGuides?: { body?: string }[] }[]>(
    `*[_type=="sitePage" && path=="/products/airstream"]{_id, arcGuideNote, "arcGuides": arcGuides[]{body}}`,
  );
  if (!docs.length) throw new Error("Airstream series sitePage not found");

  const payload = {
    arcGuideTitle: AIRSTREAM_ARC_GUIDE_DEFAULTS.title,
    arcGuideNote: AIRSTREAM_ARC_GUIDE_DEFAULTS.note,
    arcGuides: AIRSTREAM_ARC_GUIDE_DEFAULTS.items.map((item, index) => ({
      _key: `arc${index}`,
      _type: "object",
      label: item.label,
      body: item.body,
    })),
  };

  const tx = client.transaction();
  for (const doc of docs) {
    tx.patch(doc._id, { set: payload });
  }
  await tx.commit();
  console.log(`patched ${docs.map((doc) => doc._id).join(", ")}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
