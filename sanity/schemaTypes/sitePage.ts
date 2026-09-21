import { defineField, defineType } from "sanity";
import { imageAltField, siteImageHotspot } from "../imageHotspot";
import {
  GuideAxleInput,
  GuideLengthInput,
  GuideMaterialInput,
  GuideShapeInput,
  GuideWidthInput,
} from "../components/GuideSizeParamInputs";

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
const notSeriesGuidePage = ({ document }: { document?: { path?: unknown } }) =>
  !["/products/pod", "/products/airstream", "/products/square", "/products/container", "/products/capsule"].includes(
    String(document?.path || ""),
  );

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
      title: "Included / 标配（该系列全部车型）",
      type: "array",
      hidden: notSeriesPage,
      description:
        "产品详情页左侧 Included。该系列所有型号共用。改这里即可，不必每台车改。",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "customizable",
      title: "Customize / 选配（该系列全部车型）",
      type: "array",
      hidden: notSeriesPage,
      description:
        "产品详情页右侧 Can be customized。按系列填写。留空则回退到首页「全站选配」列表。",
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
      name: "podGuide",
      title: "系列选型指南",
      type: "object",
      hidden: notSeriesGuidePage,
      description:
        "写在对应系列页（Pod / Airstream / Square / Container / Capsule）。不改产品参数。图片可空（网页显示带参数的占位图）。代表车型链接可空（网页显示【LINK】和写入位置）。",
      fields: [
        defineField({ name: "introTitle", title: "H1 下方选型标题", type: "string" }),
        defineField({
          name: "tocCompare",
          title: "目录栏 · 第 1 粒（对比）",
          type: "string",
          description: "空则用默认：Pod=Dome / Square，Airstream=375 / 500 / 700。点黄条可改。",
        }),
        defineField({
          name: "tocSize",
          title: "目录栏 · 第 2 粒",
          type: "string",
          initialValue: "Sizing Guide",
          description: "空则显示 Sizing Guide。",
        }),
        defineField({
          name: "tocKitchen",
          title: "目录栏 · 第 3 粒",
          type: "string",
          initialValue: "Specs & Layout",
          description: "空则显示 Specs & Layout。",
        }),
        defineField({
          name: "tocFaq",
          title: "目录栏 · 第 4 粒",
          type: "string",
          initialValue: "FAQ",
        }),
        defineField({
          name: "tocModels",
          title: "目录栏 · 第 5 粒",
          type: "string",
          initialValue: "Models",
        }),
        defineField({
          name: "intro",
          title: "定位正文（约 100–140 词）",
          type: "text",
          rows: 8,
          description: "页面第 1 块。800–1500 是全页各块加总，不是只写在这里。",
        }),
        defineField({
          name: "introImage",
          title: "选型总图",
          type: "image",
          description: "可选。空则显示占位：长宽/造型/轴数。建议 16:9，约 1800×1000 JPG。",
          options: { hotspot: siteImageHotspot },
          fields: [imageAltField],
        }),
        defineField({
          name: "shapeBody",
          title: "造型/系列对比正文（约 80–160 词）",
          type: "text",
          rows: 6,
          description: "写在对比卡下方（Pod 的 Dome/Square、Airstream 的弧度）。Square / Container / Capsule 没有对比卡，这段就是对比节正文。",
        }),
        defineField({ name: "sizeTitle", title: "尺寸对照标题", type: "string" }),
        defineField({ name: "sizeNote", title: "尺寸对照说明（约 80–120 词）", type: "text", rows: 5 }),
        defineField({
          name: "sizeRows",
          title: "尺寸档（3 条）",
          type: "array",
          validation: (Rule) => Rule.max(3),
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "scene", title: "场景名", type: "string" }),
                defineField({
                  name: "exampleHref",
                  title: "链接",
                  type: "string",
                  description: "粘贴推荐产品页，例如 /products/pod/pod-2300-… 或完整 URL。场景名会成为标题入口，无下划线。",
                }),
                defineField({
                  name: "length",
                  title: "长度",
                  type: "string",
                  description: "与本系列产品筛选相同，可多选。网页显示为 2300 / 2500 mm。",
                  components: { input: GuideLengthInput },
                }),
                defineField({
                  name: "width",
                  title: "宽度",
                  type: "string",
                  description: "与本系列产品筛选相同，可多选。",
                  components: { input: GuideWidthInput },
                }),
                defineField({
                  name: "axle",
                  title: "轴数",
                  type: "string",
                  description: "Single / Tandem，与本系列筛选相同。",
                  components: { input: GuideAxleInput },
                }),
                defineField({
                  name: "shape",
                  title: "造型",
                  type: "string",
                  description: "与本系列筛选相同（Pod=Dome/Square，Airstream=弧度）。",
                  components: { input: GuideShapeInput },
                }),
                defineField({
                  name: "material",
                  title: "材质",
                  type: "string",
                  description: "与本系列筛选相同。",
                  components: { input: GuideMaterialInput },
                }),
                defineField({ name: "note", title: "说明", type: "text", rows: 3 }),
                defineField({
                  name: "image",
                  title: "示意",
                  type: "image",
                  description: "可选。4:3，约 1200×900。空则占位图会写出该档参数。",
                  options: { hotspot: siteImageHotspot },
                  fields: [imageAltField],
                }),
              ],
              preview: { select: { title: "scene", subtitle: "length" } },
            },
          ],
        }),
        defineField({ name: "kitchenTitle", title: "厨房/轴数标题", type: "string" }),
        defineField({ name: "kitchenBody", title: "厨房/轴数正文（约 120–180 词）", type: "text", rows: 8 }),
        defineField({
          name: "kitchenImage",
          title: "厨房示意",
          type: "image",
          description: "可选。4:3，约 1200×900。",
          options: { hotspot: siteImageHotspot },
          fields: [imageAltField],
        }),
        defineField({ name: "kitchenLinkLabel", title: "自定义页链接文案", type: "string" }),
        defineField({
          name: "kitchenLinkHref",
          title: "自定义页链接（可空）",
          type: "string",
          description: "写入位置：podGuide.kitchenLinkHref。例如 /customize。空则显示【LINK】占位。",
        }),
        defineField({
          name: "quoteLabel",
          title: "Get Quote 按钮文案",
          type: "string",
        }),
        defineField({
          name: "quoteHref",
          title: "Get Quote 链接",
          type: "string",
          description: "默认 /contact?from=/products/{系列}。点蓝框可改。",
        }),
        defineField({ name: "faqTitle", title: "FAQ 标题", type: "string" }),
        defineField({
          name: "faq",
          title: "FAQ",
          type: "array",
          validation: (Rule) => Rule.max(6),
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
