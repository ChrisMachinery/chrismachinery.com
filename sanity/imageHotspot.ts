import { defineField } from "sanity";

export const siteImageHotspot = {
  previews: [
    { title: "Product card 4:3", aspectRatio: 4 / 3 },
    { title: "Wide 16:9", aspectRatio: 16 / 9 },
  ],
} as const;

export const imageAltField = defineField({
  name: "alt",
  type: "string",
  title: "Alt text",
  description:
    'Describe the image for accessibility and SEO. Example: "Pod 3000 single-axle dome food trailer, stainless steel body, white background"',
});
