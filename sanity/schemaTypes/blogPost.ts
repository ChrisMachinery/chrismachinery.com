import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { ImageWithSizeInput } from "../components/ImageWithSizeInput";
import { imageAltField, siteImageHotspot } from "../imageHotspot";

const articleImage = {
  type: "image" as const,
  options: { hotspot: siteImageHotspot },
  fields: [imageAltField],
  components: { input: ImageWithSizeInput },
};

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
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
        source: (doc: { slug?: { current?: string }; title?: string }) =>
          doc.slug?.current?.trim() || doc.title || "",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .trim()
            .toLowerCase()
            .replace(/['’]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      },
      validation: (Rule) => Rule.required(),
      components: { input: AutoSlugInput },
      description: "文章链接。留空会按标题自动生成；没有 slug 时无法发布。",
    }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      description: "上传后显示宽 × 高和文件大小。建议 1600×900 px 或更大，横向。",
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
      components: { input: ImageWithSizeInput },
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, articleImage],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      initialValue: "Buying Guide",
      validation: (Rule) => Rule.required(),
      description: "Buying Guide = 怎么选。Industry News = 工厂/合规。Case Study = 出货案例（国家+菜单+车型），只写在 Blog，不要另开栏目。",
      options: {
        list: [
          { title: "Buying Guide", value: "Buying Guide" },
          { title: "Industry News", value: "Industry News" },
          { title: "Case Study（出货案例）", value: "Case Study" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "coverImage" },
  },
});
