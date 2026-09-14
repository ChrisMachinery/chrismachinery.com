import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Lead } from "@/lib/types";
import { formatQuoteTable, type QuoteSnapshot } from "@/lib/quoteTable";
import { getCustomizeOptions } from "@/lib/sanity/fetch";

export type { Lead };

const dataDir = path.join(process.cwd(), "src", "data");
const leadsFile = path.join(dataDir, "leads.json");
const stockFile = path.join(dataDir, "stock-overrides.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function listLeads(): Promise<Lead[]> {
  return readJson<Lead[]>(leadsFile, []);
}

export async function saveLead(lead: Omit<Lead, "inquiryId" | "createdAt">): Promise<Lead> {
  const stamp = new Date();
  const ymd = stamp.toISOString().slice(0, 10).replace(/-/g, "");
  const saved: Lead = {
    ...lead,
    product:
      lead.product?.trim() ||
      [lead.customConfig?.series, lead.customConfig?.shape, lead.customConfig?.sizeLabel]
        .filter((item) => String(item || "").trim())
        .join(" "),
    shape: lead.shape?.trim() || String(lead.customConfig?.shape || ""),
    material:
      lead.material?.trim() ||
      (String(lead.customConfig?.material) === "stainless"
        ? `Stainless / ${String(lead.customConfig?.stainlessFinish || "Matt")}`
        : String(lead.customConfig?.material) === "paint"
          ? "Paint"
          : lead.material),
    inquiryId: `INQ-${ymd}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`,
    createdAt: stamp.toISOString(),
  };
  try {
    await mkdir(dataDir, { recursive: true });
    const leads = await listLeads();
    leads.push(saved);
    await writeFile(leadsFile, JSON.stringify(leads, null, 2), "utf8");
  } catch (error) {
    console.error("[leads] local file backup skipped", error);
  }
  return saved;
}

export async function readStockOverrides(): Promise<Record<string, string>> {
  return readJson<Record<string, string>>(stockFile, {});
}

export async function writeStockOverrides(next: Record<string, string>) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(stockFile, JSON.stringify(next, null, 2), "utf8");
}

function pdfSafe(text: string) {
  return text
    .replace(/×/g, "x")
    .replace(/[—–]/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/[^\t\n\r\x20-\x7e]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapLine(line: string, width = 90) {
  const text = line.replace(/\r/g, "");
  if (text.length <= width) return [text];
  const out: string[] = [];
  let rest = text;
  while (rest.length > width) {
    const slice = rest.slice(0, width);
    const breakAt = Math.max(slice.lastIndexOf(" "), slice.lastIndexOf("-"));
    const take = breakAt > 40 ? breakAt : width;
    out.push(rest.slice(0, take).trimEnd());
    rest = rest.slice(take).trimStart();
  }
  if (rest) out.push(rest);
  return out;
}

function toPdfLines(chunks: string[]) {
  return chunks.flatMap((chunk) => chunk.split(/\r?\n/)).flatMap((line) => wrapLine(line || " "));
}

async function bodyFromLead(lead: Lead) {
  const config = lead.customConfig;
  if (config && typeof config === "object" && (config.series || config.equipment || config.extras)) {
    const options = await getCustomizeOptions();
    return formatQuoteTable(
      {
        series: String(config.series ?? ""),
        shape: String(config.shape ?? ""),
        sizeLabel: String(config.sizeLabel ?? ""),
        material: String(config.material ?? ""),
        stainlessFinish: String(config.stainlessFinish ?? ""),
        hex: String(config.hex ?? ""),
        extras: (config.extras as Record<string, number>) || {},
        equipment: Array.isArray(config.equipment) ? config.equipment.map(String) : [],
        solutionName: String(config.solutionName ?? ""),
      },
      options.extras,
      options.kitchen,
      (config.quoteSnapshot as QuoteSnapshot | undefined) || undefined,
    );
  }
  return lead.message.replace(/\r\n/g, "\n");
}

export async function quotePdf(lead: Lead): Promise<Buffer> {
  const header = [
    `Chris Machinery Quote / Inquiry ${lead.inquiryId}`,
    `Date: ${lead.createdAt}`,
    `Name: ${lead.name?.trim() || "-"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `Country: ${lead.country || lead.geo || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    "",
    await bodyFromLead(lead),
  ];
  const lines = toPdfLines(header);
  const perPage = 40;
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage));
  if (!pages.length) pages.push([""]);

  const pageCount = pages.length;
  const fontId = 3 + pageCount * 2;
  const kids = pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    `2 0 obj << /Type /Pages /Kids [${kids}] /Count ${pageCount} >> endobj`,
  ];
  pages.forEach((pageLines, index) => {
    const pageId = 3 + index * 2;
    const contentId = pageId + 1;
    const stream = `BT /F1 9 Tf 16 TL 42 760 Td (${pageLines.map(pdfSafe).join(") Tj T* (")}) Tj ET`;
    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >> endobj`,
    );
    objects.push(`${contentId} 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`);
  });
  objects.push(`${fontId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj`);

  let offset = 9;
  const offsets = [0];
  const body = objects
    .map((obj) => {
      offsets.push(offset);
      offset += obj.length + 1;
      return obj;
    })
    .join("\n");
  const xrefPos = offset;
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((n) => `${String(n).padStart(10, "0")} 00000 n `)
    .join("\n")}\ntrailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(`%PDF-1.4\n${body}\n${xref}`);
}
