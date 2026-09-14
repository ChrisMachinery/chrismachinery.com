import { vercelStegaClean } from "@vercel/stega";

export const TESTIMONIAL_FLAG_CODES = ["UK", "CH", "PT", "NO", "AT", "FR"] as const;

type FlagCode = (typeof TESTIMONIAL_FLAG_CODES)[number];

export type TestimonialPlace = {
  country: string;
  code: FlagCode;
  iso: string;
};

const PLACES: Record<string, TestimonialPlace> = {
  uk: { country: "United Kingdom", code: "UK", iso: "gb" },
  gb: { country: "United Kingdom", code: "UK", iso: "gb" },
  "united kingdom": { country: "United Kingdom", code: "UK", iso: "gb" },
  "great britain": { country: "United Kingdom", code: "UK", iso: "gb" },
  england: { country: "United Kingdom", code: "UK", iso: "gb" },
  britain: { country: "United Kingdom", code: "UK", iso: "gb" },
  英国: { country: "United Kingdom", code: "UK", iso: "gb" },
  英: { country: "United Kingdom", code: "UK", iso: "gb" },
  ch: { country: "Switzerland", code: "CH", iso: "ch" },
  switzerland: { country: "Switzerland", code: "CH", iso: "ch" },
  suisse: { country: "Switzerland", code: "CH", iso: "ch" },
  schweiz: { country: "Switzerland", code: "CH", iso: "ch" },
  瑞士: { country: "Switzerland", code: "CH", iso: "ch" },
  pt: { country: "Portugal", code: "PT", iso: "pt" },
  portugal: { country: "Portugal", code: "PT", iso: "pt" },
  葡萄牙: { country: "Portugal", code: "PT", iso: "pt" },
  no: { country: "Norway", code: "NO", iso: "no" },
  norway: { country: "Norway", code: "NO", iso: "no" },
  norge: { country: "Norway", code: "NO", iso: "no" },
  挪威: { country: "Norway", code: "NO", iso: "no" },
  at: { country: "Austria", code: "AT", iso: "at" },
  austria: { country: "Austria", code: "AT", iso: "at" },
  österreich: { country: "Austria", code: "AT", iso: "at" },
  osterreich: { country: "Austria", code: "AT", iso: "at" },
  奥地利: { country: "Austria", code: "AT", iso: "at" },
  奧地利: { country: "Austria", code: "AT", iso: "at" },
  fr: { country: "France", code: "FR", iso: "fr" },
  france: { country: "France", code: "FR", iso: "fr" },
  法国: { country: "France", code: "FR", iso: "fr" },
  法國: { country: "France", code: "FR", iso: "fr" },
};

function keysOf(value?: string) {
  const clean = vercelStegaClean(value || "").trim();
  if (!clean) return [];
  return [clean, clean.toLowerCase()];
}

export function resolveTestimonialPlace(country?: string, flag?: string): TestimonialPlace {
  for (const key of [...keysOf(country), ...keysOf(flag)]) {
    const hit = PLACES[key];
    if (hit) return hit;
  }
  return { country: "United Kingdom", code: "UK", iso: "gb" };
}
