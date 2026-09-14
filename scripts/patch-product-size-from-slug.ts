import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { inferFromSlug } from "../sanity/lib/productSpreadsheet";

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
    perspective: "raw",
  });

  const docs = await client.fetch<{ _id: string; slug?: string; length?: number; width?: number }[]>(
    `*[_type=="product"]{_id,"slug":slug.current,length,width}`,
  );

  const tx = client.transaction();
  let count = 0;
  for (const doc of docs) {
    if (!doc.slug) continue;
    const inferred = inferFromSlug(doc.slug);
    if (!inferred.length || !inferred.width) continue;
    if (doc.length === inferred.length && doc.width === inferred.width) continue;
    tx.patch(doc._id, { set: { length: inferred.length, width: inferred.width } });
    count += 1;
    console.log(
      `${doc._id}: ${doc.length}x${doc.width} → ${inferred.length}x${inferred.width}`,
    );
  }
  if (!count) {
    console.log("nothing to patch");
    return;
  }
  await tx.commit();
  console.log(`patched ${count} documents`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
