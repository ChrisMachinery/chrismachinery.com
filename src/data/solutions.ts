export type Solution = {
  _id?: string;
  slug: string;
  name: string;
  recommended: string[];
  equipment: string[];
  equipmentIds?: string[];
  advice: string;
  imageUrl?: string;
};

export const solutions: Solution[] = [
  {
    slug: "coffee-shop",
    name: "Coffee Shop",
    recommended: ["pod-3000-2000-single-dome", "square-3500-2200-paint-single"],
    equipment: ["espresso", "sink-double", "water-tank", "electrical", "counter"],
    advice: "Add brand logo wrap and a dual-group espresso layout with under-counter fridge.",
  },
  {
    slug: "fast-food",
    name: "Fast Food",
    recommended: ["square-4500-2200-paint-tandem", "container-5000-2200-paint-tandem"],
    equipment: ["fryer", "griddle", "hood", "prep", "electrical"],
    advice: "Prioritize extraction and grease management; specify tandem axle for equipment weight.",
  },
  {
    slug: "ice-cream",
    name: "Ice Cream",
    recommended: ["pod-2800-2000-single-dome", "ny-3900-2200-1front-above-paint-tandem"],
    equipment: ["freezer", "display", "sink-double", "counter"],
    advice: "Use below-counter glass if you want product display toward the queue.",
  },
  {
    slug: "mobile-bar",
    name: "Mobile Bar",
    recommended: ["airstream-4000-2200-700-stainless-tandem", "airstream-4000-2200-500-paint-tandem"],
    equipment: ["counter", "ice-bin", "sink-double", "electrical", "led"],
    advice: "Stainless Airstream bodies photograph well for nightlife branding.",
  },
  {
    slug: "night-market",
    name: "Night Market",
    recommended: ["pod-3400-2000-single-square", "square-2800-2200-paint-single"],
    equipment: ["griddle", "prep", "electrical", "counter"],
    advice: "Keep the unit towable and specify extra exterior LED for night service.",
  },
];
