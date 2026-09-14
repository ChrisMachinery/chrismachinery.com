export const PRODUCT_IMPORT_TEMPLATE_HEADERS = [
  "Series",
  "型号",
  "Title",
  "Slug",
  "Description",
  "SKU",
  "weight",
  "load",
  "length",
  "width",
  "height",
  "overall height",
  "axle",
  "shapes",
  "materials",
  "stockStatus",
] as const;

export const PRODUCT_IMPORT_NOTES = [
  ["规则", "说明"],
  ["网站不标价", "表格不要加价格列。型号用 SKU / 型号展示，报价在询盘里回复。"],
  ["一行一台车", "同一车型 = 系列 + 长 + 宽 + 轴。造型和材质都是选项，写在 shapes / materials，不要拆成两行。"],
  ["shapes", "多种造型用英文或中文逗号分隔。只有一种造型就填一个值。"],
  ["materials", "多种材质用逗号分隔。Paint（喷漆）和 Stainless steel（不锈钢）写在同一行。中文喷漆、不锈钢也可识别。"],
  ["Pod", "造型：Dome / Square（1650 宽通常只有 Dome；2000 宽同一行写 Dome, Square）。材质：Paint。造型对比图文不在这张表，到 Website pages → /products/pod。"],
  ["Airstream", "造型：375 Arc, 500 Arc, 700 Arc。材质：Paint, Stainless steel。弧度图文不在这张表，到 Website pages → /products/airstream。"],
  ["Square 方形车", "造型 Square，材质 Paint。不要拆行。"],
  ["Capsule", "造型 375 Arc。材质同一行写 Paint, Stainless steel（喷漆和不锈钢）。不要拆成两行。"],
  ["Container", "造型 Square，材质 Paint。不要拆行。"],
  ["必填", "Series、Slug。新建还需要 Title。Series 必须能识别成 pod / airstream / square / container / capsule / others，否则整行跳过。"],
  ["匹配", "先确认 Series（只在同一系列内匹配）。然后按 SKU，没有再按 Slug。SKU/Slug 若属于别的系列，不会改那条，本行跳过。已有产品只覆盖表格里有的字段（不改图片）。"],
  ["合并单元格", "只有 Series 列会向下填充（方便合并系列名）。长度、宽度、Slug、SKU、Title 不要合并；空着的长宽会从 Slug 识别，例如 airstream-4000-2200-tandem。"],
  ["Series", "优先填这一列。可写 pod / airstream / square / container / capsule / others，或中文：胶囊、流线、方形车、集装箱、其他。旧表写 ny / 纽约 仍会导入到 Capsule。不要把方形车写成 pod。"],
  ["axle", "Single Axle 或 Tandem Axle"],
  ["stockStatus", "In Stock / Made to Order / Out of Stock"],
  ["Slug", "小写短横线。不要写成 …-square / …-dome / …-700 / …-paint / …-stainless。"],
  ["型号", "可选，内部型号，如 250W。前台主要展示 Title 和 SKU。"],
];

export function productImportExampleRows(): (string | number)[][] {
  return [
    [
      "pod",
      "250W",
      "Pod 2500 Food Trailer",
      "pod-2500-2000-single",
      "Compact Pod trailer with a rust-proof galvanized frame and easy-clean interior panels, offered in Dome and Square body options for markets and catering.",
      "CM-250W-Single",
      900,
      1250,
      2500,
      2000,
      2100,
      2500,
      "Single Axle",
      "Dome, Square",
      "Paint",
      "Made to Order",
    ],
    [
      "airstream",
      "4000",
      "Airstream 4000 Food Trailer",
      "airstream-4000-2200-tandem",
      "Airstream-style food trailer with a rounded body, tandem axle chassis, and multiple arc window options for high-visibility street vending.",
      "CM-AS-4000-Tandem",
      1800,
      1750,
      4000,
      2200,
      2300,
      2600,
      "Tandem Axle",
      "375 Arc, 500 Arc, 700 Arc",
      "Paint, Stainless steel",
      "Made to Order",
    ],
    [
      "square",
      "4500",
      "Square 4500 Food Trailer",
      "square-4500-2200-tandem",
      "Box-body square trailer with a painted exterior and tandem axle chassis, built for wrap branding and high-volume kitchen layouts.",
      "CM-SQ-4500",
      1600,
      1600,
      4500,
      2200,
      2100,
      2500,
      "Tandem Axle",
      "Square",
      "Paint",
      "Made to Order",
    ],
    [
      "capsule",
      "4000",
      "Capsule 4000 Food Trailer",
      "capsule-4000-2200-tandem",
      "Capsule-style trailer with a single body shape, tandem axle, offered in wrap-ready paint or stainless steel for street service.",
      "CM-CAP-4000",
      1500,
      1550,
      4000,
      2200,
      2200,
      2500,
      "Tandem Axle",
      "375 Arc",
      "Paint, Stainless steel",
      "Made to Order",
    ],
    [
      "container",
      "5000",
      "Container 5000 Food Trailer",
      "container-5000-2200-tandem",
      "Container-inspired painted trailer with a single box body shape and tandem axle chassis for heavy-duty, long-hour kitchen service.",
      "CM-CT-5000",
      1900,
      1800,
      5000,
      2200,
      2200,
      2600,
      "Tandem Axle",
      "Square",
      "Paint",
      "Made to Order",
    ],
  ];
}

