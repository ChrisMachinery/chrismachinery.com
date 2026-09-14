type SpecProduct = {
  series: string;
  length: number;
  width: number;
  axle: string;
  height?: number;
  overallHeight?: number;
  weight?: number;
  loadCapacity?: number;
};

export type ProductSpec = {
  height: number;
  overallHeight: number;
  weight: number;
  loadCapacity: number;
};

function axleKey(axle: string) {
  return String(axle).toLowerCase().includes("tandem") ? "tandem" : "single";
}

export function productSpecKey(series: string, length: number, width: number, axle: string) {
  return `${series}|${length}|${width}|${axleKey(axle)}`;
}

/** Factory specs from product-import.xlsx (body height / overall height / weight / load). */
export const PRODUCT_SPECS_BY_SIZE: Record<string, ProductSpec> = {
  "pod|2300|1650|single": { height: 2000, overallHeight: 2500, weight: 540, loadCapacity: 750 },
  "pod|2800|1650|single": { height: 2000, overallHeight: 2500, weight: 650, loadCapacity: 750 },
  "pod|3000|1650|single": { height: 2000, overallHeight: 2500, weight: 850, loadCapacity: 1250 },
  "pod|3400|1650|single": { height: 2000, overallHeight: 2500, weight: 900, loadCapacity: 1250 },
  "pod|2300|2000|single": { height: 2000, overallHeight: 2500, weight: 800, loadCapacity: 1250 },
  "pod|2500|2000|single": { height: 2000, overallHeight: 2500, weight: 850, loadCapacity: 1250 },
  "pod|2800|2000|single": { height: 2000, overallHeight: 2500, weight: 880, loadCapacity: 1250 },
  "pod|2900|2000|single": { height: 2000, overallHeight: 2500, weight: 900, loadCapacity: 1250 },
  "pod|3000|2000|single": { height: 2000, overallHeight: 2500, weight: 920, loadCapacity: 1500 },
  "pod|3200|2000|single": { height: 2000, overallHeight: 2500, weight: 950, loadCapacity: 1500 },
  "pod|3400|2000|single": { height: 2000, overallHeight: 2500, weight: 1000, loadCapacity: 1500 },
  "pod|3000|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1000, loadCapacity: 1500 },
  "pod|3200|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1030, loadCapacity: 1500 },
  "pod|3400|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1150, loadCapacity: 2500 },
  "pod|3800|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1150, loadCapacity: 2500 },
  "pod|3900|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1200, loadCapacity: 2500 },
  "pod|4000|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1250, loadCapacity: 2500 },
  "pod|4500|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1350, loadCapacity: 2500 },
  "pod|5000|2000|tandem": { height: 2000, overallHeight: 2500, weight: 1450, loadCapacity: 2500 },
  "airstream|2800|2200|single": { height: 2100, overallHeight: 2600, weight: 980, loadCapacity: 1600 },
  "airstream|2900|2200|single": { height: 2100, overallHeight: 2600, weight: 1050, loadCapacity: 1600 },
  "airstream|3000|2200|single": { height: 2100, overallHeight: 2600, weight: 1250, loadCapacity: 1600 },
  "airstream|3500|2200|single": { height: 2100, overallHeight: 2600, weight: 1360, loadCapacity: 1600 },
  "airstream|3000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1300, loadCapacity: 2500 },
  "airstream|3500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1410, loadCapacity: 2500 },
  "airstream|3800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1480, loadCapacity: 2500 },
  "airstream|3900|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1510, loadCapacity: 2500 },
  "airstream|4000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1575, loadCapacity: 2500 },
  "airstream|4500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1735, loadCapacity: 2500 },
  "airstream|5000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1850, loadCapacity: 3200 },
  "airstream|5500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2110, loadCapacity: 3200 },
  "airstream|5800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2030, loadCapacity: 3200 },
  "airstream|6000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2080, loadCapacity: 3200 },
  "airstream|6500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2250, loadCapacity: 3200 },
  "airstream|7000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2380, loadCapacity: 3200 },
  "square|2800|2200|single": { height: 2100, overallHeight: 2600, weight: 890, loadCapacity: 1250 },
  "square|2900|2200|single": { height: 2100, overallHeight: 2600, weight: 950, loadCapacity: 1250 },
  "square|3000|2200|single": { height: 2100, overallHeight: 2600, weight: 1100, loadCapacity: 1600 },
  "square|3500|2200|single": { height: 2100, overallHeight: 2600, weight: 1300, loadCapacity: 1600 },
  "square|2800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 950, loadCapacity: 1500 },
  "square|2900|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1100, loadCapacity: 1500 },
  "square|3000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1150, loadCapacity: 1500 },
  "square|3500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1345, loadCapacity: 2500 },
  "square|3800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1395, loadCapacity: 2500 },
  "square|3900|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1455, loadCapacity: 2500 },
  "square|4000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1500, loadCapacity: 2500 },
  "square|4500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1655, loadCapacity: 2500 },
  "square|5000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1800, loadCapacity: 3200 },
  "square|5500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1980, loadCapacity: 3200 },
  "square|5800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2050, loadCapacity: 3200 },
  "square|6000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2120, loadCapacity: 3200 },
  "square|6500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2250, loadCapacity: 3200 },
  "square|7000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2420, loadCapacity: 3200 },
  "capsule|3900|2100|tandem": { height: 2100, overallHeight: 2600, weight: 1630, loadCapacity: 2500 },
  "capsule|4000|2100|tandem": { height: 2100, overallHeight: 2600, weight: 1750, loadCapacity: 2500 },
  "capsule|4500|2100|tandem": { height: 2100, overallHeight: 2600, weight: 1900, loadCapacity: 2500 },
  "capsule|5000|2100|tandem": { height: 2100, overallHeight: 2600, weight: 2150, loadCapacity: 3200 },
  "capsule|5500|2100|tandem": { height: 2100, overallHeight: 2600, weight: 2300, loadCapacity: 3200 },
  "container|4000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1800, loadCapacity: 2500 },
  "container|4500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 1980, loadCapacity: 2500 },
  "container|5000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2050, loadCapacity: 3200 },
  "container|5500|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2120, loadCapacity: 3200 },
  "container|5800|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2250, loadCapacity: 3200 },
  "container|6000|2200|tandem": { height: 2100, overallHeight: 2600, weight: 2420, loadCapacity: 3200 },
};

export function lookupProductSpec(product: SpecProduct) {
  const direct = PRODUCT_SPECS_BY_SIZE[productSpecKey(product.series, product.length, product.width, product.axle)];
  if (direct) return direct;
  if (product.series === "capsule" && product.width === 2200) {
    return PRODUCT_SPECS_BY_SIZE[productSpecKey("capsule", product.length, 2100, product.axle)];
  }
  return undefined;
}

export function withFactorySpecs<T extends SpecProduct>(product: T): T {
  const spec = lookupProductSpec(product);
  if (!spec) return product;
  return {
    ...product,
    height: product.height || spec.height,
    overallHeight: product.overallHeight || spec.overallHeight,
    weight: product.weight || spec.weight,
    loadCapacity: product.loadCapacity || spec.loadCapacity,
  };
}
