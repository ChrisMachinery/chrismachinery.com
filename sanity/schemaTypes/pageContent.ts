import { defineField, defineType } from "sanity";
import { imageAltField, siteImageHotspot } from "../imageHotspot";
import { ADVANTAGE_ICON_OPTIONS, advantageIconLabel } from "../../src/lib/advantageIcons";

export const pageContent = defineType({
  name: "pageContent",
  title: "首页 / Home",
  type: "document",
  groups: [
    { name: "hero", title: "首页 Banner（上半部分）", default: true },
    { name: "catalog", title: "产品详情共用" },
    { name: "blocks", title: "首页其它区块" },
    { name: "about", title: "关于我们（页底区块）" },
    { name: "nav", title: "顶部导航" },
    { name: "footer", title: "页脚联系方式" },
  ],
  initialValue: {
    slug: { _type: "slug", current: "home" },
  },
  preview: {
    select: { title: "heroSlides.0.title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title: title || "Home page",
      subtitle: slug ? `/${slug}` : "/",
    }),
  },
  fields: [
    defineField({
      name: "slug",
      title: "页面标识",
      type: "slug",
      group: "hero",
      description: "固定填 home，不要改。用来把这份文档对应到网站首页 /",
      options: { maxLength: 96 },
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value?.current === "home" ? true : "Use home so this document is the homepage",
        ),
    }),
    defineField({
      name: "heroSlides",
      title: "首页全屏轮播 Banner",
      type: "array",
      group: "hero",
      description: "至少 4 张。每张是全宽背景图，标题和按钮叠在图上的文字块里。预览中点击对应文字可定位到该字段。",
      validation: (Rule) => Rule.min(4).warning("请至少添加 4 张 Banner"),
      of: [
        {
          type: "object",
          name: "heroSlide",
          title: "Banner",
          fields: [
            defineField({
              name: "title",
              title: "标题",
              type: "string",
              description: "叠在背景图上的大标题，可在预览里点击编辑。",
            }),
            defineField({
              name: "subtitle",
              title: "文字块 / 副标题",
              type: "text",
              description: "标题下面的说明文字。",
            }),
            defineField({
              name: "image",
              title: "背景图",
              type: "image",
              description: "全屏横幅背景。建议 1920×800 或更宽的横图。",
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
            defineField({ name: "primaryButtonText", title: "黄色按钮文字", type: "string" }),
            defineField({ name: "primaryButtonLink", title: "黄色按钮链接", type: "string" }),
            defineField({ name: "secondaryButtonText", title: "白色按钮文字", type: "string" }),
            defineField({ name: "secondaryButtonLink", title: "白色按钮链接", type: "string" }),
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "Banner",
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "heroTitle",
      title: "首页大标题（旧）",
      type: "string",
      group: "hero",
      hidden: true,
    }),
    defineField({
      name: "heroSubtitle",
      title: "首页副标题（旧）",
      type: "text",
      group: "hero",
      hidden: true,
    }),
    defineField({
      name: "heroBackground",
      title: "首页主图（旧）",
      type: "image",
      group: "hero",
      hidden: true,
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({
      name: "heroButtonText",
      title: "黄色按钮文字（旧）",
      type: "string",
      group: "hero",
      hidden: true,
    }),
    defineField({
      name: "heroButtonLink",
      title: "黄色按钮链接（旧）",
      type: "string",
      group: "hero",
      hidden: true,
    }),
    defineField({
      name: "heroButtonProducts",
      title: "白色按钮文字（旧）",
      type: "string",
      group: "hero",
      hidden: true,
    }),
    defineField({
      name: "productCustomOptions",
      title: "Can be customized (all products)",
      type: "array",
      group: "catalog",
      description:
        "所有产品详情页共用这一列表。全站改这一处即可，不必每台车改。留空则用代码默认 4 条。",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "advantagesTitle",
      title: "优势区标题",
      type: "string",
      group: "blocks",
      description: "Why operators choose Chris Machinery",
    }),
    defineField({
      name: "advantages",
      title: "优势卡片",
      type: "array",
      group: "blocks",
      description:
        "首页三列展示。每条：可选小图标、大标题、文字内容、底部图片。建议 6 条。图片文件名 home-advantage-01～06，Alt 用英文写在图片的 Alt text。",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "小图标",
              type: "string",
              description: "对应这条优势的含义。留空则按顺序用默认图标（合规合法 → 不断创新）。",
              options: {
                list: ADVANTAGE_ICON_OPTIONS,
                layout: "dropdown",
              },
              initialValue: "compliance",
            }),
            defineField({
              name: "title",
              title: "大标题",
              type: "string",
              description: "图标右侧的蓝色大标题。",
            }),
            defineField({
              name: "body",
              title: "文字内容",
              type: "text",
              description: "标题下方的说明文字。",
            }),
            defineField({
              name: "image",
              title: "底部图片",
              type: "image",
              description:
                "4:3 横图，建议 1600×1200。文件名：home-advantage-01-compliance.jpg ～ 06-innovation.jpg。下方 Alt 仅给 Google SEO，不会显示在网页上。",
              options: { hotspot: siteImageHotspot },
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  title: "Alt text（仅 Google SEO）",
                  description: "只写入图片的 alt 属性，给搜索引擎用。网站上不会显示这段文字。请用英文。",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", icon: "icon", media: "image" },
            prepare: ({ title, icon, media }) => ({
              title: title || "优势",
              subtitle: advantageIconLabel(icon),
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "productDetailsTitle",
      title: "产品细节区标题",
      type: "string",
      group: "blocks",
      description: "Why choose 下方的产品细节板块标题。",
    }),
    defineField({
      name: "productDetails",
      title: "产品细节（图文交错）",
      type: "array",
      group: "blocks",
      description:
        "每条：标题 + 文案 + 图片。Add item 后自动左右交错：第 1 条文字在左、图在右；第 2 条图在左、文字在右，依此类推。图片规格：横图 1600×1000 px（宽:高 8:5，推荐）或 1600×1200 px（4:3）；JPG/WebP；宽边不少于 1200px；单张约 400KB–1.2MB。",
      of: [
        {
          type: "object",
          name: "productDetail",
          title: "细节",
          fields: [
            defineField({
              name: "title",
              title: "标题",
              type: "string",
              description: "文本框大标题。",
            }),
            defineField({
              name: "body",
              title: "文案",
              type: "text",
              description: "标题下方的说明文字。空一行会在网页上分成新段落；以 - 开头的行会显示为条目。",
              rows: 10,
            }),
            defineField({
              name: "image",
              title: "图片",
              type: "image",
              description:
                "与文字并排的实拍图。推荐 1600×1000 px（8:5 横图），也可 1600×1200（4:3）。JPG 或 WebP，宽边 ≥1200px，单张 400KB–1.2MB。",
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
          ],
          preview: {
            select: { title: "title", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "产品细节",
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "detailShotsTitle",
      title: "局部细节轮播标题",
      type: "string",
      group: "blocks",
      description: "Product details 和 What buyers say 之间的小图轮播。留空则用默认英文 Close-up details。",
    }),
    defineField({
      name: "detailShots",
      title: "局部细节图（小图轮播）",
      type: "array",
      group: "blocks",
      description:
        "特写实拍：地板纹、焊缝、窗框、龙头、不锈钢边角等。建议 6–8 张。图片规格：1200×900 px（4:3 横图），JPG/WebP，单张约 300KB–800KB。主体居中填满画面，不要拍整车远景。",
      validation: (Rule) => Rule.min(4).warning("建议至少 4 张局部细节图"),
      of: [
        {
          type: "object",
          name: "detailShot",
          title: "细节图",
          fields: [
            defineField({
              name: "image",
              title: "图片",
              type: "image",
              description: "1200×900 px（4:3）。JPG 或 WebP。特写、主体居中。Alt 写英文（网页不显示，给 Google 和读屏）。",
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
            defineField({
              name: "caption",
              title: "图注（可选）",
              type: "string",
              description: "图片下方一行英文说明，例如 Non-slip aluminum floor。可留空。",
            }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "局部细节图",
              media,
            }),
          },
        },
      ],
    }),
    defineField({
      name: "hotSeriesTitle",
      title: "热门系列标题",
      type: "string",
      group: "blocks",
    }),
    defineField({
      name: "seriesCards",
      title: "热门系列卡片",
      type: "array",
      group: "blocks",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "系列名", type: "string" }),
            defineField({ name: "caption", title: "说明", type: "string" }),
            defineField({ name: "href", title: "链接", type: "string" }),
            defineField({
              name: "image",
              title: "图片",
              type: "image",
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
          ],
          preview: { select: { title: "name", media: "image" } },
        },
      ],
    }),
    defineField({
      name: "footprintTitle",
      title: "足迹图标题（已下线）",
      type: "string",
      group: "blocks",
      hidden: true,
    }),
    defineField({
      name: "testimonialsTitle",
      title: "客户评价标题",
      type: "string",
      group: "blocks",
    }),
    defineField({
      name: "testimonials",
      title: "客户评价（What buyers say）",
      type: "array",
      group: "blocks",
      description: "首页评价卡片，固定 6 条，前台按 3×2 展示。预览里点击文字或国旗可定位编辑。",
      validation: (Rule) => Rule.min(6).max(6).warning("请保持 6 条客户评价"),
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "姓名", type: "string" }),
            defineField({
              name: "country",
              title: "国家（网站显示英文名）",
              type: "string",
              description: "前台显示英文国名，国旗按此项自动匹配。不要填中文。",
              options: {
                list: [
                  { title: "United Kingdom", value: "United Kingdom" },
                  { title: "Switzerland", value: "Switzerland" },
                  { title: "Portugal", value: "Portugal" },
                  { title: "France", value: "France" },
                  { title: "Austria", value: "Austria" },
                  { title: "Norway", value: "Norway" },
                ],
              },
            }),
            defineField({
              name: "flag",
              title: "国旗（旧字段，已按国家自动显示）",
              type: "string",
              hidden: true,
            }),
            defineField({ name: "text", title: "评价", type: "text" }),
            defineField({
              name: "photo",
              title: "头像（已改用国旗，无需上传）",
              type: "image",
              hidden: true,
              options: { hotspot: siteImageHotspot },
              fields: [imageAltField],
            }),
          ],
          preview: { select: { title: "name" } },
        },
      ],
    }),
    defineField({
      name: "logo",
      title: "网站 Logo",
      type: "image",
      group: "nav",
      description: "左上角黄色 CM 位置。上传后替换该图标。点击预览里的 Logo 可定位到这里。",
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({ name: "navHome", title: "导航：Home", type: "string", group: "nav" }),
    defineField({ name: "navProducts", title: "导航：Products", type: "string", group: "nav" }),
    defineField({ name: "navSolutions", title: "导航：Solutions", type: "string", group: "nav" }),
    defineField({ name: "navAbout", title: "导航：About", type: "string", group: "nav" }),
    defineField({ name: "navCustomize", title: "导航：Customize", type: "string", group: "nav" }),
    defineField({ name: "navBlog", title: "导航：Blog", type: "string", group: "nav" }),
    defineField({ name: "navContact", title: "导航：Contact", type: "string", group: "nav" }),
    defineField({ name: "brandName", title: "左上角品牌名", type: "string", group: "nav" }),
    defineField({
      name: "aboutButtonText",
      title: "关于我们按钮（Learn More）",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutTitle",
      title: "关于我们标题",
      type: "string",
      group: "about",
      description: "首页靠近底部的「关于我们」标题。",
    }),
    defineField({
      name: "aboutContent",
      title: "关于我们正文",
      type: "array",
      group: "about",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "aboutImage",
      title: "关于我们图片",
      type: "image",
      group: "about",
      description: "首页底部右侧工厂图。点击该图片区域可替换。",
      options: { hotspot: siteImageHotspot },
      fields: [imageAltField],
    }),
    defineField({ name: "footerEmail", title: "页脚邮箱", type: "string", group: "footer" }),
    defineField({
      name: "footerPhone",
      title: "页脚电话",
      type: "string",
      group: "footer",
      description: "固话和手机写在同一字段，用英文分号 ; 隔开，前台会自动分成两行。例如 +86-513-82899907; 0086 177 37095998",
    }),
    defineField({ name: "footerAddress", title: "页脚地址", type: "string", group: "footer" }),
    defineField({ name: "footerBlurb", title: "页脚简介", type: "text", group: "footer" }),
    defineField({
      name: "footerSocialLinks",
      title: "页脚社交链接",
      type: "array",
      group: "footer",
      description: "页脚右侧联系方式。WhatsApp / Email / Facebook / Instagram / YouTube。",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "WhatsApp", value: "WhatsApp" },
                  { title: "Email", value: "Email" },
                  { title: "Facebook", value: "Facebook" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "YouTube", value: "YouTube" },
                ],
              },
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
});
