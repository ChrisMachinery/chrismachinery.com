import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import * as XLSX from "xlsx";
import {
  documentIdForSlug,
  findExistingProduct,
  parseProductRows,
  pickProductSheetName,
  publishedDocumentId,
  toProductPatch,
  crossSeriesConflict,
  type ExistingProductRef,
} from "../sanity/lib/productSpreadsheet";

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

type Existing = ExistingProductRef;

async function main() {
  loadEnv();
  const filePath = process.argv[2];
  if (!filePath) throw new Error("Usage: npx tsx scripts/import-products-xlsx.ts <file.xlsx>");
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing in .env.local");

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-21",
    token,
    useCdn: false,
    perspective: "raw",
  });

  const workbook = XLSX.readFile(filePath);
  const sheetName = pickProductSheetName(workbook.SheetNames);
  const sheet = workbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: true });
  const rows = parseProductRows(raw);
  console.log(`sheet: ${sheetName}`);
  const existing = (await client.fetch<Existing[]>(
    `*[_type == "product"]{_id, series, "slug": slug.current, sku}`,
  )) || [];

  const tx = client.transaction();
  const log: string[] = [];

  for (const row of rows) {
    if (row.error || !row.series || !row.slug) {
      log.push(`跳过第 ${row.rowNumber} 行：${row.error || "缺少 Series 或 Slug"}`);
      continue;
    }
    const conflict = crossSeriesConflict(row, existing);
    if (conflict) {
      log.push(`跳过第 ${row.rowNumber} 行：${conflict}`);
      continue;
    }
    const match = findExistingProduct(row, existing);

    if (match) {
      const patch = toProductPatch(row, "update");
      const publishedId = publishedDocumentId(match._id);
      const draftId = publishedId.startsWith("drafts.") ? publishedId : `drafts.${publishedId}`;
      const targets = [...new Set(
        existing
          .map((item) => item._id)
          .filter((id) => id === publishedId || id === draftId || id === match._id),
      )];
      for (const target of targets) tx.patch(target, { set: patch });
      log.push(`更新 ${row.series} / ${row.slug}（${targets.join(", ")}）`);
    } else {
      const patch = toProductPatch(row, "create");
      if (!patch.title || !patch.series) {
        log.push(`跳过 ${row.slug}：新建需要 Title 和 Series`);
        continue;
      }
      const id = documentIdForSlug(row.slug);
      tx.createIfNotExists({
        _id: id,
        _type: "product",
        ...patch,
      });
      tx.patch(id, { set: patch });
      log.push(
        `${existing.some((item) => publishedDocumentId(item._id) === id) ? "更新" : "新建"} ${row.series} / ${row.slug}`,
      );
    }
  }

  await tx.commit();
  console.log(log.join("\n"));
  console.log(`done: ${log.length} rows`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
