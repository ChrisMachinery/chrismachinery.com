import * as XLSX from "xlsx";
import { equipment, trailerExtras } from "../../src/data/catalog";

export const EXTRAS_HEADERS = ["itemId", "name", "price"] as const;
export const KITCHEN_HEADERS = ["itemId", "category", "name", "price"] as const;

export function customizeImportTemplateBook() {
  const extras = XLSX.utils.aoa_to_sheet([
    [...EXTRAS_HEADERS],
    ...trailerExtras.map((item) => [item.id, item.name, item.price]),
  ]);
  const kitchen = XLSX.utils.aoa_to_sheet([
    [...KITCHEN_HEADERS],
    ...equipment.map((item) => [item.id, item.category, item.name, item.price]),
  ]);
  const notes = XLSX.utils.aoa_to_sheet([
    ["规则", "说明"],
    ["Customize 是总目录", "先维护这张表，Solutions 只能勾选 kitchen 工作表里的 itemId。"],
    ["extras", "车身定制，Customize 页按数量填写。"],
    ["kitchen", "厨房设备，Customize 页勾选；Solutions 的 Standard equipment 来自这里。"],
    ["itemId", "稳定英文 ID。改名字和价格可以，改 ID 会让已有方案对不上。"],
    ["导入", "会整表覆盖 Customize 选配目录，不改产品、不改图片。"],
  ]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, extras, "extras");
  XLSX.utils.book_append_sheet(book, kitchen, "kitchen");
  XLSX.utils.book_append_sheet(book, notes, "说明");
  return book;
}

function cellText(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function parsePrice(value: unknown) {
  const n = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function parseExtrasRows(raw: Record<string, unknown>[]) {
  return raw
    .map((row, index) => {
      const named: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) named[key.toLowerCase().replace(/\s+/g, "")] = value;
      const itemId = cellText(named.itemid || named.id);
      const name = cellText(named.name || named.title);
      if (!itemId && !name) return null;
      return {
        _type: "trailerExtra" as const,
        _key: `extra-${itemId || index}`,
        itemId: itemId || `extra-${index + 1}`,
        name: name || itemId,
        price: parsePrice(named.price),
      };
    })
    .filter(Boolean);
}

export function parseKitchenRows(raw: Record<string, unknown>[]) {
  return raw
    .map((row, index) => {
      const named: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) named[key.toLowerCase().replace(/\s+/g, "")] = value;
      const itemId = cellText(named.itemid || named.id);
      const name = cellText(named.name || named.title);
      if (!itemId && !name) return null;
      return {
        _type: "kitchenEquipmentItem" as const,
        _key: `kit-${itemId || index}`,
        itemId: itemId || `item-${index + 1}`,
        category: cellText(named.category) || "Furniture",
        name: name || itemId,
        price: parsePrice(named.price),
      };
    })
    .filter(Boolean);
}
