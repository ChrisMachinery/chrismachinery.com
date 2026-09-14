export const AIRSTREAM_ARC_GUIDE_DEFAULTS = {
  title: "Window arcs: 375 / 500 / 700",
  note: "Three window curves for the Airstream body. Pick the look that fits the trailer length and your brand.",
  items: [
    {
      label: "375",
      body: "Tighter window curve — a more compact Airstream profile.",
    },
    {
      label: "500",
      body: "Mid window curve — the usual Airstream look.",
    },
    {
      label: "700",
      body: "Fuller window curve — a longer, more open Airstream profile.",
    },
  ],
} as const;

export const AIRSTREAM_ARC_PDP_NOTE = "What 375 / 500 / 700 window arcs mean. See the series guide.";

/** Display ~390×156 px (5:2) in each of the three cards. */
export const AIRSTREAM_ARC_IMAGE_SPEC = {
  ratio: "5:2",
  upload: "1000×400",
  minimum: "750×300",
  fetchWidth: 1000,
} as const;

export const AIRSTREAM_ARC_IMAGES = [
  {
    label: "375",
    file: "airstream-arc-375.jpg",
    alt: "Side profile of an Airstream food trailer showing a 375 roof arc",
  },
  {
    label: "500",
    file: "airstream-arc-500.jpg",
    alt: "Side profile of an Airstream food trailer showing a 500 roof arc",
  },
  {
    label: "700",
    file: "airstream-arc-700.jpg",
    alt: "Side profile of an Airstream food trailer showing a 700 roof arc",
  },
] as const;
