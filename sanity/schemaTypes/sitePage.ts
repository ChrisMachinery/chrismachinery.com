import { defineField, defineType } from "sanity";
import { imageAltField, siteImageHotspot } from "../imageHotspot";

const aboutOnly = ({ document }: { document?: { path?: unknown } }) => document?.path !== "/about";
const contactOnly = ({ document }: { document?: { path?: unknown } }) => document?.path !== "/contact";
const notSolutionsPage = ({ document }: { document?: { path?: unknown } }) =>
  document?.path !== "/solutions";
const notSeriesPage = ({ document }: { document?: { path?: unknown } }) =>
  !["/products/pod", "/products/airstream", "/products/square", "/products/container", "/products/capsule", "/products/others"].includes(
    String(document?.path || ""),
  );
const notOptionGuidePage = ({ document }: { document?: { path?: unknown } }) => {
  const path = String(document?.path || "");
  return path !== "/products/airstream" && path !== "/products/pod";
};

export const sitePage = defineType({
  name: "sitePage",
  title: "Website page",
  type: "document",
  fields: [
    defineField({
      name: "path",
      title: "Website path",
      type: "string",
      description: "Must match the frontend URL, e.g. /about or /products/pod",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Page title (H1)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Intro text below title",
      type: "text",
    }),
    defineField({
      name: "customerPhotosTitle",
      title: "客户反馈轮播标题",
      type: "string",
      hidden: notSolutionsPage,
      description: "方案卡片下方的实拍轮播。留空则用默认英文 From our customers。",
    }),
    defineField({
      name: "customerPhotos",
      title: "客户反馈图（轮播）",
      type: "array",
      hidden: notSolutionsPage,
      description:
        "客户现场实拍或交货照片。建议 6–8 张。规格：1200×900 px（4:3 横图），JPG/WebP，单张约 300KB–800KB。车身居中填满，不要纯聊天截图竖图。网页不显示图注。",
      validation: (Rule) => Rule.min(4).warning("建议至少 4 张客户反馈图"),
      of: [
        {
          type: "object",
          name: "customerPhoto",
          title: "反馈图",
          fields: [
            defineField({
              name: "image",
              title: "图片",
              type: "image",
              description: "1200×900 px（4:3）。JPG 或 WebP。现场实拍，主体居中。Alt 写英文（网页不显示，给 Google 和读屏）。",
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
          ],
          preview: {
            select: { media: "image" },
            prepare: ({ media }) => ({
              title: "customer feedback",
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "included",
      title: "Included (all models in this series)",
      type: "array",
      hidden: notSeriesPage,
      description:
        "该系列所有产品详情页共用。改这里即可，不必每台车改一遍。留空则用代码默认 4 条。",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "arcGuideTitle",
      title: "系列选项说明标题",
      type: "string",
      hidden: notOptionGuidePage,
      description:
        "系列页顶部图文。Airstream 写窗弧；Pod 写 Dome / Square。全系列只写一次，不要写进每台产品。",
    }),
    defineField({
      name: "arcGuideNote",
      title: "系列选项总述",
      type: "text",
      hidden: notOptionGuidePage,
      rows: 2,
      description: "只讲造型长什么样，不要写价格。报价在询盘里回复。",
    }),
    defineField({
      name: "arcGuides",
      title: "选项卡片",
      type: "array",
      hidden: notOptionGuidePage,
      description:
        "Airstream 建议 3 条（375 / 500 / 700）。Pod 建议 2 条（Dome / Square）。卡片和详情页只显示芯片；不要写价格。",
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "名称",
              type: "string",
              description: "例如 375，或 Dome / Square",
            }),
            defineField({ name: "body", title: "一句说明", type: "text", rows: 2 }),
            defineField({
              name: "image",
              title: "示意小图",
              type: "image",
              description:
                "卡片底部示意。Airstream 窗弧用 5:2（建议 1000×400）。Pod 造型用 4:3（建议 1200×900），方便对比 Dome / Square。JPG/WebP 或白底 PNG。车身轮廓居中。Alt 仅给 Google，网页上不显示。",
              options: { hotspot: siteImageHotspot },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt text（仅 Google SEO）",
                  description:
                    "只写入图片 alt，网站上不显示。例如：Side profile of a Pod food trailer with a dome roof",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "body", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Main image",
      type: "image",
      description:
        "About 页工厂图。若已填工厂视频链接，页面优先播视频，这张图可留空。建议 16:9，约 1800×1000 JPG。",
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({ name: "factoryArea", title: "Factory area stat", type: "string", hidden: aboutOnly }),
    defineField({ name: "annualOutput", title: "Annual output stat", type: "string", hidden: aboutOnly }),
    defineField({ name: "technicians", title: "Technicians stat", type: "string", hidden: aboutOnly }),
    defineField({ name: "countries", title: "Countries exported stat", type: "string", hidden: aboutOnly }),
    defineField({
      name: "factoryTitle",
      title: "Factory heading",
      type: "string",
      hidden: aboutOnly,
    }),
    defineField({
      name: "factoryBody",
      title: "Factory intro",
      type: "text",
      hidden: aboutOnly,
      rows: 8,
      description:
        "换行：按 Enter。小标题：单独一行写 ### 标题文字。例如：### Growth Driven by Quality",
    }),
    defineField({
      name: "factoryVideoUrl",
      title: "Factory video link",
      type: "text",
      hidden: aboutOnly,
      rows: 2,
      description:
        "可选。粘贴 YouTube / Vimeo / Bilibili 链接，或整段 iframe。有视频则右侧播视频，工厂照片可留空。",
    }),
    defineField({
      name: "buildTitle",
      title: "How we build heading",
      type: "string",
      hidden: aboutOnly,
    }),
    defineField({
      name: "buildIntro",
      title: "How we build intro",
      type: "text",
      hidden: aboutOnly,
      rows: 2,
    }),
    defineField({
      name: "buildSteps",
      title: "How we build steps",
      type: "array",
      hidden: aboutOnly,
      description: "最多 4 步。每步 3 张车间实拍轮播：4:3，约 1200×900 JPG。",
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Step name", type: "string" }),
            defineField({ name: "body", title: "Step text", type: "text", rows: 2 }),
            defineField({
              name: "images",
              title: "Step photos（3 张轮播）",
              type: "array",
              description: "每步固定 3 张。4:3，约 1200×900 JPG。车间实拍，不要海报或渲染图。",
              validation: (Rule) => Rule.max(3),
              of: [{ type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
            }),
            defineField({
              name: "image",
              title: "Step photo（旧字段）",
              type: "image",
              hidden: true,
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
          ],
          preview: { select: { title: "title", subtitle: "body", media: "images.0" } },
        },
      ],
    }),
    defineField({
      name: "flowImages",
      title: "Production flow images（已停用）",
      type: "array",
      hidden: true,
      of: [{ type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
    }),
    defineField({
      name: "certImages",
      title: "Certification images（已停用）",
      type: "array",
      hidden: true,
      of: [{ type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
    }),
    defineField({
      name: "gallery",
      title: "Extra factory photos（可选）",
      type: "array",
      hidden: aboutOnly,
      description: "可选补充图，最多 8 张。主图请用上面的 Main image。规格：16:9，约 1800×1000 JPG。",
      validation: (Rule) => Rule.max(8),
      of: [{ type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
    }),
    defineField({
      name: "logos",
      title: "Customer logos（已停用）",
      type: "array",
      hidden: true,
      of: [{ type: "image", options: { hotspot: siteImageHotspot }, fields: [imageAltField] }],
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps 嵌入链接",
      type: "text",
      hidden: contactOnly,
      rows: 3,
      description:
        "打开 Google 地图搜工厂地址 → 分享 → 嵌入地图 → 复制 HTML。整段 iframe 或只复制 src 里的 https://www.google.com/maps/embed?... 粘贴到这里。",
    }),
    defineField({
      name: "mapImage",
      title: "Map image（可选，无嵌入链接时显示）",
      type: "image",
      hidden: true,
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({ name: "address", title: "Address / contact line", type: "string", hidden: contactOnly }),
    defineField({ name: "faqTitle", title: "FAQ heading", type: "string", hidden: contactOnly }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      hidden: contactOnly,
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Answer" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "path" },
  },
});
