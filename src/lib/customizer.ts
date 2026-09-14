import { equipment, trailerExtras } from "@/data/catalog";
import { buildQuoteSnapshot, formatQuoteTable } from "@/lib/quoteTable";
import { filterOptions, productSizeKey, productSizeLabel, type Product } from "@/data/products";
import { productMaterials, productShapes } from "@/lib/productFamily";

export const DRAFT_KEY = "cm-customizer-draft";

export type MaterialKind = "stainless" | "paint";
export type StainlessFinish = "matt" | "mirror";

export type CustomizerDraft = {
  series: string;
  sizeKey: string;
  sizeLabel: string;
  slug: string;
  shape: string;
  material: MaterialKind | "";
  stainlessFinish: StainlessFinish | "";
  primary: string;
  accent: string;
  hex: string;
  ral: string;
  brandName: string;
  font: string;
  template: string;
  logoName?: string;
  extras: Record<string, number>;
  equipment: string[];
  solutionSlug?: string;
  solutionName?: string;
};

export const emptyDraft: CustomizerDraft = {
  series: "",
  sizeKey: "",
  sizeLabel: "",
  slug: "",
  shape: "",
  material: "",
  stainlessFinish: "",
  primary: "#1A1A1A",
  accent: "#F5C518",
  hex: "#1A1A1A",
  ral: "",
  brandName: "",
  font: "Montserrat",
  template: "Badge",
  extras: {},
  equipment: [],
};

export function normalizeMaterial(raw?: string): MaterialKind | null {
  const value = (raw || "").toLowerCase();
  if (!value) return null;
  if (value.includes("stainless") || value.includes("steel")) return "stainless";
  if (value.includes("paint")) return "paint";
  return "paint";
}

export function materialLabel(kind: MaterialKind) {
  return kind === "stainless" ? "Stainless" : "Paint";
}

export function sizeKeyOf(product: Product) {
  return productSizeKey(product);
}

export function sizeLabelOf(product: Product) {
  return productSizeLabel(product);
}

export function seriesFromCatalog(catalog: Product[]) {
  const order = ["pod", "airstream", "square", "container", "capsule", "others"];
  const found = [...new Set(catalog.map((item) => item.series))];
  return [
    ...order.filter((key) => found.includes(key as Product["series"])),
    ...found.filter((key) => !order.includes(key)),
  ];
}

export function seriesNeedsShape(series: string) {
  return series === "pod" || series === "airstream";
}

export function shapesForSeries(series: string, catalog: Product[] = [], sizeKey?: string): string[] {
  const fromCatalog = new Set<string>();
  for (const item of catalog.filter((product) => product.series === series)) {
    if (sizeKey && sizeKeyOf(item) !== sizeKey) continue;
    for (const shape of productShapes(item)) fromCatalog.add(shape);
  }
  const catalogShapes = [...fromCatalog];
  if (series in filterOptions) {
    const options = filterOptions[series as keyof typeof filterOptions];
    if ("shape" in options && Array.isArray(options.shape) && options.shape.length) {
      if (seriesNeedsShape(series)) return options.shape;
      return catalogShapes.length ? catalogShapes : options.shape;
    }
  }
  return catalogShapes;
}

export function sizesForSeries(catalog: Product[], series: string, shape?: string) {
  const map = new Map<string, { key: string; label: string; length: number; width: number }>();
  for (const item of catalog.filter((product) => product.series === series)) {
    if (series === "pod" && shape === "Square" && item.width === 1650) continue;
    if (shape) {
      const shapes = productShapes(item);
      if (shapes.length && !shapes.includes(shape)) continue;
    }
    const key = sizeKeyOf(item);
    const label = sizeLabelOf(item);
    if (!key || !label) continue;
    if (!map.has(key)) {
      map.set(key, { key, label, length: item.length, width: item.width });
    }
  }
  return [...map.values()].sort((a, b) => a.length - b.length || a.width - b.width);
}

export function materialsForSeries(series: string, catalog: Product[] = [], sizeKey?: string): MaterialKind[] {
  const fromProducts = new Set<MaterialKind>();
  for (const item of catalog.filter((product) => product.series === series)) {
    if (sizeKey && sizeKeyOf(item) !== sizeKey) continue;
    for (const mat of productMaterials(item)) {
      const kind = normalizeMaterial(mat);
      if (kind) fromProducts.add(kind);
    }
  }
  if (fromProducts.size) return [...fromProducts];
  if (series in filterOptions) {
    const options = filterOptions[series as keyof typeof filterOptions];
    if ("material" in options && Array.isArray(options.material)) {
      return [
        ...new Set(
          options.material
            .map((item) => normalizeMaterial(item))
            .filter((item): item is MaterialKind => Boolean(item)),
        ),
      ];
    }
  }
  return [];
}

export function matchProduct(
  catalog: Product[],
  series: string,
  sizeKey: string,
  material: MaterialKind | "",
  shape = "",
) {
  const pool = catalog.filter(
    (product) => product.series === series && (!sizeKey || sizeKeyOf(product) === sizeKey),
  );
  const byShape = shape
    ? pool.filter((product) => productShapes(product).some((item) => item === shape))
    : pool;
  const list = byShape.length ? byShape : pool;
  const byMaterial = material
    ? list.filter((product) =>
        productMaterials(product).some((item) => normalizeMaterial(item) === material),
      )
    : list;
  return (byMaterial.length ? byMaterial : list)[0];
}

export function extrasTotal(
  draft: Pick<CustomizerDraft, "extras">,
  extrasList: { id: string; price: number }[] = trailerExtras,
) {
  return extrasList.reduce((sum, item) => sum + item.price * (draft.extras?.[item.id] ?? 0), 0);
}

export function equipmentTotal(
  draft: CustomizerDraft,
  kitchenList: { id: string; price: number }[] = equipment,
) {
  return kitchenList
    .filter((item) => draft.equipment.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
}

export function formatInquiryMessage(
  draft: CustomizerDraft,
  extrasList: typeof trailerExtras = trailerExtras,
  kitchenList: typeof equipment = equipment,
) {
  return formatQuoteTable(draft, extrasList, kitchenList, buildQuoteSnapshot(draft, extrasList, kitchenList));
}

export function isCustomizerDraft(value: unknown): value is CustomizerDraft {
  return Boolean(value && typeof value === "object" && "series" in (value as object));
}
