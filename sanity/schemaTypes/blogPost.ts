import { defineField, defineType } from "sanity";
import { AutoSlugInput } from "../components/AutoSlugInput";
import { imageAltField, siteImageHotspot } from "../imageHotspot";

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
      options: { source: "title", maxLength: 96 },
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
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
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
      options: {
        list: [
          { title: "Buying Guide", value: "Buying Guide" },
          { title: "Industry News", value: "Industry News" },
          { title: "Case Study", value: "Case Study" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "author", media: "coverImage" },
  },
});
