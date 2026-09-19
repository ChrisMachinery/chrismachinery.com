import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { defaultCustomOptions, productOverallLength, productOverallWidth, products, seriesCustomizable, seriesIncluded } from "../src/data/products";
import { posts } from "../src/data/posts";
import { solutions } from "../src/data/solutions";
import { equipment, trailerExtras } from "../src/data/catalog";
import { seriesMeta } from "../src/lib/site";
import { AIRSTREAM_ARC_GUIDE_DEFAULTS } from "../src/lib/airstreamArc";
import { POD_SHAPE_GUIDE_DEFAULTS } from "../src/lib/podShapeGuide";
import { isGuideSeries, seedSeriesGuide, type GuideSeries } from "../src/lib/seriesGuides";

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function blocks(text: string) {
  return text.split(/\n+/).filter(Boolean).map((line, index) => ({
    _type: "block" as const,
    _key: `b${index}`,
    style: line.startsWith("## ") ? "h2" : "normal",
    markDefs: [],
    children: [
      {
        _type: "span" as const,
        _key: `s${index}`,
        text: line.replace(/^## /, "").replace(/^- /, ""),
        marks: [],
      },
    ],
  }));
}

async function main() {
  loadEnv();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is missing in .env.local");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-21",
    token,
    useCdn: false,
  });

  const docs: Record<string, unknown>[] = [];

  docs.push({
    _id: "pageContent",
    _type: "pageContent",
    slug: { _type: "slug", current: "home" },
    heroTitle: "Factory-built food trailers, specified for real kitchens.",
    heroSubtitle:
      "Hot-dip galvanized chassis, 1-year warranty, drawings and quotes within 24 hours.",
    heroButtonText: "Get a Quote",
    heroButtonLink: "/contact",
    productCustomOptions: defaultCustomOptions,
    heroSlides: [
      {
        _key: "hero1",
        _type: "heroSlide",
        title: "Factory-built food trailers, specified for real kitchens.",
        subtitle:
          "Hot-dip galvanized chassis, 1-year warranty, drawings and quotes within 24 hours.",
        primaryButtonText: "Get a Quote",
        primaryButtonLink: "/contact",
        secondaryButtonText: "View Products",
        secondaryButtonLink: "/products/pod",
      },
      {
        _key: "hero2",
        _type: "heroSlide",
        title: "Pod and Airstream series, wrap-ready from the factory.",
        subtitle: "Compact street setups with stainless interiors and export packing included.",
        primaryButtonText: "Get a Quote",
        primaryButtonLink: "/contact",
        secondaryButtonText: "View Products",
        secondaryButtonLink: "/products/airstream",
      },
      {
        _key: "hero3",
        _type: "heroSlide",
        title: "Galvanized chassis built for daily service.",
        subtitle: "CE-ready frames, 1-year warranty, and QC photos before shipment.",
        primaryButtonText: "Get a Quote",
        primaryButtonLink: "/contact",
        secondaryButtonText: "View Products",
        secondaryButtonLink: "/products/square",
      },
      {
        _key: "hero4",
        _type: "heroSlide",
        title: "Custom layouts. Drawings and quotes within 24 hours.",
        subtitle: "Tell us the kitchen plan — we spec length, windows, and equipment layout.",
        primaryButtonText: "Get a Quote",
        primaryButtonLink: "/contact",
        secondaryButtonText: "Customize",
        secondaryButtonLink: "/customize",
      },
    ],
    aboutTitle: "About Chris Machinery",
  });

  for (const item of products) {
    docs.push({
      _id: `product-${item.slug}`,
      _type: "product",
      title: item.name,
      slug: { _type: "slug", current: item.slug },
      series: item.series,
      description: item.description,
      sku: item.sku,
      price: item.priceLow,
      priceHigh: item.priceHigh,
      length: item.length,
      width: item.width,
      height: item.height,
      overallLength: productOverallLength(item.length),
      overallWidth: productOverallWidth(item.width),
      overallHeight: item.overallHeight,
      weight: item.weight,
      loadCapacity: item.loadCapacity,
      axle: item.axle,
      material: item.material,
      materials: item.material ? [item.material] : undefined,
      shape: item.shape,
      stockStatus: item.stockStatus,
      features: item.features,
      year: item.year,
      scene: item.scene,
      glassCount: item.glassCount,
      glassHeight: item.glassHeight,
    });
  }

  for (const post of posts) {
    docs.push({
      _id: `post-${post.slug}`,
      _type: "blogPost",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      author: post.author,
      publishedAt: `${post.date}T00:00:00.000Z`,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags,
      body: blocks(post.body),
    });
  }

  for (const item of solutions) {
    docs.push({
      _id: `solution-${item.slug}`,
      _type: "solution",
      title: item.name,
      slug: { _type: "slug", current: item.slug },
      description: item.advice,
      advice: item.advice,
      equipment: item.equipment,
      recommendedSlugs: item.recommended,
    });
  }

  docs.push({
    _id: "customizeCatalog",
    _type: "customizeCatalog",
    title: "Customize catalog",
    trailerExtras: trailerExtras.map((item, index) => ({
      _type: "trailerExtra",
      _key: `extra${index}`,
      itemId: item.id,
      name: item.name,
      price: item.price,
    })),
    kitchenEquipment: equipment.map((item, index) => ({
      _type: "kitchenEquipmentItem",
      _key: `kit${index}`,
      itemId: item.id,
      category: item.category,
      name: item.name,
      price: item.price,
    })),
  });

  const pages: { path: string; title: string; subtitle: string; extra?: Record<string, unknown> }[] = [
    {
      path: "/about",
      title: "About Us",
      subtitle: "5,000㎡ factory, 200+ units per year, 50+ technicians, 30+ export markets.",
      extra: {
        factoryArea: "5,000㎡",
        annualOutput: "200+ Units",
        technicians: "50+",
        countries: "30+",
      },
    },
    {
      path: "/solutions",
      title: "Solutions",
      subtitle: "Scene-based packages with recommended chassis, equipment lists, and a one-click quote.",
    },
    {
      path: "/blog",
      title: "Blog",
      subtitle: "Buying guides, industry news, and customer case studies.",
    },
    {
      path: "/contact",
      title: "Contact",
      subtitle: "Factory quotes within 24 hours. WhatsApp, email, and inquiry form.",
    },
    {
      path: "/customize",
      title: "Customize your food trailer",
      subtitle: "Choose series, size, colors, logo and kitchen equipment, then send a factory inquiry.",
    },
    {
      path: "/products/in-stock",
      title: "In Stock Food Trailers",
      subtitle: "Ready-to-ship units across series. Sold units disappear automatically when stock status changes.",
    },
  ];

  for (const [series, meta] of Object.entries(seriesMeta)) {
    pages.push({
      path: `/products/${series}`,
      title: meta.name,
      subtitle: meta.blurb,
      extra: {
        included: seriesIncluded[series as keyof typeof seriesIncluded],
        customizable: seriesCustomizable[series as keyof typeof seriesCustomizable],
        ...(series === "airstream"
          ? {
              arcGuideTitle: AIRSTREAM_ARC_GUIDE_DEFAULTS.title,
              arcGuideNote: AIRSTREAM_ARC_GUIDE_DEFAULTS.note,
              arcGuides: AIRSTREAM_ARC_GUIDE_DEFAULTS.items.map((item, index) => ({
                _key: `arc${index}`,
                _type: "object",
                label: item.label,
                body: item.body,
              })),
            }
          : series === "pod"
            ? {
                arcGuideTitle: POD_SHAPE_GUIDE_DEFAULTS.title,
                arcGuideNote: POD_SHAPE_GUIDE_DEFAULTS.note,
                arcGuides: POD_SHAPE_GUIDE_DEFAULTS.items.map((item, index) => ({
                  _key: `shape${index}`,
                  _type: "object",
                  label: item.label,
                  body: item.body,
                })),
              }
            : {}),
        ...(isGuideSeries(series) ? { podGuide: seedSeriesGuide(series as GuideSeries) } : {}),
      },
    });
  }

  for (const page of pages) {
    docs.push({
      _id: `sitePage${page.path.replaceAll("/", "-")}`,
      _type: "sitePage",
      path: page.path,
      title: page.title,
      subtitle: page.subtitle,
      ...page.extra,
    });
  }

  docs.push({
    _id: "stockBoard",
    _type: "stockBoard",
    title: "现货卡片",
    cards: [],
  });

  let created = 0;
  for (const doc of docs) {
    await client.createIfNotExists(doc as { _id: string; _type: string });
    created += 1;
  }

  const home = await client.getDocument("pageContent");
  const slides = [
    {
      _key: "hero1",
      _type: "heroSlide",
      title: "Factory-built food trailers, specified for real kitchens.",
      subtitle:
        "Hot-dip galvanized chassis, 1-year warranty, drawings and quotes within 24 hours.",
      primaryButtonText: "Get a Quote",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Products",
      secondaryButtonLink: "/products/pod",
    },
    {
      _key: "hero2",
      _type: "heroSlide",
      title: "Pod and Airstream series, wrap-ready from the factory.",
      subtitle: "Compact street setups with stainless interiors and export packing included.",
      primaryButtonText: "Get a Quote",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Products",
      secondaryButtonLink: "/products/airstream",
    },
    {
      _key: "hero3",
      _type: "heroSlide",
      title: "Galvanized chassis built for daily service.",
      subtitle: "CE-ready frames, 1-year warranty, and QC photos before shipment.",
      primaryButtonText: "Get a Quote",
      primaryButtonLink: "/contact",
      secondaryButtonText: "View Products",
      secondaryButtonLink: "/products/square",
    },
    {
      _key: "hero4",
      _type: "heroSlide",
      title: "Custom layouts. Drawings and quotes within 24 hours.",
      subtitle: "Tell us the kitchen plan — we spec length, windows, and equipment layout.",
      primaryButtonText: "Get a Quote",
      primaryButtonLink: "/contact",
      secondaryButtonText: "Customize",
      secondaryButtonLink: "/customize",
    },
  ];
  if (home && (!Array.isArray(home.heroSlides) || home.heroSlides.length < 4)) {
    await client.patch("pageContent").set({ heroSlides: slides }).commit();
  }
  if (home && (!Array.isArray(home.productCustomOptions) || home.productCustomOptions.length === 0)) {
    await client.patch("pageContent").set({ productCustomOptions: defaultCustomOptions }).commit();
  }

  for (const series of Object.keys(seriesMeta)) {
    const id = `sitePage-products-${series}`;
    await client
      .patch(id)
      .set({
        included: seriesIncluded[series as keyof typeof seriesIncluded],
        customizable: seriesCustomizable[series as keyof typeof seriesCustomizable],
      })
      .commit();
    if (isGuideSeries(series)) {
      const existing = await client.getDocument(id);
      const hasGuide = Boolean((existing as { podGuide?: unknown } | undefined)?.podGuide);
      if (!hasGuide) {
        await client.patch(id).set({ podGuide: seedSeriesGuide(series as GuideSeries) }).commit();
      }
    }
  }

  console.log(`Seeded ${created} documents into ${projectId}/${dataset} (existing docs were kept).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