export type ProductImportRow = {
  rowNumber: number;
  model?: string;
  title?: string;
  slug?: string;
  description?: string;
  sku?: string;
  weight?: number;
  loadCapacity?: number;
  series?: string;
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
  warnings: string[];
  error?: string;
};

export type ProductImportPatch = {
  title?: string;
  slug?: { _type: "slug"; current: string };
  description?: string;
  sku?: string;
  weight?: number;
  loadCapacity?: number;
  series?: string;
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

const SERIES = ["pod", "airstream", "square", "container", "capsule", "others"] as const;

function cellText(value: unknown): string {
  if (value == null) return "";
  return String(value).replace(/\u00a0/g, " ").trim();
}

function parseNumber(value: unknown): number | undefined {
  const text = cellText(value)
    .replace(/,/g, "")
    .replace(/kg$/i, "")
    .replace(/mm$/i, "")
    .trim();
  if (!text) return undefined;
  const n = Number(text);
  return Number.isFinite(n) ? n : undefined;
}

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .replace(/[（(].*$/, "")
    .replace(/显示在卡片上.*$/, "")
    .replace(/对应的link.*$/, "")
    .replace(/内部型号.*$/, "")
    .replace(/限制.*$/, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
}

const HEADER_MAP: Record<string, keyof Omit<ProductImportRow, "rowNumber" | "warnings" | "error">> = {
  型号: "model",
  model: "model",
  modelnumber: "model",
  title: "title",
  标题: "title",
  slug: "slug",
  link: "slug",
  description: "description",
  描述: "description",
  sku: "sku",
  weight: "weight",
  重量: "weight",
  load: "loadCapacity",
  loadcapacity: "loadCapacity",
  载重: "loadCapacity",
  series: "series",
  系列: "series",
  length: "length",
  长度: "length",
  bodylength: "length",
  width: "width",
  宽度: "width",
  height: "height",
  高度: "height",
  bodyheight: "height",
  overallheight: "overallHeight",
  overallheightmm: "overallHeight",
  ovallheight: "overallHeight",
  整车高度: "overallHeight",
  axle: "axle",
  shape: "shape",
  shapes: "shape",
  造型: "shape",
  material: "material",
  materials: "material",
  材质: "material",
  stock: "stockStatus",
  stockstatus: "stockStatus",
};

function mapHeader(header: string) {
  return HEADER_MAP[normalizeHeader(header)];
}

export function forwardFillRows(rows: Record<string, unknown>[]) {
  const last: Record<string, unknown> = {};
  return rows.map((row) => {
    const next: Record<string, unknown> = { ...row };
    for (const key of Object.keys(next)) {
      if (mapHeader(key) !== "series") continue;
      const value = cellText(next[key]);
      if (value) last[key] = next[key];
      else if (last[key] != null) next[key] = last[key];
    }
    return next;
  });
}

function mapAxle(value?: string) {
  if (!value) return undefined;
  const t = value.toLowerCase();
  if (t.includes("tandem") || t.includes("tamdem")) return "Tandem Axle";
  if (t.includes("single")) return "Single Axle";
  return value;
}

function mapShape(value?: string) {
  if (!value) return undefined;
  const t = value.toLowerCase();
  if (t.includes("700")) return "700 Arc";
  if (t.includes("500")) return "500 Arc";
  if (t.includes("375") || t.includes("350")) return "375 Arc";
  if (t.includes("square") || t.includes("方形")) return "Square";
  if (t.includes("dome") || t.includes("圆顶")) return "Dome";
  return value;
}

function mapMaterial(value?: string) {
  if (!value) return undefined;
  const t = value.toLowerCase();
  if (t.includes("titanium") || t.includes("钛")) return "Titanium";
  if (t.includes("stainless") || t.includes("不锈钢")) return "Stainless steel";
  if (t.includes("paint") || t.includes("喷漆") || t.includes("烤漆")) return "Paint";
  return value;
}

function defaultShapesForSeries(series?: string) {
  if (series === "square" || series === "container") return ["Square"];
  if (series === "capsule") return ["375 Arc"];
  if (series === "airstream") return ["375 Arc", "500 Arc", "700 Arc"];
  return undefined;
}

function defaultMaterialsForSeries(series?: string) {
  if (series === "square" || series === "container" || series === "pod") return ["Paint"];
  if (series === "capsule" || series === "airstream") return ["Paint", "Stainless steel"];
  return undefined;
}

function parseShapeCell(value?: string) {
  if (!value?.trim()) return [];
  return [
    ...new Set(
      value
        .split(/[,/|;，、]+/)
        .map((item) => mapShape(item.replace(/\s+/g, " ").trim()))
        .filter((item): item is string => Boolean(item)),
    ),
  ];
}

function parseMaterialCell(value?: string) {
  if (!value?.trim()) return [];
  return [
    ...new Set(
      value
        .split(/[,/|;，、]+/)
        .map((item) => mapMaterial(item.replace(/\s+/g, " ").trim()))
        .filter((item): item is string => Boolean(item)),
    ),
  ];
}

export function mapSeries(value?: string) {
  if (!value) return undefined;
  const t = value.toLowerCase().replace(/\s+/g, " ").trim();
  if (!t) return undefined;

  const rules: { series: (typeof SERIES)[number]; keys: string[] }[] = [
    { series: "airstream", keys: ["airstream", "流线"] },
    { series: "container", keys: ["container", "集装箱", "货柜"] },
    { series: "square", keys: ["square", "方形车", "方舱", "方形"] },
    { series: "others", keys: ["others", "other", "其他", "定制"] },
    { series: "capsule", keys: ["capsule", "ny style", "ny-style", "nystyle", "ny series", "纽约", "胶囊"] },
    { series: "pod", keys: ["pod"] },
  ];

  for (const { series, keys } of rules) {
    for (const key of keys) {
      if (t === key || t === `${key} series` || t.startsWith(`${key} `) || t.startsWith(`${key}-`)) {
        return series;
      }
      if (key.length > 2 && t.includes(key)) return series;
    }
  }

  if (t === "ny" || t.startsWith("ny ") || t.startsWith("ny-")) return "capsule";
  return SERIES.find((item) => item === t);
}

function inferSeriesFromTitle(title?: string) {
  if (!title) return undefined;
  const t = title.toLowerCase();
  if (/\bcapsule\b/.test(t) || t.includes("胶囊") || /\bny\b/.test(t) || t.includes("纽约") || /ny\s*style/.test(t)) return "capsule";
  if (/\bpod\b/.test(t)) return "pod";
  if (/\bairstream\b/.test(t) || t.includes("流线")) return "airstream";
  if (/\bcontainer\b/.test(t) || t.includes("集装箱") || t.includes("货柜")) return "container";
  if (/\bsquare\b/.test(t) || t.includes("方形")) return "square";
  if (/\bother/.test(t) || t.includes("其他") || t.includes("定制")) return "others";
  return undefined;
}

function mapStock(value?: string) {
  if (!value) return undefined;
  const t = value.toLowerCase();
  if (t.includes("out")) return "Out of Stock";
  if (t.includes("made") || t.includes("order") || t.includes("订")) return "Made to Order";
  if (t.includes("stock") || t.includes("现")) return "In Stock";
  return value;
}

export function inferFromSlug(slug: string) {
  const parts = slug.toLowerCase().split("-").filter(Boolean);
  const series = parts[0] === "ny" ? "capsule" : SERIES.find((item) => parts[0] === item);
  const nums = parts.map((part) => Number(part)).filter((n) => Number.isFinite(n) && n >= 1000 && n <= 20000);
  return {
    series,
    length: nums[0],
    width: nums[1],
    axle: mapAxle(parts.find((part) => part === "single" || part === "tandem")),
    shape: mapShape(parts.find((part) => part === "square" || part === "dome")),
    material: parts.includes("stainless") ? "Stainless steel" : parts.includes("paint") ? "Paint" : undefined,
  };
}

export function parseProductRows(rawRows: Record<string, unknown>[]): ProductImportRow[] {
  const filled = forwardFillRows(rawRows);
  const rows: ProductImportRow[] = [];

  filled.forEach((raw, index) => {
    const mapped: ProductImportRow = { rowNumber: index + 2, warnings: [] };
    for (const [header, value] of Object.entries(raw)) {
      const field = mapHeader(header);
      if (!field) continue;
      if (
        field === "weight" ||
        field === "loadCapacity" ||
        field === "length" ||
        field === "width" ||
        field === "height" ||
        field === "overallHeight"
      ) {
        const n = parseNumber(value);
        if (n != null) mapped[field] = n;
        continue;
      }
      const text = cellText(value);
      if (text) (mapped as Record<string, unknown>)[field] = text;
    }

    if (mapped.slug) mapped.slug = mapped.slug.toLowerCase().replace(/\s+/g, "-");
    mapped.axle = mapAxle(mapped.axle);
    mapped.shapes = parseShapeCell(mapped.shape);
    mapped.shape = mapped.shapes[0];
    const seriesFromCell = mapSeries(mapped.series);
    mapped.series = seriesFromCell;
    mapped.materials = parseMaterialCell(mapped.material);
    mapped.material = mapped.materials[0];
    mapped.stockStatus = mapStock(mapped.stockStatus);

    const empty =
      !mapped.slug &&
      !mapped.title &&
      !mapped.sku &&
      !mapped.series &&
      mapped.weight == null &&
      mapped.loadCapacity == null;
    if (empty) return;

    if (!mapped.series) {
      const fromTitle = inferSeriesFromTitle(mapped.title);
      const fromSlug = mapped.slug ? inferFromSlug(mapped.slug).series : undefined;
      mapped.series = fromTitle || fromSlug;
      if (mapped.series) {
        mapped.warnings.push(
          `未填或无法识别 Series 列，已从 ${fromTitle ? "Title" : "slug"} 识别为 ${mapped.series}`,
        );
      }
    } else if (mapped.slug) {
      const fromSlug = inferFromSlug(mapped.slug).series;
      if (fromSlug && fromSlug !== mapped.series) {
        mapped.warnings.push(
          `Series 列为 ${mapped.series}，slug 前缀像 ${fromSlug}。已按 Series 列写入 ${mapped.series} 系列`,
        );
      }
    }

    if (!mapped.series) {
      mapped.error = "缺少或无法识别 Series（pod / airstream / square / container / capsule / others，或中文：胶囊 / 流线 / 方形车 / 集装箱 / 其他）";
    } else if (!mapped.slug) {
      mapped.error = "缺少 Slug，无法匹配或新建产品";
    } else if (mapped.description && (mapped.description.length < 155 || mapped.description.length > 160)) {
      mapped.warnings.push(`Description 现为 ${mapped.description.length} 字（建议 155–160）`);
    }

    rows.push(mapped);
  });

  return rows;
}

export function toProductPatch(row: ProductImportRow, mode: "update" | "create"): ProductImportPatch {
  const inferred = inferFromSlug(row.slug || "");
  const patch: ProductImportPatch = {};

  const set = <K extends keyof ProductImportPatch>(key: K, value: ProductImportPatch[K] | undefined) => {
    if (value != null && value !== "") patch[key] = value;
  };

  set("title", row.title);
  if (row.slug) patch.slug = { _type: "slug", current: row.slug };
  set("description", row.description);
  set("sku", row.sku);
  set("weight", row.weight);
  set("loadCapacity", row.loadCapacity);
  set("series", row.series);
  set("length", row.length ?? inferred.length);
  set("width", row.width ?? inferred.width);
  set("height", row.height);
  set("overallHeight", row.overallHeight);
  set("axle", row.axle || (mode === "create" ? inferred.axle : undefined));
  const series = row.series || (mode === "create" ? inferred.series : undefined);
  const shapes =
    row.shapes?.length
      ? row.shapes
      : inferred.shape
        ? [inferred.shape]
        : mode === "create"
          ? defaultShapesForSeries(series)
          : undefined;
  if (shapes?.length) {
    patch.shapes = shapes;
    set("shape", shapes[0]);
  }
  const materials =
    row.materials?.length
      ? row.materials
      : inferred.material
        ? [inferred.material]
        : mode === "create"
          ? defaultMaterialsForSeries(series)
          : undefined;
  if (materials?.length) {
    patch.materials = materials;
    set("material", materials[0]);
  }
  set("stockStatus", row.stockStatus || (mode === "create" ? "Made to Order" : undefined));

  return patch;
}

export function pickProductSheetName(names: string[]) {
  const list = names.map((name) => name.trim()).filter(Boolean);
  const preferred = list.find((name) => /^(products|product|产品)$/i.test(name));
  if (preferred) return preferred;
  return list.find((name) => !/^(说明|notes|note|示例|examples|example|readme)$/i.test(name)) || list[0];
}

export function documentIdForSlug(slug: string) {
  return `product-${slug.replace(/[^a-z0-9._-]+/gi, "-")}`;
}

export function publishedDocumentId(id: string) {
  return id.replace(/^drafts\./, "");
}

export function cleanImportText(value?: string) {
  return (value || "").replace(/[\u200B-\u200D\uFEFF\u2060\u00AD]/g, "").trim();
}

export type ExistingProductRef = {
  _id: string;
  slug?: string;
  sku?: string;
  series?: string;
};

function itemSeries(item: ExistingProductRef) {
  return mapSeries(item.series) || cleanImportText(item.series).toLowerCase();
}

export function crossSeriesConflict(row: ProductImportRow, existing: ExistingProductRef[]) {
  const series = mapSeries(row.series) || cleanImportText(row.series).toLowerCase();
  if (!series) return undefined;
  const sku = cleanImportText(row.sku);
  const slug = cleanImportText(row.slug).toLowerCase();
  const expectedId = slug ? documentIdForSlug(slug) : "";

  if (sku) {
    const other = existing.find(
      (item) => cleanImportText(item.sku).toLowerCase() === sku.toLowerCase() && itemSeries(item) && itemSeries(item) !== series,
    );
    if (other) {
      return `SKU ${sku} 已在 ${itemSeries(other)} 系列。本行是 ${series}，已跳过以免改到错误系列。请核对 Series 或换 SKU。`;
    }
  }

  if (slug) {
    const other = existing.find((item) => {
      const sameSlug = cleanImportText(item.slug).toLowerCase() === slug;
      const sameId = publishedDocumentId(item._id) === expectedId;
      return (sameSlug || sameId) && itemSeries(item) && itemSeries(item) !== series;
    });
    if (other) {
      return `Slug 已在 ${itemSeries(other)} 系列。本行是 ${series}，已跳过以免改到错误系列。请改 Slug。`;
    }
  }

  return undefined;
}

export function findExistingProduct(row: ProductImportRow, existing: ExistingProductRef[]) {
  const slug = cleanImportText(row.slug).toLowerCase();
  const series = mapSeries(row.series) || cleanImportText(row.series).toLowerCase();
  const sku = cleanImportText(row.sku);
  const model = cleanImportText(row.model).toUpperCase();
  const expectedId = slug ? documentIdForSlug(slug) : "";

  const preferDraft = (matches: ExistingProductRef[]) =>
    matches.find((item) => item._id.startsWith("drafts.")) || matches[0];

  const inSeries = existing.filter((item) => itemSeries(item) === series);

  if (sku) {
    const bySku = inSeries.filter((item) => cleanImportText(item.sku).toLowerCase() === sku.toLowerCase());
    if (bySku.length) return preferDraft(bySku);
  }

  if (model) {
    const byModel = inSeries.filter((item) => cleanImportText(item.sku).toUpperCase().includes(model));
    if (byModel.length === 1) return preferDraft(byModel);
  }

  if (expectedId) {
    const byId = inSeries.filter((item) => publishedDocumentId(item._id) === expectedId);
    if (byId.length) return preferDraft(byId);
  }

  if (slug) {
    const bySlug = inSeries.filter((item) => cleanImportText(item.slug).toLowerCase() === slug);
    if (bySlug.length) return preferDraft(bySlug);
  }

  return undefined;
}
