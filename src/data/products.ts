import stockOverrides from "./stock-overrides.json";
import { withFactorySpecs } from "./productSpecs";

export type StockStatus = "In Stock" | "Out of Stock" | "Made to Order";
export type Axle = "Single Axle" | "Tandem Axle";
export type SeriesKey = "pod" | "airstream" | "square" | "container" | "capsule" | "others";

export type Product = {
  _id?: string;
  slug: string;
  sku: string;
  series: SeriesKey;
  name: string;
  length: number;
  width: number;
  height?: number;
  overallLength?: number;
  overallWidth?: number;
  overallHeight?: number;
  weight?: number;
  loadCapacity?: number;
  size?: string;
  shape?: string;
  shapes?: string[];
  material?: string;
  materials?: string[];
  axle: Axle;
  glassCount?: string;
  glassHeight?: string;
  stockStatus: StockStatus;
  priceLow: number;
  priceHigh: number;
  description: string;
  year?: number;
  scene?: string;
  imageUrl?: string;
  imageObjectPosition?: string;
  galleryImages?: { url: string; objectPosition?: string }[];
  features?: string[];
  customOptions?: string[];
  viewProductText?: string;
  viewProductLink?: string;
  quoteText?: string;
  quoteLink?: string;
  customizeText?: string;
  customizeLink?: string;
};

/** Catalog / customizer identity: cabin L×W. Height is a spec, not a SKU family. */
export function productSizeKey(product: Pick<Product, "length" | "width">) {
  return `${product.length}x${product.width}`;
}

export function productSizeFromDims(length?: number, width?: number, height?: number) {
  if (!length || !width) return "";
  return height ? `${length}×${width}×${height} mm` : `${length}×${width} mm`;
}

/** Body size shown on cards and details: 3000×2200×2100 mm when height is set. */
export function productSizeLabel(
  product: Pick<Product, "length" | "width" | "height" | "size">,
) {
  return productSizeFromDims(product.length, product.width, product.height) || product.size?.replace(/\s+/g, " ").trim() || "";
}

export const bodyHeightOptions = [2000, 2100, 2200, 2300, 2350, 2400, 2500, 2600];
export const overallHeightOptions = [2400, 2500, 2600];
export const loadCapacityOptions = [750, 1250, 1500, 1600, 1750, 2500, 3200, 3500];
export const OVERALL_LENGTH_HITCH_MM = 1440;

export function productOverallLength(length?: number) {
  return length ? length + OVERALL_LENGTH_HITCH_MM : undefined;
}

export function productOverallWidth(width?: number) {
  return width || undefined;
}

export function productKgLabel(kg?: number) {
  return kg ? `${kg}KG` : "";
}

export const seriesIncluded: Record<SeriesKey, string[]> = {
  pod: [
    "Galvanized chassis and wrap-ready body",
    "Serving hatch with LED interior lighting",
    "Non-slip floor; stainless worktop option",
    "1-year factory warranty and export crate packing",
  ],
  airstream: [
    "Streamlined body, galvanized chassis",
    "Commercial interior space, wrap-ready or stainless",
    "LED lighting and service window",
    "1-year factory warranty and export crate packing",
  ],
  square: [
    "Box body on galvanized chassis",
    "Efficient kitchen layout, wrap-ready paint",
    "Non-slip floor and LED lighting",
    "1-year factory warranty and export crate packing",
  ],
  container: [
    "Heavy-duty container-inspired body",
    "Galvanized chassis for long service hours",
    "Non-slip floor and stainless worktop option",
    "1-year factory warranty and export crate packing",
  ],
  capsule: [
    "Capsule glass service front",
    "Galvanized chassis, wrap-ready body",
    "Configurable window layout",
    "1-year factory warranty and export crate packing",
  ],
  others: [
    "Custom chassis and body to drawing",
    "Factory QC photos before shipment",
    "Export packing included",
    "1-year factory warranty",
  ],
};

export const defaultCustomOptions = [
  "Length, windows, and hatch layout",
  "Paint, stainless, or wrap graphics",
  "Kitchen equipment package",
  "110V / 220V / 380V electrical spec",
];

