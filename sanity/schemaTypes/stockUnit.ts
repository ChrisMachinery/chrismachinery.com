import { defineField, defineType } from "sanity";
import { imageAltField, siteImageHotspot } from "../imageHotspot";

export const stockUnit = defineType({
  name: "stockUnit",
  title: "现货车",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Model",
      type: "string",
      description: "前台卡片型号，例如 Airstream 500A 375 Arc Matt/Mirror。",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quantity",
      title: "Qty",
      type: "number",
      initialValue: 1,
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "colorMaterial",
      title: "Color / Material",
      type: "string",
      description: "例如 Matt black / Mirror stainless。",
    }),
    defineField({
      name: "bodyDimension",
      title: "Body dimension",
      type: "string",
      description: "例如 5000 × 2200 × 2100 mm。",
    }),
    defineField({
      name: "include",
      title: "Include",
      type: "text",
      rows: 5,
      description: "这台现货已包含的配置，可分行填写。",
    }),
    defineField({
      name: "summary",
      title: "情况简介（旧）",
      type: "text",
      hidden: true,
    }),
    defineField({
      name: "product",
      title: "关联产品页（可选）",
      type: "reference",
      to: [{ type: "product" }],
      description: "有的话，询价会带上该型号；客户也可跳转产品详情。",
    }),
    defineField({
      name: "videoUrl",
      title: "Video link",
      type: "url",
      description: "YouTube / Vimeo / Bilibili 或任意视频页链接。卡片上显示 Watch video，新窗口打开。不填则不显示。",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
    defineField({
      name: "photos",
      title: "实拍轮播（可增删）",
      type: "array",
      description: "卡片上方轮播。建议 16:9 或 16:10，约 1600×1000 JPG。拖动排序，删除即下架该图。",
      of: [
        {
          type: "image",
          options: { hotspot: siteImageHotspot },
          fields: [imageAltField],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", quantity: "quantity", color: "colorMaterial", media: "photos.0" },
    prepare: ({ title, quantity, color, media }) => ({
      title: title || "现货车",
      subtitle: [quantity ? `Qty ${quantity}` : "", color].filter(Boolean).join(" · ") || "未填数量",
      media,
    }),
  },
});
