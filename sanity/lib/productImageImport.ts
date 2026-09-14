export type ImageImportProduct = {
  _id: string;
  title?: string;
  slug?: string;
  sku?: string;
  series?: string;
  length?: number;
  axle?: string;
};

export type ParsedImageFile = {
  fileName: string;
  groupName: string;
  sequence: number;
  series?: string;
  length?: number;
  axle?: string;
  color?: string;
};

export type AltCatalogRow = {
  groupName: string;
  sequence: number;
  alt: string;
  rowNumber: number;
};

export type ImageImportPlan = {
  file: File;
  fileName: string;
  sequence: number;
  groupName: string;
  alt: string;
  product?: ImageImportProduct;
  error?: string;
};

const SERIES_CODE: Record<string, string> = {
  ny: "capsule",
  capsule: "capsule",
  c: "container",
  container: "container",
  a: "airstream",
  airstream: "airstream",
  p: "pod",
  pod: "pod",
  s: "square",
  f: "square",
  square: "square",
  k: "capsule",
};

function sameSeries(a?: string, b?: string) {
  const norm = (value?: string) => {
    const t = (value || "").toLowerCase().replace(/\s+/g, "-");
    if (t === "ny" || t === "ny-style" || t === "nystyle" || t === "capsule" || t === "胶囊") return "capsule";
    return t;
  };
  return Boolean(a && b && norm(a) === norm(b));
}

function sizeFromDigits(digits: string) {
  return digits.length === 3 ? Number(digits) * 10 : Number(digits);
}

