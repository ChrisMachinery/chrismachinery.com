import { equipment as defaultKitchen, trailerExtras as defaultExtras } from "@/data/catalog";
import type { EquipmentItem, TrailerExtra } from "@/data/catalog";

type QuoteDraft = {
  series?: string;
  shape?: string;
  sizeLabel?: string;
  material?: string;
  stainlessFinish?: string;
  hex?: string;
  ral?: string;
  extras?: Record<string, number>;
  equipment?: string[];
  solutionName?: string;
};

const COL = 58;

function money(n: number) {
  return `USD ${n.toLocaleString()}`;
}

export function quoteRow(name: string, price: string, width = COL) {
  const left = name.replace(/\s+/g, " ").trim().slice(0, width - price.length - 2);
  const fill = Math.max(2, width - left.length - price.length);
  return `${left}${".".repeat(fill)}${price}`;
}

export function quoteKv(label: string, value: string, width = COL) {
  return quoteRow(label, value.replace(/×/g, "x").trim() || "-", width);
}

export type QuoteLine = { name: string; total: number };
export type QuoteSnapshot = { extras: QuoteLine[]; kitchen: QuoteLine[] };

export function buildQuoteSnapshot(
  draft: QuoteDraft,
  extrasList: TrailerExtra[] = defaultExtras,
  kitchenList: EquipmentItem[] = defaultKitchen,
): QuoteSnapshot {
  const extraById = new Map(extrasList.map((item) => [item.id, item]));
  const extras = Object.entries(draft.extras ?? {})
    .map(([id, qty]) => {
      const count = Number(qty) || 0;
      if (count <= 0) return null;
      const item = extraById.get(id);
      return {
        name: count > 1 ? `${item?.name ?? id} x ${count}` : (item?.name ?? id),
        total: (item?.price ?? 0) * count,
      };
    })
    .filter((item): item is QuoteLine => Boolean(item));

  const kitchenById = new Map(kitchenList.map((item) => [item.id, item]));
  const kitchen = (draft.equipment ?? []).map((id) => {
    const item = kitchenById.get(id);
    return { name: item?.name ?? id, total: item?.price ?? 0 };
  });

  return { extras, kitchen };
}

export function formatQuoteTable(
  draft: QuoteDraft,
  extrasList: TrailerExtra[] = defaultExtras,
  kitchenList: EquipmentItem[] = defaultKitchen,
  snapshot?: QuoteSnapshot,
) {
  const built = buildQuoteSnapshot(draft, extrasList, kitchenList);
  const extraItems = snapshot?.extras?.some((item) => item.total > 0) ? snapshot.extras : built.extras;
  const kitchenItems = snapshot?.kitchen?.some((item) => item.total > 0) ? snapshot.kitchen : built.kitchen;

  const extraTotal = extraItems.reduce((sum, item) => sum + item.total, 0);
  const kitchenTotal = kitchenItems.reduce((sum, item) => sum + item.total, 0);
  const grand = extraTotal + kitchenTotal;

  const material =
    draft.material === "stainless"
      ? `Stainless / ${draft.stainlessFinish === "mirror" ? "Mirror" : draft.stainlessFinish === "matt" ? "Matt" : "Matt"}`
      : draft.material === "paint"
        ? `Paint${draft.hex ? ` ${draft.hex}` : ""}`
        : draft.material || "-";

  const size = (draft.sizeLabel || "-").replace(/×/g, "x");

  return [
    "VEHICLE",
    quoteKv("Series", String(draft.series || "-")),
    quoteKv("Shape", String(draft.shape || "-")),
    quoteKv("Body size", size),
    quoteKv("Material", material),
    draft.solutionName ? quoteKv("Solution", draft.solutionName) : null,
    "",
    "TRAILER EXTRAS",
    extraItems.length ? extraItems.map((item) => quoteRow(item.name, money(item.total))) : quoteRow("None", money(0)),
    quoteRow("Extras subtotal", money(extraTotal)),
    "",
    "KITCHEN EQUIPMENT",
    kitchenItems.length ? kitchenItems.map((item) => quoteRow(item.name, money(item.total))) : quoteRow("None", money(0)),
    quoteRow("Kitchen subtotal", money(kitchenTotal)),
    "",
    quoteRow("OPTIONS TOTAL", money(grand)),
  ]
    .flat()
    .filter((line): line is string => line !== null)
    .join("\n");
}
