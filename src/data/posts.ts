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
    body: `## Brief

A Dubai operator needed a towable espresso unit for a promenade pitch: desert heat, wrap-ready paint, and a drawing-to-quote turnaround measured in hours, not weeks. The menu was espresso, a small cold line, and pastry — one barista on a short shift, two at peak. The stall was a night-and-day coffee hatch, not a fryer kitchen.

This is a Case Study: country, menu, the unit we built, and what we would spec again. It lives in the Blog, next to Buying Guides. It is not a Solutions chapter (those are coffee / fast food / ice cream menus) and it is not a product page.

## Site and climate

Coastal Gulf heat punishes a thin wall and a lazy electrical plan. The operator asked for A/C prep, extra insulation, and a generator shelf so the machine would not die when shore power was ugly. Wrap-ready paint mattered more than stainless: the brand was the wrap, not the metal.

Tow had to stay honest. This was not a 5 m tandem fryer. A short Pod, Single Axle, was the pitch.

## The unit

We shipped a **Pod 3000**, 2000 mm wide, Single Axle, Dome roof, paint. That length is already in the coffee/dessert band on the Pod series page (2300–3000 mm). 2000 mm width gave a second person room at peak without jumping to a 2200 mm Square. Dome was the classic coffee-pod face; the wrap sat on paint.

Stainless was never in the Pod filter. If the brand had wanted metal show, the conversation would have moved to Airstream. It did not.

Kitchen: dual-group espresso, grinder, under-counter fridge, double sink, water tanks, electrical package, front counter. Generator shelf and insulation were Customize, not a second series. Window side was drawn for the promenade queue.

## Why not Square or Capsule

A 2200 mm Square would have entered a tighter wrap wall and a café box look. The stall did not need 2.2 m, and the brand wanted a pod silhouette. Capsule would have given a 375 glass face — useful for ice cream display, not for this espresso wrap. Fast-food Square/Container would have been a hooded mistake.

The Coffee Shop solution article is the menu chapter that matches this job. The Pod series guide is the millimetre chapter. This Case Study is the proof that a 3000 mm Pod coffee unit left the factory for the UAE.

## What we would spec again

Same length band. Same 2000 mm if two staff at peak. Same Single Axle unless the operator adds a heavy generator and extra water. Same paint wrap. More LED if the promenade is dark. Confirm power on day one of the quote — Gulf sites lie about shore.

## How to use this page

If you are quoting a similar coffee promenade, open the Coffee Shop solution (/solutions/coffee-shop), then a Pod around 3000 mm, then Get Quote. If your stall is 1650 mm, step down width on the Pod filter; do not copy 2000 mm out of habit. If your menu is a fryer, this case does not apply — read Fast Food.

Prices for this unit were in the original inquiry. We do not republish them here.`,
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
