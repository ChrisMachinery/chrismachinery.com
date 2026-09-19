const SPEC_MAP: Record<string, string> = {
  "Single Axle": "specs.singleAxle",
  "Tandem Axle": "specs.tandemAxle",
  Dome: "specs.dome",
  Square: "specs.square",
  Paint: "specs.paint",
  Stainless: "specs.stainless",
  "Stainless steel": "specs.stainless",
  "375 Arc": "specs.arc375",
  "500 Arc": "specs.arc500",
  "700 Arc": "specs.arc700",
  "In Stock": "specs.inStock",
  "Out of Stock": "specs.outOfStock",
  "Made to Order": "specs.madeToOrder",
};

type Translate = (key: string) => string;

export function specLabel(t: Translate, value: string) {
  const key = SPEC_MAP[value.trim()];
  return key ? t(key) : value;
}

export function specList(t: Translate, values: string[], sep = " / ") {
  return values.map((value) => specLabel(t, value)).join(sep);
}
