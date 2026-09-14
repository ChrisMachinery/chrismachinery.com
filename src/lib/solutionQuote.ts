import { equipment, type EquipmentItem } from "@/data/catalog";
import type { Product } from "@/data/products";
import { productSizeKey, productSizeLabel } from "@/data/products";
import {
  emptyDraft,
  normalizeMaterial,
  type CustomizerDraft,
  type MaterialKind,
} from "@/lib/customizer";
import { productMaterials, productShapes } from "@/lib/productFamily";

const ALIASES: Record<string, string> = {
  fryer: "fryer",
  commercialfryer: "fryer",
  griddle: "griddle",
  flatgriddle: "griddle",
  exhausthood: "hood",
  hood: "hood",
  rangehood: "hood",
  preptable: "prep",
  stainlesspreptable: "prep",
  prep: "prep",
  electricalsystem: "electrical",
  electricalsystem32a: "electrical",
  electrical: "electrical",
  espressomachinebench: "espresso",
  espresso: "espresso",
  sinks: "sink-double",
  sink: "sink-double",
  doublesink: "sink-double",
  singlesink: "sink-single",
  watertank: "water-tank",
  freshwastetanks: "water-tank",
  servicecounter: "counter",
  barcounter: "counter",
  counter: "counter",
  freezer: "freezer",
  chestfreezer: "freezer",
  displayfridge: "display",
  display: "display",
  icewell: "ice-bin",
  icebin: "ice-bin",
  ledlighting: "led",
  interiorfascialed: "led",
  led: "led",
};

function keyOf(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function resolveEquipmentIds(values: string[] | undefined, kitchenList: EquipmentItem[] = equipment): string[] {
  const ids: string[] = [];
  for (const raw of values ?? []) {
    const text = raw.trim();
    if (!text) continue;
    if (kitchenList.some((item) => item.id === text)) {
      ids.push(text);
      continue;
    }
    const alias = ALIASES[keyOf(text)];
    if (alias && kitchenList.some((item) => item.id === alias)) {
      ids.push(alias);
      continue;
    }
    const named = kitchenList.find((item) => keyOf(item.name) === keyOf(text));
    if (named) ids.push(named.id);
    else if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)) ids.push(text);
  }
  return [...new Set(ids)];
}

export function equipmentLabels(ids: string[], kitchenList: EquipmentItem[] = equipment): string[] {
  return ids
    .map((id) => kitchenList.find((item) => item.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

export function equipmentPackageTotal(ids: string[], kitchenList: EquipmentItem[] = equipment): number {
  return kitchenList.filter((item) => ids.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
}

export function withSearchParams(path: string, params: Record<string, string | undefined | null>) {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const qIndex = withoutHash.indexOf("?");
  const pathname = qIndex >= 0 ? withoutHash.slice(0, qIndex) : withoutHash;
  const search = new URLSearchParams(qIndex >= 0 ? withoutHash.slice(qIndex + 1) : "");
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;
    search.set(key, value);
  }
  const query = search.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}

export function draftFromProduct(
  product: Product | undefined,
  extras?: Partial<CustomizerDraft>,
): CustomizerDraft {
  if (!product) {
    return { ...emptyDraft, ...extras };
  }
  const kinds = productMaterials(product)
    .map((item) => normalizeMaterial(item))
    .filter((item): item is MaterialKind => Boolean(item));
  const material = extras?.material || kinds[0] || "";
  return {
    ...emptyDraft,
    ...extras,
    series: product.series,
    sizeKey: productSizeKey(product),
    sizeLabel: productSizeLabel(product),
    slug: product.slug,
    shape: extras?.shape || productShapes(product)[0] || "",
    material,
    stainlessFinish: material === "stainless" ? extras?.stainlessFinish || "" : "",
  };
}
