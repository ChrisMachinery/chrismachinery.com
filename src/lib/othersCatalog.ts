import { productsBySeries, type Axle, type Product } from "@/data/products";

export type OthersCardCms = {
  _key?: string;
  title?: string;
  axle?: string;
  length?: number;
  width?: number;
  year?: number;
  slug?: string;
  imageUrl?: string;
  body?: string;
};

export type CatalogCardEdit = {
  documentId?: string;
  documentType?: string;
  imagePath?: string;
  titlePath?: string;
  axlePath?: string;
  sizePath?: string;
  bodyPath?: string;
};

function asAxle(value?: string): Axle {
  return value === "Tandem Axle" ? "Tandem Axle" : "Single Axle";
}

export function othersItemSlug(title?: string, slug?: string, fallback?: string) {
  const explicit = slug?.trim().toLowerCase();
  if (explicit) return explicit;
  const fromTitle = (title || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fromTitle || fallback || "custom";
}

export function resolveOthersCatalog(
  pageId: string | undefined,
  cards?: OthersCardCms[] | null,
): { item: Product; body: string; edit: CatalogCardEdit }[] {
  const defaults = productsBySeries("others");
  const filled = (cards ?? []).filter((card) => card.title || card.imageUrl || card.body || card.length);
  const rows = filled.length
    ? filled
    : defaults.map((item) => ({
        title: item.name,
        axle: item.axle,
        length: item.length,
        width: item.width,
        year: item.year,
        slug: item.slug,
        imageUrl: item.imageUrl,
        body: item.description,
      }));

  const used = new Set<string>();
  return rows.map((row, i) => {
    const fallback = defaults[i];
    let slug = othersItemSlug(row.title, row.slug, fallback?.slug || `others-${i + 1}`);
    if (used.has(slug)) slug = `${slug}-${i + 1}`;
    used.add(slug);
    const length = row.length || fallback?.length || 0;
    const width = row.width || fallback?.width || 0;
    return {
      body: row.body?.trim() || "",
      item: {
        _id: pageId,
        slug,
        sku: slug,
        series: "others" as const,
        name: row.title?.trim() || fallback?.name || "Custom build",
        length,
        width,
        axle: asAxle(row.axle || fallback?.axle),
        stockStatus: "Made to Order" as const,
        priceLow: 0,
        priceHigh: 0,
        description: row.body?.trim() || "",
        year: row.year ?? fallback?.year,
        imageUrl: row.imageUrl,
      },
      edit: {
        documentId: pageId,
        documentType: "sitePage",
        imagePath: `othersCards[${i}].image`,
        titlePath: `othersCards[${i}].title`,
        axlePath: `othersCards[${i}].axle`,
        sizePath: `othersCards[${i}].length`,
        bodyPath: `othersCards[${i}].body`,
      },
    };
  });
}