export function productIncluded(product: Product, seriesList?: string[]) {
  if (seriesList?.length) return seriesList;
  return seriesIncluded[product.series];
}

export function productCustomizable(_product: Product, globalList?: string[]) {
  if (globalList?.length) return globalList;
  return defaultCustomOptions;
}

function p(partial: Product): Product {
  const product = withFactorySpecs(partial);
  return {
    ...product,
    overallLength: product.overallLength ?? productOverallLength(product.length),
    overallWidth: product.overallWidth ?? productOverallWidth(product.width),
  };
}

export const products: Product[] = [
  p({
    slug: "pod-2300-1650-single-dome",
    sku: "CM-POD-2300-S",
    series: "pod",
    name: "Pod 2300 Dome",
    length: 2300,
    width: 1650,
    shape: "Dome",
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 4500,
    priceHigh: 7800,
    description: "Ultra-compact dome pod trailer for coffee and dessert carts.",
  }),
  p({
    slug: "pod-2500-1650-single-square",
    sku: "CM-POD-2500-SQ",
    series: "pod",
    name: "Pod 2500 Square",
    length: 2500,
    width: 1650,
    shape: "Square",
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "In Stock",
    priceLow: 4800,
    priceHigh: 8200,
    description: "Square-roof pod with extra headroom for compact kitchens.",
  }),
  p({
    slug: "pod-2800-2000-single-dome",
    sku: "CM-POD-2800-D",
    series: "pod",
    name: "Pod 2800 Dome",
    length: 2800,
    width: 2000,
    shape: "Dome",
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 5200,
    priceHigh: 9000,
    description: "2m-wide dome pod for two-person service.",
  }),
  p({
    slug: "pod-3000-2000-single-dome",
    sku: "CM-POD-3000-S",
    series: "pod",
    name: "Pod 3000 Dome Single",
    length: 3000,
    width: 2000,
    shape: "Dome",
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "In Stock",
    priceLow: 5800,
    priceHigh: 9800,
    description: "Best-selling 3000×2000 single-axle dome pod.",
  }),
  p({
    slug: "pod-3000-2000-tandem-dome",
    sku: "CM-POD-3000-T",
    series: "pod",
    name: "Pod 3000 Dome Tandem",
    length: 3000,
    width: 2000,
    shape: "Dome",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 6400,
    priceHigh: 10500,
    description: "Same 3000×2000 dome layout with tandem axle stability.",
  }),
  p({
    slug: "pod-3400-2000-single-square",
    sku: "CM-POD-3400-SQ",
    series: "pod",
    name: "Pod 3400 Square",
    length: 3400,
    width: 2000,
    shape: "Square",
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 6800,
    priceHigh: 11200,
    description: "Longer square-roof pod for grill and fryer layouts.",
  }),
  p({
    slug: "pod-3900-2000-tandem-dome",
    sku: "CM-POD-3900-T",
    series: "pod",
    name: "Pod 3900 Dome Tandem",
    length: 3900,
    width: 2000,
    shape: "Dome",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 7600,
    priceHigh: 12800,
    description: "Near-full kitchen in a still-towable pod body.",
  }),
  p({
    slug: "pod-4500-2000-tandem-square",
    sku: "CM-POD-4500-T",
    series: "pod",
    name: "Pod 4500 Square Tandem",
    length: 4500,
    width: 2000,
    shape: "Square",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Out of Stock",
    priceLow: 8900,
    priceHigh: 14500,
    description: "Large pod platform approaching square-series capacity.",
  }),
  p({
    slug: "pod-5000-2000-tandem-dome",
    sku: "CM-POD-5000-T",
    series: "pod",
    name: "Pod 5000 Dome Tandem",
    length: 5000,
    width: 2000,
    shape: "Dome",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 9800,
    priceHigh: 16000,
    description: "Flagship pod length with dome styling.",
  }),
  p({
    slug: "airstream-3000-2200-700-stainless-single",
    sku: "CM-AS-3000",
    series: "airstream",
    name: "Airstream 3000 Stainless",
    length: 3000,
    width: 2200,
    shape: "700 Arc",
    material: "Stainless steel",
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 8500,
    priceHigh: 14000,
    description: "Premium stainless steel classic Airstream style food trailer.",
  }),
  p({
    slug: "airstream-4000-2200-700-stainless-tandem",
    sku: "CM-AS-4000",
    series: "airstream",
    name: "Airstream 4000 Food Trailer",
    length: 4000,
    width: 2200,
    shape: "700 Arc",
    material: "Stainless steel",
    axle: "Tandem Axle",
    stockStatus: "In Stock",
    priceLow: 8500,
    priceHigh: 15000,
    description: "Premium stainless steel classic Airstream style food trailer, 4000mm length.",
  }),
  p({
    slug: "airstream-4000-2200-500-paint-tandem",
    sku: "CM-AS-4000-P",
    series: "airstream",
    name: "Airstream 4000 Painted",
    length: 4000,
    width: 2200,
    shape: "500 Arc",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 7800,
    priceHigh: 13800,
    description: "Painted 500-arc Airstream body for full-wrap branding.",
  }),
  p({
    slug: "airstream-5000-2200-350-stainless-tandem",
    sku: "CM-AS-5000",
    series: "airstream",
    name: "Airstream 5000 Stainless",
    length: 5000,
    width: 2200,
    shape: "375 Arc",
    material: "Stainless steel",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 11200,
    priceHigh: 18500,
    description: "Longer 350-arc stainless unit for high-volume kitchens.",
  }),
  p({
    slug: "airstream-6000-2200-700-paint-tandem",
    sku: "CM-AS-6000",
    series: "airstream",
    name: "Airstream 6000 Painted",
    length: 6000,
    width: 2200,
    shape: "700 Arc",
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 12800,
    priceHigh: 21000,
    description: "Large 700-arc painted Airstream for restaurant-on-wheels concepts.",
  }),
  p({
    slug: "airstream-7000-2200-700-stainless-tandem",
    sku: "CM-AS-7000",
    series: "airstream",
    name: "Airstream 7000 Stainless",
    length: 7000,
    width: 2200,
    shape: "700 Arc",
    material: "Stainless steel",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 15500,
    priceHigh: 26000,
    description: "Maximum-length stainless Airstream platform.",
  }),
  p({
    slug: "square-2800-2200-paint-single",
    sku: "CM-SQ-2800",
    series: "square",
    name: "Square 2800",
    length: 2800,
    width: 2200,
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 6200,
    priceHigh: 10800,
    description: "Compact square body with painted exterior.",
  }),
  p({
    slug: "square-3500-2200-paint-single",
    sku: "CM-SQ-3500",
    series: "square",
    name: "Square 3500 Single",
    length: 3500,
    width: 2200,
    material: "Paint",
    axle: "Single Axle",
    stockStatus: "In Stock",
    priceLow: 7400,
    priceHigh: 12500,
    description: "Mid-size square trailer ready for wrap branding.",
  }),
  p({
    slug: "square-3500-2200-paint-tandem",
    sku: "CM-SQ-3500-T",
    series: "square",
    name: "Square 3500 Tandem",
    length: 3500,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 7900,
    priceHigh: 13200,
    description: "Same 3500 layout with tandem axle.",
  }),
  p({
    slug: "square-4500-2200-paint-tandem",
    sku: "CM-SQ-4500",
    series: "square",
    name: "Square 4500",
    length: 4500,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 9200,
    priceHigh: 15800,
    description: "Workhorse square kitchen for fast food concepts.",
  }),
  p({
    slug: "square-6000-2200-paint-tandem",
    sku: "CM-SQ-6000",
    series: "square",
    name: "Square 6000",
    length: 6000,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 11800,
    priceHigh: 19800,
    description: "Large square trailer with room for dual-line service.",
  }),
  p({
    slug: "square-7000-2200-paint-tandem",
    sku: "CM-SQ-7000",
    series: "square",
    name: "Square 7000",
    length: 7000,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 13500,
    priceHigh: 23000,
    description: "Maximum square-series length.",
  }),
  p({
    slug: "container-4500-2200-paint-tandem",
    sku: "CM-CT-4500",
    series: "container",
    name: "Container 4500",
    length: 4500,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 9800,
    priceHigh: 16500,
    description: "Container-inspired 4500mm trailer.",
  }),
  p({
    slug: "container-5000-2200-paint-tandem",
    sku: "CM-CT-5000",
    series: "container",
    name: "Container 5000",
    length: 5000,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "In Stock",
    priceLow: 10800,
    priceHigh: 17800,
    description: "Heavy-duty container trailer with industrial look.",
  }),
  p({
    slug: "container-5800-2200-paint-tandem",
    sku: "CM-CT-5800",
    series: "container",
    name: "Container 5800",
    length: 5800,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 12200,
    priceHigh: 19600,
    description: "Extended container body for commissary-style kitchens.",
  }),
  p({
    slug: "container-6000-2200-paint-tandem",
    sku: "CM-CT-6000",
    series: "container",
    name: "Container 6000",
    length: 6000,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    stockStatus: "Made to Order",
    priceLow: 13000,
    priceHigh: 21000,
    description: "Full 6m container trailer platform.",
  }),
  p({
    slug: "ny-3900-2200-1front-above-paint-tandem",
    sku: "CM-NY-3900",
    series: "capsule",
    name: "Capsule 3900 Front Glass",
    length: 3900,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    glassCount: "1, front",
    glassHeight: "Above counter",
    stockStatus: "Made to Order",
    priceLow: 8800,
    priceHigh: 14800,
    description: "Capsule trailer with a single front service window.",
  }),
  p({
    slug: "ny-4000-2200-2frontback-above-stainless-tandem",
    sku: "CM-NY-4000",
    series: "capsule",
    name: "Capsule 4000 Dual Glass Stainless",
    length: 4000,
    width: 2200,
    material: "Stainless steel",
    axle: "Tandem Axle",
    glassCount: "2, front and rear",
    glassHeight: "Above counter",
    stockStatus: "In Stock",
    priceLow: 10200,
    priceHigh: 16800,
    description: "Dual-window Capsule trailer in stainless — pass-through service.",
  }),
  p({
    slug: "ny-4500-2200-2frontback-below-paint-tandem",
    sku: "CM-NY-4500",
    series: "capsule",
    name: "Capsule 4500 Low Glass",
    length: 4500,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    glassCount: "2, front and rear",
    glassHeight: "Below counter",
    stockStatus: "Made to Order",
    priceLow: 11000,
    priceHigh: 17600,
    description: "Below-counter glass for display-forward concepts.",
  }),
  p({
    slug: "ny-5500-2200-1front-above-paint-tandem",
    sku: "CM-NY-5500",
    series: "capsule",
    name: "Capsule 5500 Front Glass",
    length: 5500,
    width: 2200,
    material: "Paint",
    axle: "Tandem Axle",
    glassCount: "1, front",
    glassHeight: "Above counter",
    stockStatus: "Made to Order",
    priceLow: 12500,
    priceHigh: 20500,
    description: "Long Capsule body with a single wide service opening.",
  }),
  p({
    slug: "others-exhibition-airstream-2024",
    sku: "CM-EX-AS-2024",
    series: "others",
    name: "Exhibition Airstream 2024",
    length: 5000,
    width: 2200,
    axle: "Tandem Axle",
    stockStatus: "Out of Stock",
    priceLow: 18000,
    priceHigh: 18000,
    description: "Show unit built for trade fairs — wrap-ready stainless body.",
    year: 2024,
    scene: "Canton Fair display trailer with interior LED lighting.",
  }),
  p({
    slug: "others-night-market-pod-2025",
    sku: "CM-EX-POD-2025",
    series: "others",
    name: "Night Market Pod 2025",
    length: 3200,
    width: 2000,
    axle: "Single Axle",
    stockStatus: "Made to Order",
    priceLow: 9200,
    priceHigh: 9200,
    description: "Special night-market lighting package on a pod chassis.",
    year: 2025,
    scene: "Custom LED canopy and fold-down serving shelf.",
  }),
  p({
    slug: "others-coffee-lab-square-2023",
    sku: "CM-EX-SQ-2023",
    series: "others",
    name: "Coffee Lab Square 2023",
    length: 4000,
    width: 2200,
    axle: "Tandem Axle",
    stockStatus: "Out of Stock",
    priceLow: 15000,
    priceHigh: 15000,
    description: "One-off espresso lab with water filtration loop.",
    year: 2023,
    scene: "Specialty coffee build with two-group machine bench.",
  }),
];

