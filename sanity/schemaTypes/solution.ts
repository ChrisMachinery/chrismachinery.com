import { defineField, defineType } from "sanity";
import { imageAltField, siteImageHotspot } from "../imageHotspot";
import { SolutionEquipmentInput } from "../components/SolutionEquipmentInput";

export const solution = defineType({
  name: "solution",
  title: "Solution",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "recommendedModels",
      title: "Recommended models",
      type: "array",
      description:
        "This is the list under “Recommended models” on the website. Add an item, then either pick a product from the dropdown or paste a product page URL.",
      of: [
        {
          type: "object",
          name: "recommendedModel",
          title: "Recommended model",
          fields: [
            defineField({
              name: "product",
              title: "Product (dropdown)",
              type: "reference",
              to: [{ type: "product" }],
              description: "Search and select a product. The jump link is created automatically.",
            }),
            defineField({
              name: "url",
              title: "Or paste URL / path",
              type: "string",
              description: "Optional. Example: /products/square/square-4500-2200-paint-tandem",
            }),
            defineField({
              name: "label",
              title: "Link text (optional)",
              type: "string",
              description: "Leave empty to use the product title.",
            }),
          ],
          preview: {
            select: {
              productTitle: "product.title",
              url: "url",
              label: "label",
            },
            prepare: ({ productTitle, url, label }) => ({
              title: label || productTitle || url || "Recommended model",
              subtitle: url || (productTitle ? "Linked from product dropdown" : "Add a product or URL"),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "lede",
      title: "目录卡片摘要",
      type: "text",
      rows: 3,
      description: "写在 /solutions 卡片上，一两句。点进卡片才是 800–1500 词正文。",
    }),
    defineField({
      name: "sceneImage",
      title: "Scene image (catalog card + article)",
      type: "image",
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
      description: "Solutions 目录卡片和文章页头图。",
    }),
    defineField({
      name: "icon",
      title: "Icon (unused)",
      type: "image",
      hidden: true,
    }),
    defineField({
      name: "equipment",
      title: "Recommended equipment",
      type: "array",
      description:
        "从 Customize 厨房设备目录勾选。先维护 Content → Customize 选配目录，再在这里组成 Fast Food / Coffee 等方案。",
      of: [{ type: "string" }],
      components: { input: SolutionEquipmentInput },
    }),
    defineField({
      name: "advice",
      title: "Advice text",
      type: "text",
      hidden: true,
    }),
    defineField({
      name: "description",
      title: "Description (legacy)",
      type: "text",
      hidden: true,
    }),
    defineField({
      name: "content",
      title: "文章正文（约 800–1500 词）",
      type: "array",
      description: "点进目录卡片后的长文。空则网站用英文默认章。不要把长文写在卡片摘要里。",
      of: [{ type: "block" }, { type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
    }),
    defineField({
      name: "featuredProducts",
      title: "Recommended products (old)",
      type: "array",
      hidden: true,
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "recommendedSlugs",
      title: "Recommended product slugs (legacy)",
      type: "array",
      hidden: true,
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "title", media: "sceneImage" },
  },
});
