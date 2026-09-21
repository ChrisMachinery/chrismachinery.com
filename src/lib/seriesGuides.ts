import { POD_SERIES_GUIDE_DEFAULTS } from "@/lib/podSeriesGuide";

export type GuideSeries = "pod" | "airstream" | "square" | "container" | "capsule";

export type SeriesGuideSizeRow = {
  scene: string;
  length: string;
  width: string;
  axle: string;
  shape: string;
  material: string;
  note: string;
  exampleLabel: string;
  exampleHref: string;
  imageLabel: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SeriesGuideDefaults = {
  introTitle: string;
  intro: string;
  shapeBody: string;
  sizeTitle: string;
  sizeNote: string;
  sizeRows: SeriesGuideSizeRow[];
  kitchenTitle: string;
  kitchenBody: string;
  kitchenLinkLabel: string;
  kitchenLinkHref: string;
  quoteLabel: string;
  quoteHref: string;
  faqTitle: string;
  faq: { question: string; answer: string }[];
  tocCompare: string;
  tocSize: string;
  tocKitchen: string;
  tocFaq: string;
  tocModels: string;
  compareSectionId: string;
  pdpNote: string;
  metaTitle: string;
  metaDescription: string;
};

const TOC_BAR = {
  tocSize: "Sizing Guide",
  tocKitchen: "Specs & Layout",
  tocFaq: "FAQ",
  tocModels: "Models",
} as const;

function bands(rows: Omit<SeriesGuideSizeRow, "exampleHref" | "imageUrl" | "imageAlt">[]): SeriesGuideSizeRow[] {
  return rows.map((row) => ({ ...row, exampleHref: "" }));
}

const airstream: SeriesGuideDefaults = {
  introTitle: "How to choose an Airstream",
  intro: `Airstream is the streamlined family: body length 2800, 2900, 3000, 3500, 3800, 3900, 4000, 4500, 5000, 5500, 5800, 6000, 6500 or 7000 mm; width 2200 mm; window arcs 375, 500 or 700; stainless steel or paint; Single Axle or Tandem Axle. Those numbers are already in the filters at the bottom of this page.

Use this chapter to pick an arc, a length band, a finish, and an axle. Each product card still carries the exact size of that unit and the quote path. Dome versus Square is a Pod choice, not an Airstream filter. Prices stay in the inquiry.`,
  shapeBody: `375, 500 and 700 are window arcs on the same Airstream length list. They change the side profile, not the millimetres.

375 is the tighter curve: a more compact look, usually at home on shorter bodies. 500 is the mid curve and the default Airstream face most buyers compare first. 700 is the fuller curve: a longer, more open window line that suits 5 m+ bodies. Arc is appearance, not a price tier. Stainless versus paint is the finish choice. Filter Shape after you pick a length band.`,
  sizeTitle: "Size band × typical menu",
  sizeNote: `The three cards group lengths already in the Airstream filter. Width is 2200 mm on every Airstream. Short café units sit at 2800–3500 mm; mid commercial kitchens at 3800–5000 mm; long premium lines at 5500–7000 mm. After you pick a card, filter Length, then Arc and Material. Example links are placeholders until you paste a product URL such as /products/airstream/your-slug.`,
  pdpNote: "What 375 / 500 / 700 window arcs mean. See the series guide.",
  sizeRows: bands([
    {
      scene: "Café / dessert",
      length: "2800 / 2900 / 3000 / 3500 mm",
      width: "2200 mm",
      axle: "Single Axle",
      shape: "375 or 500 Arc",
      material: "Stainless steel or Paint",
      note: "Coffee, gelato, or a compact premium face. 375 keeps the body tight; 500 is the usual Airstream look. Single Axle is typical at this length.",
      exampleLabel: "Example model (short Airstream)",
      imageLabel:
        "Airstream 短车 · 长 2800–3500 · 宽 2200 · 375/500 · SS/Paint · Single · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Street food / mid kitchen",
      length: "3800 / 3900 / 4000 / 4500 / 5000 mm",
      width: "2200 mm",
      axle: "Single Axle or Tandem Axle",
      shape: "500 Arc",
      material: "Stainless steel or Paint",
      note: "Griddle and fryer space with the default 500 arc. Step to Tandem when oil, gas, and water add payload. Stainless if the trailer itself is the brand; paint if you wrap the body.",
      exampleLabel: "Example model (mid Airstream)",
      imageLabel:
        "Airstream 中长 · 长 3800–5000 · 宽 2200 · 500 · SS/Paint · Single/Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Long / premium line",
      length: "5500 / 5800 / 6000 / 6500 / 7000 mm",
      width: "2200 mm",
      axle: "Tandem Axle",
      shape: "500 or 700 Arc",
      material: "Stainless steel or Paint",
      note: "Full kitchen and a more open side. 700 reads longer and more open; 500 stays the classic mid curve on a long body. Tandem Axle is the usual axle here.",
      exampleLabel: "Example model (long Airstream)",
      imageLabel:
        "Airstream 长车 · 长 5500–7000 · 宽 2200 · 500/700 · SS/Paint · Tandem · 4:3 · 1200×900 JPG",
    },
  ]),
  kitchenTitle: "Arc, finish, and kitchen workflow",
  kitchenBody: `Width is 2200 mm on every Airstream — crew space does not change with length. Axle follows weight: Single Axle on most 2800–3500 mm café units; Tandem Axle on 5500–7000 mm and on mid lengths when the kitchen is fryer-heavy.

Stainless steel is the show finish; paint is the wrap finish. Neither one changes the length list. Window side, equipment list, and interior drawings belong on Customize. Included items for every Airstream stay on the product page.`,
  kitchenLinkLabel: "Customize kitchen layout",
  kitchenLinkHref: "",
  quoteLabel: "Get Quote",
  quoteHref: "/contact?from=/products/airstream",
  faqTitle: "Airstream buying FAQ",
  faq: [
    {
      question: "Do 375 / 500 / 700 change the body length?",
      answer:
        "No. The arcs share the same Airstream length and 2200 mm width. A 4000 mm 375 and a 4000 mm 500 are the same working length. Filter Shape after the band.",
    },
    {
      question: "When should I pick 700?",
      answer:
        "700 is the fuller window curve. It suits longer bodies (about 5 m+) when you want a more open side. It is not a higher price tier in the catalog — quote still goes through Get Quote.",
    },
    {
      question: "Stainless or paint?",
      answer:
        "Both are Airstream filters. Stainless if the metal is the brand. Paint if you need a full wrap. Pod is paint-only; do not look for stainless there.",
    },
    {
      question: "When is Tandem Axle required?",
      answer:
        "Use Tandem on 5500–7000 mm units and whenever payload is high. Short café Airstreams are usually Single Axle.",
    },
    {
      question: "Where do I get a price?",
      answer:
        "This page chooses the class. Open a model in the catalog, then Get Quote. We do not publish prices on the series guide.",
    },
  ],
  tocCompare: "375 / 500 / 700",
  ...TOC_BAR,
  compareSectionId: "arc-guide",
  metaTitle: "How to Choose an Airstream Food Trailer | Chris Machinery",
  metaDescription:
    "Choose Airstream length 2800–7000 mm, 375/500/700 window arc, stainless or paint, and Single or Tandem axle. Then filter the catalog and get a quote.",
};

const square: SeriesGuideDefaults = {
  introTitle: "How to choose a Square trailer",
  intro: `Square is the boxy painted family for high-volume kitchens: body length 2800, 2900, 3000, 3500, 3800, 3900, 4000, 4500, 5000, 5500, 5800, 6000, 6500 or 7000 mm; width 2200 mm; Square body; paint; Single Axle or Tandem Axle. Those numbers are already in the filters at the bottom of this page.

Use this chapter to pick a length band and axle. The body shape does not split into Dome or 375/500/700 — Square is one silhouette. Container is the heavier, longer-hour cousin. Prices stay in the inquiry.`,
  shapeBody: `Square is a painted box with efficient walls and a straight service face. It is not a Pod Square-roof (that is still a Pod) and it is not a Container.

Pick Square when you need a high-volume line, easy wall wraps, and a rectangular kitchen. Pick Container when the job is heavier, longer hours, and a more rugged shell. Pick Airstream when the street face should be a streamliner. Length and axle still come from the Square filter — 2200 mm wide, paint only.`,
  sizeTitle: "Size band × typical menu",
  sizeNote: `The three cards group lengths already in the Square filter. Width is 2200 mm. Compact lines sit at 2800–3500 mm; high-volume service at 3800–5000 mm; full production at 5500–7000 mm. After you pick a card, filter Length and Axle. Example links are placeholders until you paste /products/square/your-slug.`,
  pdpNote: "Square box vs Pod square roof vs Container. See the series guide.",
  sizeRows: bands([
    {
      scene: "Compact / café box",
      length: "2800 / 2900 / 3000 / 3500 mm",
      width: "2200 mm",
      axle: "Single Axle",
      shape: "Square",
      material: "Paint",
      note: "A straight painted box for coffee or light snacks when you want more wall than a Pod. Single Axle is typical.",
      exampleLabel: "Example model (compact Square)",
      imageLabel:
        "Square 短车 · 长 2800–3500 · 宽 2200 · Square · Paint · Single · 4:3 · 1200×900 JPG",
    },
    {
      scene: "High-volume service",
      length: "3800 / 3900 / 4000 / 4500 / 5000 mm",
      width: "2200 mm",
      axle: "Single Axle or Tandem Axle",
      shape: "Square",
      material: "Paint",
      note: "The usual Square working length: fryer line, two-window service, paint wrap. Move to Tandem when payload rises.",
      exampleLabel: "Example model (mid Square)",
      imageLabel:
        "Square 中长 · 长 3800–5000 · 宽 2200 · Square · Paint · Single/Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Full production line",
      length: "5500 / 5800 / 6000 / 6500 / 7000 mm",
      width: "2200 mm",
      axle: "Tandem Axle",
      shape: "Square",
      material: "Paint",
      note: "Longest Square bodies for a full kitchen. Still Square, not Container. If the shell must feel like a shipping box for long hours, compare Container on its own page.",
      exampleLabel: "Example model (long Square)",
      imageLabel:
        "Square 长车 · 长 5500–7000 · 宽 2200 · Square · Paint · Tandem · 4:3 · 1200×900 JPG",
    },
  ]),
  kitchenTitle: "Layout, axle, and workflow",
  kitchenBody: `Width is 2200 mm. The box walls make a rectangular kitchen: equipment along the service side, prep along the back. Single Axle covers most 2800–3500 mm units. Tandem Axle is the usual choice at 5500–7000 mm and on mid lengths with a heavy fry line.

Paint is the only Square finish in the catalog. Window count and equipment lists belong on Customize. Product pages list what is included on every Square.`,
  kitchenLinkLabel: "Customize kitchen layout",
  kitchenLinkHref: "",
  quoteLabel: "Get Quote",
  quoteHref: "/contact?from=/products/square",
  faqTitle: "Square buying FAQ",
  faq: [
    {
      question: "Is Square the same as a Pod with a square roof?",
      answer:
        "No. Pod Square is a roof option on the compact Pod family (1650/2000 mm). Square series is a 2200 mm box trailer with its own length list.",
    },
    {
      question: "Square or Container?",
      answer:
        "Square for a painted high-volume kitchen and wrap-friendly walls. Container for a more rugged shell and long-hour work. Lengths overlap in the middle; the series is the body type.",
    },
    {
      question: "Is stainless available?",
      answer:
        "Not in the Square filter. Paint only. Stainless is an Airstream and Capsule option.",
    },
    {
      question: "When is Tandem Axle the right choice?",
      answer:
        "On 5500–7000 mm Squares and whenever the kitchen payload is high. Compact café boxes are usually Single Axle.",
    },
    {
      question: "Where do I get a price?",
      answer:
        "This page chooses the class. Open a model in the catalog, then Get Quote.",
    },
  ],
  tocCompare: "Why Square",
  ...TOC_BAR,
  compareSectionId: "series-compare",
  metaTitle: "How to Choose a Square Food Trailer | Chris Machinery",
  metaDescription:
    "Choose Square length 2800–7000 mm, 2200 mm width, paint body, and Single or Tandem axle. Then filter the catalog and get a quote.",
};

const container: SeriesGuideDefaults = {
  introTitle: "How to choose a Container trailer",
  intro: `Container is the rugged, long-hour family: body length 4000, 4500, 5000, 5500, 5800 or 6000 mm; width 2200 mm; Square body; paint; Single Axle or Tandem Axle. Those numbers are already in the filters at the bottom of this page.

Use this chapter to pick a length band and axle. Container is not a shipping-container house conversion and it is not the Square series — it is a factory food trailer with a container-inspired shell. Prices stay in the inquiry.`,
  shapeBody: `The Container silhouette is a tough painted box built for heavy-duty service. Shape in the filter is Square — there is no Dome and no 375/500/700 arc.

Pick Container when hours are long, the kitchen is heavy, and the street face should look industrial. Pick Square when you want the same 2200 mm width with a lighter high-volume box and a longer length list up to 7000 mm. Pick Airstream when the face should be streamlined. Do not treat Container as a cheaper Square; they are different series.`,
  sizeTitle: "Size band × typical menu",
  sizeNote: `The three cards group lengths already in the Container filter (4000–6000 mm). Width is 2200 mm. After you pick a card, filter Length and Axle. Example links are placeholders until you paste /products/container/your-slug.`,
  pdpNote: "Container vs Square. See the series guide.",
  sizeRows: bands([
    {
      scene: "Entry heavy-duty",
      length: "4000 / 4500 mm",
      width: "2200 mm",
      axle: "Single Axle or Tandem Axle",
      shape: "Square",
      material: "Paint",
      note: "Shortest Container bodies. Still a 2200 mm industrial box, not a Pod. Tandem if the fryer line is heavy.",
      exampleLabel: "Example model (short Container)",
      imageLabel:
        "Container 短车 · 长 4000/4500 · 宽 2200 · Square · Paint · Single/Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "All-day service",
      length: "5000 / 5500 mm",
      width: "2200 mm",
      axle: "Tandem Axle",
      shape: "Square",
      material: "Paint",
      note: "The usual Container working length for long hours and a full fry or grill line. Tandem Axle is the typical axle.",
      exampleLabel: "Example model (mid Container)",
      imageLabel:
        "Container 中长 · 长 5000/5500 · 宽 2200 · Square · Paint · Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Longest Container",
      length: "5800 / 6000 mm",
      width: "2200 mm",
      axle: "Tandem Axle",
      shape: "Square",
      material: "Paint",
      note: "Longest bodies in this series. If you need 6500 or 7000 mm, that length lives on Square, not Container.",
      exampleLabel: "Example model (long Container)",
      imageLabel:
        "Container 长车 · 长 5800/6000 · 宽 2200 · Square · Paint · Tandem · 4:3 · 1200×900 JPG",
    },
  ]),
  kitchenTitle: "Duty cycle, axle, and workflow",
  kitchenBody: `Container kitchens are laid out for long shifts: heavier equipment, tougher shell, 2200 mm width. Single Axle can appear on 4000–4500 mm units; Tandem Axle is the usual choice from 5000 mm up.

Paint is the only Container finish in the catalog. Equipment lists belong on Customize. Product pages list series included items.`,
  kitchenLinkLabel: "Customize kitchen layout",
  kitchenLinkHref: "",
  quoteLabel: "Get Quote",
  quoteHref: "/contact?from=/products/container",
  faqTitle: "Container buying FAQ",
  faq: [
    {
      question: "Is this a real shipping container?",
      answer:
        "No. It is a factory food trailer with a container-inspired painted body on a galvanized chassis. Lengths are 4000–6000 mm in the current filter.",
    },
    {
      question: "Container or Square?",
      answer:
        "Container for a rugged long-hour shell and a 4000–6000 mm list. Square for a wrap-friendly high-volume box that also goes to 6500–7000 mm.",
    },
    {
      question: "Why is there no 7000 mm Container?",
      answer:
        "The Container filter stops at 6000 mm. Longer painted boxes are Square series. Do not invent a Container length that is not in the filter.",
    },
    {
      question: "When is Tandem Axle the right choice?",
      answer:
        "On 5000–6000 mm units and whenever the kitchen is heavy. Some 4000–4500 mm units can stay Single Axle.",
    },
    {
      question: "Where do I get a price?",
      answer:
        "This page chooses the class. Open a model in the catalog, then Get Quote.",
    },
  ],
  tocCompare: "Why Container",
  ...TOC_BAR,
  compareSectionId: "series-compare",
  metaTitle: "How to Choose a Container Food Trailer | Chris Machinery",
  metaDescription:
    "Choose Container length 4000–6000 mm, 2200 mm width, paint body, and Single or Tandem axle. Then filter the catalog and get a quote.",
};

const capsule: SeriesGuideDefaults = {
  introTitle: "How to choose a Capsule trailer",
  intro: `Capsule is the glass-window street family: body length 3900, 4000, 4500, 5000 or 5500 mm; width 2200 mm; 375 Arc; paint or stainless steel; Single Axle or Tandem Axle. Those numbers are already in the filters at the bottom of this page.

Use this chapter to pick a length band, a finish, and an axle. Capsule is not an Airstream with more arcs — the Capsule filter is 375 Arc only. Prices stay in the inquiry.`,
  shapeBody: `Capsule uses a 375 window arc and a glass service face for street and night-market display. Airstream offers 375, 500 and 700 on a longer length list. If you need 500 or 700, or bodies longer than 5500 mm, you are choosing Airstream, not Capsule.

Paint versus stainless is the Capsule finish split, same idea as Airstream. Width is 2200 mm. Filter Material after the length band. Glass layout details belong on Customize, not in a second shape chip.`,
  sizeTitle: "Size band × typical menu",
  sizeNote: `The three cards group lengths already in the Capsule filter (3900–5500 mm). Width is 2200 mm. Shape is 375 Arc on every Capsule. After you pick a card, filter Length, Material, and Axle. Example links are placeholders until you paste /products/capsule/your-slug.`,
  pdpNote: "Capsule vs Airstream. See the series guide.",
  sizeRows: bands([
    {
      scene: "Street / night-market",
      length: "3900 / 4000 mm",
      width: "2200 mm",
      axle: "Single Axle",
      shape: "375 Arc",
      material: "Paint or Stainless steel",
      note: "Shortest Capsule bodies with a glass service face. 375 Arc only. Single Axle is typical.",
      exampleLabel: "Example model (short Capsule)",
      imageLabel:
        "Capsule 短车 · 长 3900/4000 · 宽 2200 · 375 · Paint/SS · Single · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Full street kitchen",
      length: "4500 / 5000 mm",
      width: "2200 mm",
      axle: "Single Axle or Tandem Axle",
      shape: "375 Arc",
      material: "Paint or Stainless steel",
      note: "The usual Capsule working length. Step to Tandem when equipment payload rises. Stainless if the metal should show; paint if you wrap.",
      exampleLabel: "Example model (mid Capsule)",
      imageLabel:
        "Capsule 中长 · 长 4500/5000 · 宽 2200 · 375 · Paint/SS · Single/Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Longest Capsule",
      length: "5500 mm",
      width: "2200 mm",
      axle: "Tandem Axle",
      shape: "375 Arc",
      material: "Paint or Stainless steel",
      note: "Longest body in this series. If you need 5800–7000 mm or a 500/700 arc, go to Airstream.",
      exampleLabel: "Example model (long Capsule)",
      imageLabel:
        "Capsule 长车 · 长 5500 · 宽 2200 · 375 · Paint/SS · Tandem · 4:3 · 1200×900 JPG",
    },
  ]),
  kitchenTitle: "Glass face, finish, and workflow",
  kitchenBody: `The Capsule kitchen sits behind a glass service window on a 2200 mm body. 375 Arc is fixed in the filter. Stainless versus paint is the finish. Single Axle covers most 3900–4000 mm units; Tandem Axle is the usual choice at 5500 mm.

Window configuration is a custom drawing. Use Customize for that. Product pages list what is included on every Capsule.`,
  kitchenLinkLabel: "Customize kitchen layout",
  kitchenLinkHref: "",
  quoteLabel: "Get Quote",
  quoteHref: "/contact?from=/products/capsule",
  faqTitle: "Capsule buying FAQ",
  faq: [
    {
      question: "Can I get 500 or 700 arc on a Capsule?",
      answer:
        "Not in the Capsule filter. Capsule is 375 Arc only. 500 and 700 live on Airstream.",
    },
    {
      question: "Capsule or Airstream?",
      answer:
        "Capsule for a glass-forward street unit on 3900–5500 mm. Airstream for 375/500/700 arcs and lengths up to 7000 mm.",
    },
    {
      question: "Paint or stainless?",
      answer:
        "Both are Capsule filters. Same split as Airstream: metal show versus wrap.",
    },
    {
      question: "When is Tandem Axle the right choice?",
      answer:
        "On 5500 mm Capsules and whenever payload is high. Shorter street units are often Single Axle.",
    },
    {
      question: "Where do I get a price?",
      answer:
        "This page chooses the class. Open a model in the catalog, then Get Quote.",
    },
  ],
  tocCompare: "Capsule vs Airstream",
  ...TOC_BAR,
  compareSectionId: "series-compare",
  metaTitle: "How to Choose a Capsule Food Trailer | Chris Machinery",
  metaDescription:
    "Choose Capsule length 3900–5500 mm, 375 arc, paint or stainless, and Single or Tandem axle. Then filter the catalog and get a quote.",
};

function withPodNav(pod: typeof POD_SERIES_GUIDE_DEFAULTS): SeriesGuideDefaults {
  return {
    introTitle: pod.introTitle,
    intro: pod.intro,
    shapeBody: pod.shapeBody,
    sizeTitle: pod.sizeTitle,
    sizeNote: pod.sizeNote,
    sizeRows: pod.sizeRows.map((row) => ({ ...row, exampleHref: row.exampleHref || "" })),
    kitchenTitle: pod.kitchenTitle,
    kitchenBody: pod.kitchenBody,
    kitchenLinkLabel: pod.kitchenLinkLabel,
    kitchenLinkHref: pod.kitchenLinkHref,
    quoteLabel: pod.quoteLabel,
    quoteHref: pod.quoteHref,
    faqTitle: pod.faqTitle,
    faq: [...pod.faq],
    tocCompare: "Dome / Square",
    ...TOC_BAR,
    compareSectionId: "shape-guide",
    pdpNote: "Dome vs Square body. See the series guide.",
    metaTitle: "How to Choose a Pod Food Trailer Size | Chris Machinery",
    metaDescription:
      "Choose Pod length 2300–5000 mm, width 1650 or 2000 mm, Dome or Square roof, and Single or Tandem axle. Then filter the factory catalog and get a quote.",
  };
}

export const SERIES_GUIDE_DEFAULTS: Record<GuideSeries, SeriesGuideDefaults> = {
  pod: withPodNav(POD_SERIES_GUIDE_DEFAULTS),
  airstream,
  square,
  container,
  capsule,
};

export function isGuideSeries(series: string): series is GuideSeries {
  return series in SERIES_GUIDE_DEFAULTS;
}

export type SeriesGuideCms = {
  introTitle?: string;
  intro?: string;
  introImageUrl?: string;
  introImageAlt?: string;
  shapeBody?: string;
  sizeTitle?: string;
  sizeNote?: string;
  sizeRows?: Partial<SeriesGuideSizeRow>[];
  kitchenTitle?: string;
  kitchenBody?: string;
  kitchenImageUrl?: string;
  kitchenImageAlt?: string;
  kitchenLinkLabel?: string;
  kitchenLinkHref?: string;
  quoteLabel?: string;
  quoteHref?: string;
  faqTitle?: string;
  faq?: { question?: string; answer?: string }[];
  tocCompare?: string;
  tocSize?: string;
  tocKitchen?: string;
  tocFaq?: string;
  tocModels?: string;
};

export function resolveSeriesFaq(series: GuideSeries, cms?: SeriesGuideCms | null) {
  return SERIES_GUIDE_DEFAULTS[series].faq.map((item, i) => ({
    question: cms?.faq?.[i]?.question?.trim() || item.question,
    answer: cms?.faq?.[i]?.answer?.trim() || item.answer,
  }));
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function seedSeriesGuide(series: GuideSeries) {
  const d = SERIES_GUIDE_DEFAULTS[series];
  return {
    introTitle: d.introTitle,
    intro: d.intro,
    shapeBody: d.shapeBody,
    sizeTitle: d.sizeTitle,
    sizeNote: d.sizeNote,
    sizeRows: d.sizeRows.map((row, index) => ({
      _key: `${series}Size${index}`,
      _type: "object" as const,
      scene: row.scene,
      length: row.length,
      width: row.width,
      axle: row.axle,
      shape: row.shape,
      material: row.material,
      note: row.note,
      exampleLabel: row.exampleLabel,
    })),
    kitchenTitle: d.kitchenTitle,
    kitchenBody: d.kitchenBody,
    kitchenLinkLabel: d.kitchenLinkLabel,
    quoteLabel: d.quoteLabel,
    quoteHref: d.quoteHref,
    faqTitle: d.faqTitle,
    tocCompare: d.tocCompare,
    tocSize: d.tocSize,
    tocKitchen: d.tocKitchen,
    tocFaq: d.tocFaq,
    tocModels: d.tocModels,
    faq: d.faq.map((item, index) => ({
      _key: `${series}Faq${index}`,
      _type: "object" as const,
      question: item.question,
      answer: item.answer,
    })),
  };
}
