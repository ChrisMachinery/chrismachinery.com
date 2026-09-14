export const POD_SHAPE_GUIDE_DEFAULTS = {
  title: "Body shapes: Dome / Square",
  note: "Two Pod roofs on the same trailer family. Pick the look that fits your brand and service window.",
  items: [
    {
      label: "Dome",
      body: "Rounded roof — a compact, classic pod profile with a softer street presence.",
    },
    {
      label: "Square",
      body: "Flat roof — a boxier pod with a more upright face and straighter service window.",
    },
  ],
} as const;

export const POD_SHAPE_PDP_NOTE = "Dome vs Square body. See the series guide.";

/** Display 4:3 in each of the two cards. */
export const POD_SHAPE_IMAGE_SPEC = {
  ratio: "4:3",
  upload: "1200×900",
  minimum: "800×600",
} as const;

export const POD_SHAPE_IMAGES = [
  {
    label: "Dome",
    alt: "Side profile of a Pod food trailer with a dome roof",
  },
  {
    label: "Square",
    alt: "Side profile of a Pod food trailer with a square roof",
  },
] as const;
