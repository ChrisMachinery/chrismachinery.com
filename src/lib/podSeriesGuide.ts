/** Copy for the Pod series page. ~800–1500 English words is the SUM of these blocks, not one caption. */
export const POD_SERIES_GUIDE_DEFAULTS = {
  introTitle: "How to choose a Pod size",
  intro: `Pod is the compact food-trailer family: body length 2300, 2500, 2800, 2900, 3000, 3200, 3400, 3800, 3900, 4000, 4500 or 5000 mm; width 1650 or 2000 mm; Dome or Square roof; paint finish; Single Axle or Tandem Axle. Those numbers are already in the filters at the bottom of this page.

Use this chapter to pick a class — roof, length band, width, axle — then open the catalog. Each product card still answers the next question: the exact size of that unit and the quote path. Stainless versus paint is not a Pod option; it belongs to Airstream. Prices stay in the inquiry, not in this guide.`,
  introImageLabel:
    "Pod 系列选型图 · 长 2300–5000 · 宽 1650/2000 · Dome/Square · Paint · Single/Tandem · 16:9 · 1800×1000 JPG",
  shapeBody: `Dome and Square share the same length, width, and axle list. Dome is the rounded roof: a classic pod silhouette and a softer street presence. Square is the flatter roof: a more upright fascia, straighter glass, and a wall that takes a large brand wrap more easily.

Pick Dome when the body itself should look like a pod. Pick Square when you want a billboard-like face. A 2800 mm Dome and a 2800 mm Square are the same working length. Filter Shape after the length band, not before.`,
  sizeTitle: "Size band × typical menu",
  sizeNote: `The three cards group lengths that already exist in the Pod filter. They do not invent millimetres. Coffee and dessert sit at the short end; snack and night-market menus take the middle lengths; fryer-heavy or two-person kitchens use 4500 and 5000 mm. After you pick a card, filter Length in the catalog and open two or three models. Example links are placeholders until you paste a product URL such as /products/pod/your-slug.`,
  sizeRows: [
    {
      scene: "Coffee / dessert",
      length: "2300 / 2500 / 2800 / 2900 / 3000 mm",
      width: "1650 mm",
      axle: "Single Axle",
      shape: "Dome or Square",
      material: "Paint",
      note: "Espresso, juice, or a small cold line with one operator. This is the default street Pod: short body, 1650 mm wide, Single Axle. Choose Dome for the classic curve or Square for a flatter fascia — the length does not change.",
      exampleLabel: "Example model (coffee Pod)",
      exampleHref: "",
      imageLabel:
        "Pod 咖啡档 · 长 2300–3000 · 宽 1650 · Dome/Square · Paint · Single Axle · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Snacks / night market",
      length: "3200 / 3400 / 3800 / 3900 / 4000 mm",
      width: "1650 or 2000 mm",
      axle: "Single Axle or Tandem Axle",
      shape: "Dome or Square",
      material: "Paint",
      note: "Griddle, small fryer, topping rail, and more turn space. Stay on 1650 mm for a tight pitch; step to 2000 mm when two people work the line. Single Axle is still common on the shorter units here; move toward Tandem when oil, gas, and water add payload.",
      exampleLabel: "Example model (snack Pod)",
      exampleHref: "",
      imageLabel:
        "Pod 小吃档 · 长 3200–4000 · 宽 1650/2000 · Dome/Square · Paint · Single/Tandem · 4:3 · 1200×900 JPG",
    },
    {
      scene: "Fryer-heavy / two-person",
      length: "4500 / 5000 mm",
      width: "2000 mm",
      axle: "Tandem Axle",
      shape: "Dome or Square",
      material: "Paint",
      note: "Longest Pods in the current catalog. Still a Pod, not a Square-series box. Use 2000 mm width and Tandem Axle for a full fry line. If the menu needs more body than 5000 mm, leave Pod and look at Square or Container.",
      exampleLabel: "Example model (long Pod)",
      exampleHref: "",
      imageLabel:
        "Pod 油炸档 · 长 4500/5000 · 宽 2000 · Dome/Square · Paint · Tandem Axle · 4:3 · 1200×900 JPG",
    },
  ],
  kitchenTitle: "Axle, width, and kitchen workflow",
  kitchenBody: `Width is crew and equipment. 1650 mm is the compact street Pod: one person, coffee or dessert, a narrow pitch. 2000 mm is the two-person or fryer width: a second operator can pass, and a wider bench fits without turning the kitchen into a corridor.

Axle follows weight. Single Axle covers most 2300–3000 mm coffee Pods and many mid-length snack units with a light kit. Tandem Axle is the usual choice at 4500 and 5000 mm, and whenever oil, gas, and water make the trailer heavy. Do not spec Tandem as a status option on a 2300 mm coffee cart; do not force Single Axle onto a 5000 mm fryer Pod.

Window side, equipment list, and interior drawings are not series filters. They belong on Customize. The link slot below is where /customize should be pasted. Included items for every Pod stay on the product page.`,
  kitchenImageLabel:
    "Pod 厨房示意 · 宽 1650 vs 2000 · Single vs Tandem · 设备沿窗布置 · 4:3 · 1200×900 JPG",
  kitchenLinkLabel: "Customize kitchen layout",
  kitchenLinkHref: "",
  quoteLabel: "Get Quote",
  quoteHref: "/contact?from=/products/pod",
  faqTitle: "Pod buying FAQ",
  faq: [
    {
      question: "Do Dome and Square share the same sizes?",
      answer:
        "Yes. Both roofs use the same Pod length, width, and axle filters. Shape only changes the silhouette. A 3000 mm Dome and a 3000 mm Square are the same working length; filter Shape after you pick the band.",
    },
    {
      question: "When should I pick 1650 mm vs 2000 mm width?",
      answer:
        "1650 mm for one-person coffee or dessert on a tight street. 2000 mm when two people work the line or you need a wider fryer. Both widths are already in the Pod filter — they are not custom-only dimensions.",
    },
    {
      question: "When is Tandem Axle the right choice?",
      answer:
        "Use Tandem on 4500 and 5000 mm Pods, and on shorter units when fryer oil, gas bottles, and water tanks stack up. Most 2300–3000 mm coffee Pods stay Single Axle.",
    },
    {
      question: "Is Pod available in stainless steel?",
      answer:
        "In the current catalog Pod material is Paint. Stainless versus paint is an Airstream filter, not a Pod filter. Ask in the quote if you need a special finish; do not look for it in the Pod chips.",
    },
    {
      question: "Where do I confirm the exact size and get a price?",
      answer:
        "This page chooses the class. Open a model in the catalog for that unit’s body size, then Get Quote. We do not publish prices on the series guide.",
    },
  ],
} as const;

export type PodGuideSizeRow = {
  scene?: string;
  length?: string;
  width?: string;
  axle?: string;
  shape?: string;
  material?: string;
  note?: string;
  exampleLabel?: string;
  exampleHref?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type PodGuideFaq = {
  question?: string;
  answer?: string;
};

export type PodGuideCms = {
  introTitle?: string;
  intro?: string;
  introImageUrl?: string;
  introImageAlt?: string;
  shapeBody?: string;
  sizeTitle?: string;
  sizeNote?: string;
  sizeRows?: PodGuideSizeRow[];
  kitchenTitle?: string;
  kitchenBody?: string;
  kitchenImageUrl?: string;
  kitchenImageAlt?: string;
  kitchenLinkLabel?: string;
  kitchenLinkHref?: string;
  quoteLabel?: string;
  quoteHref?: string;
  faqTitle?: string;
  faq?: PodGuideFaq[];
};

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