function applyStock(item: Product): Product {
  const override = (stockOverrides as Record<string, StockStatus>)[item.slug];
  return override ? { ...item, stockStatus: override } : item;
}

export function liveProducts() {
  return products.map(applyStock);
}

export function productsBySeries(series: SeriesKey) {
  return liveProducts()
    .filter((item) => item.series === series)
    .sort((a, b) => (series === "others" ? (b.year ?? 0) - (a.year ?? 0) : a.length - b.length));
}

export function inStockProducts() {
  return liveProducts()
    .filter((item) => item.stockStatus === "In Stock")
    .sort((a, b) => a.length - b.length);
}

export function getProduct(slug: string) {
  const item = products.find((entry) => entry.slug === slug);
  return item ? applyStock(item) : undefined;
}

export const filterOptions = {
  pod: {
    width: [1650, 2000],
    length: [2300, 2500, 2800, 2900, 3000, 3200, 3400, 3800, 3900, 4000, 4500, 5000],
    shape: ["Dome", "Square"],
    material: ["Paint"],
    axle: ["Single Axle", "Tandem Axle"],
  },
  airstream: {
    width: [2200],
    length: [2800, 2900, 3000, 3500, 3800, 3900, 4000, 4500, 5000, 5500, 5800, 6000, 6500, 7000],
    shape: ["375 Arc", "500 Arc", "700 Arc"],
    material: ["Stainless steel", "Paint"],
    axle: ["Single Axle", "Tandem Axle"],
  },
  square: {
    width: [2200],
    length: [2800, 2900, 3000, 3500, 3800, 3900, 4000, 4500, 5000, 5500, 5800, 6000, 6500, 7000],
    shape: ["Square"],
    material: ["Paint"],
    axle: ["Single Axle", "Tandem Axle"],
  },
  container: {
    width: [2200],
    length: [4000, 4500, 5000, 5500, 5800, 6000],
    shape: ["Square"],
    material: ["Paint"],
    axle: ["Single Axle", "Tandem Axle"],
  },
  capsule: {
    width: [2200],
    length: [3900, 4000, 4500, 5000, 5500],
    shape: ["375 Arc"],
    material: ["Paint", "Stainless steel"],
    axle: ["Single Axle", "Tandem Axle"],
  },
} as const;

