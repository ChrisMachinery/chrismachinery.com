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
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "content",
      title: "Read article 正文",
      type: "array",
      description:
        "点 Solutions 卡片上的 Read article 之后看到的长文，约 800–1500 词。不要写在下面的卡片摘要里。空则前台显示默认英文稿。",
      of: [{ type: "block" }, { type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
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
      title: "目录卡片摘要（不是文章）",
      type: "text",
      rows: 3,
      description: "只出现在 /solutions 目录卡片上，一两句。长文请写上面的「Read article 正文」。",
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
