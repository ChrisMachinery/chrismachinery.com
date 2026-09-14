export const ADVANTAGE_ICON_IDS = [
  "compliance",
  "materials",
  "qc",
  "production",
  "aftersales",
  "innovation",
] as const;

export type AdvantageIconId = (typeof ADVANTAGE_ICON_IDS)[number];

export const ADVANTAGE_ICON_OPTIONS: { title: string; value: AdvantageIconId }[] = [
  { title: "合规合法", value: "compliance" },
  { title: "优质原材料", value: "materials" },
  { title: "全程质检", value: "qc" },
  { title: "透明化生产过程", value: "production" },
  { title: "售后无忧", value: "aftersales" },
  { title: "不断创新", value: "innovation" },
];

const LEGACY_ICON_MAP: Record<string, AdvantageIconId> = {
  details: "compliance",
  warranty: "compliance",
  chat: "aftersales",
  quote: "aftersales",
  drawings: "production",
  chassis: "production",
  custom: "innovation",
};

const FALLBACK_ICONS: AdvantageIconId[] = [
  "compliance",
  "materials",
  "qc",
  "production",
  "aftersales",
  "innovation",
];

export function resolveAdvantageIcon(value: string | undefined, index: number): AdvantageIconId {
  const mapped = value ? LEGACY_ICON_MAP[value] || value : undefined;
  if (mapped && ADVANTAGE_ICON_IDS.includes(mapped as AdvantageIconId)) {
    return mapped as AdvantageIconId;
  }
  return FALLBACK_ICONS[index] ?? "compliance";
}

export function advantageIconLabel(value?: string) {
  if (!value) return "未选图标";
  const id = resolveAdvantageIcon(value, 0);
  return ADVANTAGE_ICON_OPTIONS.find((item) => item.value === id)?.title || "未选图标";
}

export function cmsImageAlt(image: unknown) {
  if (!image || typeof image !== "object" || !("alt" in image)) return "";
  return String((image as { alt?: string }).alt || "").trim();
}

export function advantageImageAlt(image: unknown, index: number) {
  return cmsImageAlt(image) || ADVANTAGE_IMAGE_ASSETS[index]?.alt || `Chris Machinery factory advantage photo ${index + 1}`;
}

export const ADVANTAGE_IMAGE_ASSETS: {
  id: AdvantageIconId;
  file: string;
  alt: string;
}[] = [
  {
    id: "compliance",
    file: "home-advantage-01-compliance.jpg",
    alt: "Chris Machinery food trailer with VIN plate and export compliance documents for USA, EU, and Australia markets",
  },
  {
    id: "materials",
    file: "home-advantage-02-materials.jpg",
    alt: "Premium steel sheets and hot-dip galvanized chassis materials stored at the Chris Machinery factory",
  },
  {
    id: "qc",
    file: "home-advantage-03-qc.jpg",
    alt: "Inspector checking a food trailer on the line during end-to-end quality control at Chris Machinery",
  },
  {
    id: "production",
    file: "home-advantage-04-production.jpg",
    alt: "Open production floor at Chris Machinery showing welding and assembly of custom food trailers",
  },
  {
    id: "aftersales",
    file: "home-advantage-05-aftersales.jpg",
    alt: "Chris Machinery team inspecting and packing a finished food trailer before after-sales delivery",
  },
  {
    id: "innovation",
    file: "home-advantage-06-innovation.jpg",
    alt: "Chris Machinery engineers reviewing custom food trailer drawings and new layout designs",
  },
];