function cellText(value: unknown) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function normalizeLabel(value: string) {
  return cellText(value)
    .toLowerCase()
    .replace(/\.(jpe?g|png|webp|gif)$/i, "")
    .replace(/[（）]/g, (ch) => (ch === "（" ? "(" : ")"))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseSequence(value: string) {
  const text = cellText(value);
  const match = text.match(/\((\d+)\)\s*$/) || text.match(/^(\d+)$/);
  return match ? Number(match[1]) : undefined;
}

export function parseImageFileName(fileName: string): ParsedImageFile {
  const base = fileName.replace(/\.[^.]+$/, "").trim();
  const sequence = parseSequence(base) ?? 1;
  const groupName = base.replace(/\s*\(\d+\)\s*$/, "").trim() || base;
  const parsed = parseGroupName(groupName);
  return { fileName, groupName, sequence, ...parsed };
}

export function parseGroupName(groupName: string) {
  const t = normalizeLabel(groupName);
  let series: string | undefined;
  let length: number | undefined;
  const code = t.match(/\b(\d{3,4})\s*(ny|capsule|container|airstream|square|pod|[capskf])\b/);
  if (code) {
    length = sizeFromDigits(code[1]);
    series = SERIES_CODE[code[2]];
  }
  if (!series) {
    if (t.includes("container") || t.includes("集装箱")) series = "container";
    else if (t.includes("airstream") || t.includes("流线")) series = "airstream";
    else if (/\bny\b/.test(t) || t.includes("capsule") || t.includes("胶囊")) series = "capsule";
    else if (t.includes("square") || t.includes("方形")) series = "square";
    else if (t.includes("pod")) series = "pod";
  }
  let axle: string | undefined;
  if (t.includes("tandem") || t.includes("双轴")) axle = "Tandem Axle";
  else if (t.includes("single") || t.includes("单轴")) axle = "Single Axle";

  let color = t
    .replace(/\b\d{3,4}\s*(ny|capsule|container|airstream|square|pod|[capskf])\b/, " ")
    .replace(/\b(tandem|single)\s*axle\b/, " ")
    .replace(/\b(container|airstream|capsule|square|pod|ny)\b/, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!color || color === t) color = undefined;

  return { series, length, axle, color };
}

function headerKey(name: string) {
  const t = normalizeLabel(name).replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
  if (t.includes("图片名称") || t === "name" || t.includes("filename") || t.includes("图片名")) return "groupName";
  if (t.includes("图片序号") || t.includes("序号") || t === "seq" || t.includes("sequence") || t.includes("index")) {
    return "sequence";
  }
  if (t.includes("alt") || t.includes("文案") || t.includes("seo")) return "alt";
  return "";
}

export function parseAltCatalog(rawRows: Record<string, unknown>[]): AltCatalogRow[] {
  const rows: AltCatalogRow[] = [];
  rawRows.forEach((raw, index) => {
    const mapped: { groupName?: string; sequence?: string; alt?: string } = {};
    for (const [key, value] of Object.entries(raw)) {
      const field = headerKey(key);
      if (field === "groupName") mapped.groupName = cellText(value);
      if (field === "sequence") mapped.sequence = cellText(value);
      if (field === "alt") mapped.alt = cellText(value);
    }
    if (!mapped.groupName && !mapped.alt) return;
    const fromName = parseSequence(mapped.groupName || "");
    const sequence = parseSequence(mapped.sequence || "") ?? fromName ?? 1;
    const groupName = (mapped.groupName || "").replace(/\s*\(\d+\)\s*$/, "").trim();
    if (!groupName) return;
    rows.push({
      groupName,
      sequence,
      alt: mapped.alt || "",
      rowNumber: index + 2,
    });
  });
  return rows;
}

export function findAlt(rows: AltCatalogRow[], groupName: string, sequence: number) {
  const key = normalizeLabel(groupName);
  const hit = rows.find(
    (row) => normalizeLabel(row.groupName) === key && row.sequence === sequence,
  );
  return hit?.alt || "";
}

function productAxle(item: ImageImportProduct) {
  const field = (item.axle || "").toLowerCase();
  if (field.includes("tandem") || field.includes("双轴")) return "Tandem Axle";
  if (field.includes("single") || field.includes("单轴")) return "Single Axle";
  const hay = `${item.title || ""} ${item.slug || ""} ${item.sku || ""}`.toLowerCase();
  if (hay.includes("tandem") || hay.includes("双轴")) return "Tandem Axle";
  if (hay.includes("single") || hay.includes("单轴")) return "Single Axle";
  return item.axle;
}

function matchesColor(item: ImageImportProduct, color?: string) {
  if (!color) return true;
  const hay = `${item.title || ""} ${item.slug || ""} ${item.sku || ""}`.toLowerCase();
  if (color === "ti" || color === "titanium") return /ti|titanium|stainless/.test(hay);
  return hay.includes(color);
}

function pickProduct(candidates: ImageImportProduct[], parsed: ParsedImageFile) {
  if (!candidates.length) return undefined;
  let pool = candidates;
  if (parsed.axle) {
    const byAxle = pool.filter((item) => productAxle(item) === parsed.axle);
    if (byAxle.length) pool = byAxle;
  }
  if (parsed.color && pool.length > 1) {
    const byColor = pool.filter((item) => matchesColor(item, parsed.color));
    if (byColor.length) pool = byColor;
  }
  return pool[0];
}

export function findProductForImage(parsed: ParsedImageFile, products: ImageImportProduct[]) {
  const model = normalizeLabel(parsed.groupName).match(/\b(\d{3,4})\s*(ny|[capskf])\b/);
  const modelToken = model ? `${model[1]}${model[2]}` : "";
  if (modelToken) {
    const byCode = products.filter((item) => {
      const hay = `${item.title || ""} ${item.slug || ""} ${item.sku || ""}`.toLowerCase().replace(/\s+/g, "");
      return hay.includes(modelToken.replace(/\s+/g, ""));
    });
    const matched = pickProduct(byCode, parsed);
    if (matched) return matched;
  }
  const pool = products.filter((item) => {
    if (parsed.series && item.series && !sameSeries(parsed.series, item.series)) return false;
    if (parsed.length && item.length && item.length !== parsed.length) return false;
    if (parsed.axle && productAxle(item) && productAxle(item) !== parsed.axle) return false;
    return Boolean(parsed.series || parsed.length);
  });
  return pickProduct(pool, parsed);
}

export function planImageImport(
  files: File[],
  catalog: AltCatalogRow[],
  products: ImageImportProduct[],
): ImageImportPlan[] {
  return files.map((file) => {
    const parsed = parseImageFileName(file.name);
    const alt = findAlt(catalog, parsed.groupName, parsed.sequence);
    const product = findProductForImage(parsed, products);
    const plan: ImageImportPlan = {
      file,
      fileName: file.name,
      sequence: parsed.sequence,
      groupName: parsed.groupName,
      alt,
      product,
    };
    if (!parsed.series || !parsed.length) {
      plan.error = "文件名无法识别型号（Container 用 400C；Capsule/NY 用 390NY；Square 用 280F）";
    } else if (!product) {
      plan.error = `没有对应产品：${parsed.series} ${parsed.length}mm ${parsed.axle || ""}`.trim();
    }
    return plan;
  });
}

export const IMAGE_IMPORT_TEMPLATE_HEADERS = ["图片名称", "图片序号", "Alt 文案 (SEO Alt Text)"] as const;

export function imageImportExampleRows() {
  return [
    ["400C Tandem axle black", "(1)", "Chris Machinery 4000mm tandem axle black container style food trailer exterior front angle view"],
    ["400C Tandem axle black", "(2)", "Chris Machinery 4000mm tandem axle matte black food trailer parked outside factory lot"],
    ["280F Single axle white", "(1)", "Chris Machinery 2800mm single axle white square food trailer exterior side view with hatch"],
    ["400NY Tandem axle Ti", "(1)", "Chris Machinery 4000mm tandem axle titanium grey capsule food trailer front side view"],
  ];
}
