import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

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

function renameNyText(value?: string) {
  if (!value) return value;
  return value.replace(/\bNY-style\b/g, "Capsule").replace(/\bNY\b/g, "Capsule");
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

  const products = await client.fetch<{ _id: string; title?: string; description?: string }[]>(
    `*[_type=="product" && (series=="ny" || series=="NY Style" || series=="NY")]{_id,title,description}`,
  );
  const pages = await client.fetch<{ _id: string; title?: string; subtitle?: string }[]>(
    `*[_type=="sitePage" && path=="/products/ny"]{_id,title,subtitle}`,
  );
  const contents = await client.fetch<
    { _id: string; seriesCards?: { _key?: string; href?: string; name?: string }[] }[]
  >(`*[_type=="pageContent"]{_id,seriesCards[]{_key,href,name}}`);

  const tx = client.transaction();
  let n = 0;

  for (const doc of products) {
    tx.patch(doc._id, {
      set: {
        series: "capsule",
        ...(doc.title ? { title: renameNyText(doc.title) } : {}),
        ...(doc.description ? { description: renameNyText(doc.description) } : {}),
      },
    });
    n += 1;
    console.log(`product ${doc._id} → capsule`);
  }

  for (const doc of pages) {
    tx.patch(doc._id, {
      set: {
        path: "/products/capsule",
        title: "Capsule Series Food Trailers",
        subtitle:
          doc.subtitle?.replace(/New York style/gi, "Capsule").replace(/\bNY\b/g, "Capsule") ||
          "Capsule body with configurable glass service windows for street and night-market service.",
      },
    });
    n += 1;
    console.log(`sitePage ${doc._id} → /products/capsule`);
  }

  for (const doc of contents) {
    const cards = doc.seriesCards ?? [];
    const next = cards.map((card) => ({
      ...card,
      href: card.href?.replace("/products/ny", "/products/capsule"),
      name: card.name?.replace(/\bNY\b/g, "Capsule"),
    }));
    if (JSON.stringify(cards) !== JSON.stringify(next)) {
      tx.patch(doc._id, { set: { seriesCards: next } });
      n += 1;
      console.log(`pageContent ${doc._id} seriesCards updated`);
    }
  }

  if (!n) {
    console.log("nothing to patch");
    return;
  }
  await tx.commit();
  console.log(`patched ${n} documents`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
