import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import * as XLSX from "xlsx";
import {
  PRODUCT_IMPORT_NOTES,
  PRODUCT_IMPORT_TEMPLATE_HEADERS,
  productImportExampleRows,
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

function stripInvisible(value?: string) {
  return (value || "").replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF\u00AD]/g, "").trim();
}

function modelFromSku(sku?: string) {
  if (!sku) return "";
  return sku.replace(/^CM-/i, "").replace(/-(Single|Tandem)$/i, "");
}

function joinCell(values?: (string | undefined)[]) {
  const list = (values ?? []).map((item) => stripInvisible(item)).filter(Boolean);
  return [...new Set(list)].join(", ");
}

function shapesCell(shapes?: string[], shape?: string) {
  return joinCell([...(shapes ?? []), shape]);
}

function materialsCell(materials?: string[], material?: string) {
  return joinCell([...(materials ?? []), material]);
}

type Doc = {
  title?: string;
  slug?: string;
  description?: string;
  sku?: string;
  series?: string;
  weight?: number;
  loadCapacity?: number;
  length?: number;
  width?: number;
  height?: number;
  overallHeight?: number;
  axle?: string;
  shape?: string;
  shapes?: string[];
  material?: string;
  materials?: string[];
  stockStatus?: string;
};

function rowFromDoc(doc: Doc): (string | number)[] {
  return [
    stripInvisible(doc.series),
    modelFromSku(stripInvisible(doc.sku)),
    stripInvisible(doc.title),
    stripInvisible(doc.slug),
    stripInvisible(doc.description),
    stripInvisible(doc.sku),
    doc.weight ?? "",
    doc.loadCapacity ?? "",
    doc.length ?? "",
    doc.width ?? "",
    doc.height ?? "",
    doc.overallHeight ?? "",
    stripInvisible(doc.axle),
    shapesCell(doc.shapes, doc.shape),
    materialsCell(doc.materials, doc.material),
    stripInvisible(doc.stockStatus),
  ];
}

async function main() {
  loadEnv();
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-08-21",
    token,
    useCdn: false,
    perspective: "published",
  });

  const docs = await client.fetch<Doc[]>(
    `*[_type=="product" && !(_id in path("drafts.**"))] | order(series asc, length asc, width asc, axle asc){
      title,"slug":slug.current,description,sku,series,weight,loadCapacity,length,width,height,overallHeight,axle,shape,shapes,material,materials,stockStatus
    }`,
  );

  const products = XLSX.utils.aoa_to_sheet([
    [...PRODUCT_IMPORT_TEMPLATE_HEADERS],
    ...docs.map(rowFromDoc),
  ]);
  products["!cols"] = PRODUCT_IMPORT_TEMPLATE_HEADERS.map((header) => ({
    wch: header === "Description" ? 48 : header === "Title" || header === "Slug" ? 28 : 16,
  }));

  const examples = XLSX.utils.aoa_to_sheet([
    [...PRODUCT_IMPORT_TEMPLATE_HEADERS],
    ...productImportExampleRows(),
  ]);
  const notes = XLSX.utils.aoa_to_sheet(PRODUCT_IMPORT_NOTES.map((row) => [...row]));
  notes["!cols"] = [{ wch: 16 }, { wch: 72 }];

  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, products, "products");
  XLSX.utils.book_append_sheet(book, notes, "说明");
  XLSX.utils.book_append_sheet(book, examples, "示例");

  const outDir = path.join(process.cwd(), "templates");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "product-import.xlsx");
  XLSX.writeFile(book, outPath);
  const desktopCopy = path.join(process.env.USERPROFILE || "", "Desktop", "product-import.xlsx");
  try {
    XLSX.writeFile(book, desktopCopy);
    console.log(`wrote ${desktopCopy}`);
  } catch (err) {
    console.warn(`skipped desktop copy: ${err instanceof Error ? err.message : err}`);
  }
  console.log(`wrote ${outPath} (${docs.length} products)`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
