export const SITE_NAME = "Chris Machinery";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chrismachinery.com";
export const DEFAULT_OG = `${SITE_URL}/og.jpg`;

export const seriesList = [
  "pod",
  "airstream",
  "square",
  "container",
  "capsule",
  "in-stock",
  "others",
] as const;

export type SeriesSlug = (typeof seriesList)[number];

export const productNavItems = seriesList.map((series) => ({
  href: `/products/${series}` as const,
  slug: series,
  label: {
    pod: "Pod",
    airstream: "Airstream",
    square: "Square",
    container: "Container",
    capsule: "Capsule",
    "in-stock": "In Stock",
    others: "Others",
  }[series],
}));

export const seriesMeta: Record<
  Exclude<SeriesSlug, "in-stock">,
  { name: string; blurb: string }
> = {
  pod: {
    name: "Pod Series Food Trailers",
    blurb:
      "Compact pod trailers with dome or square roofs — ideal for coffee, snacks, and night markets.",
  },
  airstream: {
    name: "Airstream Series Food Trailers",
    blurb:
      "Classic streamlined design in stainless or painted finishes — premium commercial spaces.",
  },
  square: {
    name: "Square Series Food Trailers",
    blurb:
      "Boxy painted bodies with efficient kitchen layouts for high-volume service.",
  },
  container: {
    name: "Container Series Food Trailers",
    blurb:
      "Rugged container-inspired trailers built for heavy-duty, long-hour operations.",
  },
  capsule: {
    name: "Capsule Series Food Trailers",
    blurb:
      "Capsule body with configurable glass service windows for street and night-market service.",
  },
  others: {
    name: "Custom & Special Builds",
    blurb: "Non-standard cases, exhibition units, and one-off custom trailers.",
  },
};
