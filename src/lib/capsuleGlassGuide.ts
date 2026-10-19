export const CAPSULE_GLASS_GUIDE_DEFAULTS = {
  title: "Glass heights: Above / Below",
  note: "Two glass-window heights on the same Capsule size list. Above-counter glass is the taller display face. Below-counter glass drops the glazing. Length does not change with the glass.",
  items: [
    {
      label: "Above counter",
      body: "Glass sits above the service counter — a taller display face for street and night-market.",
    },
    {
      label: "Below counter",
      body: "Glass drops below the counter line — a lower serving window and a different interior sightline.",
    },
  ],
} as const;

export const CAPSULE_GLASS_PDP_NOTE = "Above-counter vs below-counter glass. See the series guide.";

/** Display 4:3 in each of the two cards. */
export const CAPSULE_GLASS_IMAGE_SPEC = {
  ratio: "4:3",
  upload: "1200×900",
  minimum: "800×600",
} as const;

export const CAPSULE_GLASS_IMAGES = [
  {
    label: "Above counter",
    alt: "Capsule food trailer with above-counter glass windows",
  },
  {
    label: "Below counter",
    alt: "Capsule food trailer with below-counter glass windows",
  },
] as const;
