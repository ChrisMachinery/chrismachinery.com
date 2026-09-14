import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

type Doc = {
  _id: string;
  title?: string;
  sku?: string;
  slug?: string;
  series?: string;
  length?: number;
  width?: number;
  height?: number;
  material?: string;
  axle?: string;
  shape?: string;
  shapes?: string[];
  mainImage?: unknown;
  _updatedAt?: string;
};

function normalizeAxle(axle?: string) {
  const value = (axle || "").toLowerCase();
  if (value.includes("tandem") || value.includes("tamdem")) return "Tandem Axle";
  return "Single Axle";
}

function familyKey(doc: Pick<Doc, "length" | "width" | "material" | "axle">) {
  return ["pod", doc.length || 0, doc.width || 0, (doc.material || "").toLowerCase(), normalizeAxle(doc.axle)].join("|");
}

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

function publishedId(id: string) {
  return id.replace(/^drafts\./, "");
}

function shapesOf(doc: Doc) {
  const list = [...(doc.shapes ?? []), doc.shape].filter(Boolean) as string[];
  return [...new Set(list.map((item) => item.trim()).filter(Boolean))];
}

function score(doc: Doc) {
  let n = 0;
  if (doc.mainImage) n += 8;
  if (doc._id.startsWith("product-")) n += 4;
  if (!doc._id.startsWith("drafts.")) n += 2;
  if (doc.sku) n += 1;
  return n;
}

function stripInvisible(value: string) {
  return value.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00AD]/g, "");
}

function familyTitle(keep: Doc, mergedShapes: string[]) {
  const raw = stripInvisible(keep.title || "Pod").replace(/\s+/g, " ").trim();
  const base = raw.replace(/\s+(Dome|Square)(\s+Food Trailer)?/i, "").trim();
  if (mergedShapes.includes("Dome") && mergedShapes.includes("Square")) {
    return /food trailer/i.test(base) ? base : `${base} Food Trailer`.replace(/\s+/g, " ");
  }
  return raw || base;
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

  const docs = await client.fetch<Doc[]>(
    `*[_type=="product" && series=="pod"]{_id,title,sku,"slug":slug.current,series,length,width,height,material,axle,shape,shapes,mainImage,_updatedAt}`,
  );

  const published = docs.filter((doc) => !doc._id.startsWith("drafts."));
  const groups = new Map<string, Doc[]>();
  for (const doc of published) {
    const key = familyKey(doc);
    const list = groups.get(key) || [];
    list.push(doc);
    groups.set(key, list);
  }

  const dryRun = process.argv.includes("--dry-run");
  const tx = client.transaction();
  const log: string[] = [];

  console.log(`Pod published: ${published.length}; family groups: ${groups.size}`);
  for (const [key, members] of [...groups.entries()].sort()) {
    const shapes = [...new Set(members.flatMap(shapesOf))].join("/");
    console.log(`- ${key} (${members.length}) ${shapes} :: ${members.map((item) => item.sku || item.slug || item._id).join(" | ")}`);
  }

  for (const [key, members] of groups) {
    const mergedShapes = [...new Set(members.flatMap(shapesOf))];
    if (members.length === 1) {
      const keep = members[0];
      const title = familyTitle(keep, mergedShapes);
      if (title !== stripInvisible(keep.title || "").replace(/\s+/g, " ").trim() || mergedShapes.length > 1) {
        tx.patch(keep._id, { set: { title, shapes: mergedShapes, shape: mergedShapes[0] } });
        log.push(`retitle ${keep.sku || keep.slug} -> ${title} (${key})`);
      }
      continue;
    }
    const keep = [...members].sort((a, b) => score(b) - score(a) || (b._updatedAt || "").localeCompare(a._updatedAt || ""))[0];
    const title = familyTitle(keep, mergedShapes);
    const extras = members.filter((item) => publishedId(item._id) !== publishedId(keep._id));

    tx.patch(keep._id, {
      set: {
        title,
        shapes: mergedShapes,
        shape: mergedShapes[0],
      },
    });
    const draftKeep = `drafts.${publishedId(keep._id)}`;
    if (docs.some((doc) => doc._id === draftKeep)) {
      tx.patch(draftKeep, { set: { title, shapes: mergedShapes, shape: mergedShapes[0] } });
    }

    for (const extra of extras) {
      tx.delete(extra._id);
      tx.delete(`drafts.${publishedId(extra._id)}`);
      log.push(
        `keep ${keep.sku || keep.slug} ← delete ${extra.sku || extra.slug} (${key}) shapes=${mergedShapes.join("/")}`,
      );
    }
  }

  if (!log.length) {
    console.log("No Pod duplicates to merge.");
    return;
  }
  console.log(log.join("\n"));
  if (dryRun) {
    console.log(`dry-run: would delete ${log.length} extra documents`);
    return;
  }
  await tx.commit();
  console.log(`done: merged ${log.length} extra documents`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
