export type Post = {
  _id?: string;
  slug: string;
  category: "Buying Guide" | "Industry News" | "Case Study";
  title: string;
  date: string;
  author: string;
  excerpt: string;
  body: string;
  tags?: string[];
  coverUrl?: string;
  bodyBlocks?: unknown[];
};

export const posts: Post[] = [
  {
    slug: "how-to-choose-food-trailer-size",
    category: "Buying Guide",
    title: "How to Choose Food Trailer Size",
    date: "2026-06-12",
    author: "Chris Machinery",
    excerpt: "Length, axle count, and kitchen workflow — what actually matters when you order from the factory.",
    body: `## Start with the menu\n\nYour menu decides equipment. Equipment decides length.\n\n- Coffee carts often fit in 2300–3000mm pods.\n- Fryer-heavy menus usually need 4500mm+ square or container bodies.\n\n## Axles are a payload choice\n\nWe label **Single Axle** and **Tandem Axle** on each card. Same footprint can ship in both versions.`,
  },
  {
    slug: "hot-dip-galvanized-chassis",
    category: "Industry News",
    title: "Why We Use Hot-Dip Galvanized Chassis",
    date: "2026-04-02",
    author: "Engineering Team",
    excerpt: "Coastal humidity and winter roads punish painted frames. Galvanizing is the quieter specification.",
    body: `## Factory standard\n\nEvery Chris Machinery trailer ships on a hot-dip galvanized chassis.\n\n## What buyers should ask\n\nAsk any supplier whether the **frame** is galvanized — not only the body panels.`,
  },
  {
    slug: "uae-coffee-trailer-case",
    category: "Case Study",
    title: "Case Study: Coffee Trailer in the UAE",
    date: "2026-01-18",
    author: "Export Team",
    excerpt: "A 3000mm pod specified for desert heat, wrap branding, and 24-hour quote-to-drawing turnaround.",
    body: `## Brief\n\nA Dubai operator needed a towable espresso unit with strong A/C prep and wrap-ready paint.\n\n## Build\n\nWe shipped a **Pod 3000 Dome** with extra insulation and a generator shelf.`,
  },
  {
    slug: "ce-certification-for-export",
    category: "Industry News",
    title: "CE Documentation for European Buyers",
    date: "2025-11-09",
    author: "Compliance",
    excerpt: "What we include in the export pack so your local inspector is not starting from zero.",
    body: `## Documents\n\n- CE declaration pack\n- Electrical schematic\n- Chassis photos\n\nContact sales if your country needs additional plates.`,
  },
];