export function catalogDimensionOptions(series?: string) {
  const key = series && series in filterOptions ? (series as keyof typeof filterOptions) : undefined;
  if (key) {
    return {
      length: [...filterOptions[key].length],
      width: [...filterOptions[key].width],
      height: [...bodyHeightOptions],
    };
  }
  const lengths = new Set<number>();
  const widths = new Set<number>();
  for (const options of Object.values(filterOptions)) {
    for (const value of options.length) lengths.add(value);
    for (const value of options.width) widths.add(value);
  }
  return {
    length: [...lengths].sort((a, b) => a - b),
    width: [...widths].sort((a, b) => a - b),
    height: [...bodyHeightOptions],
  };
}

export function catalogMaterialOptions(series?: string) {
  const key = series && series in filterOptions ? (series as keyof typeof filterOptions) : undefined;
  if (key && "material" in filterOptions[key] && Array.isArray(filterOptions[key].material)) {
    return [...filterOptions[key].material];
  }
  const materials = new Set<string>();
  for (const options of Object.values(filterOptions)) {
    if ("material" in options && Array.isArray(options.material)) {
      for (const value of options.material) materials.add(value);
    }
  }
  return [...materials];
}

export function catalogShapeOptions(series?: string) {
  const key = series && series in filterOptions ? (series as keyof typeof filterOptions) : undefined;
  if (key && "shape" in filterOptions[key] && Array.isArray(filterOptions[key].shape)) {
    return [...filterOptions[key].shape];
  }
  const shapes = new Set<string>();
  for (const options of Object.values(filterOptions)) {
    if ("shape" in options && Array.isArray(options.shape)) {
      for (const value of options.shape) shapes.add(value);
    }
  }
  return [...shapes];
}

