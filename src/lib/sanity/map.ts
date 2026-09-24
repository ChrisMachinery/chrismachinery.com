import { vercelStegaClean } from "@vercel/stega";
import { externalVideoHref } from "@/lib/factoryVideoEmbed";
import type { Product, Axle, SeriesKey, StockStatus } from "@/data/products";
import { productOverallLength, productOverallWidth } from "@/data/products";
import { withFactorySpecs } from "@/data/productSpecs";
import type { Post } from "@/data/posts";
import { solutions as localSolutions } from "@/data/solutions";
import { equipmentLabels, resolveEquipmentIds } from "@/lib/solutionQuote";
import { cmsImageAlt } from "@/lib/advantageIcons";
import { imageUrl } from "./client";
import { cleanProductHref } from "@/lib/productUrl";

export type SanityProductDoc = {
  _id: string;
  title: string;
  slug: string;
  series: SeriesKey;
  size?: string;
  price?: number;
  sku?: string;
  stock?: string;
  stockStatus?: string;
  material?: string;
  materials?: string[];
  axles?: number;
  axle?: string;
  length?: number;
  width?: number;
  height?: number;
  overallLength?: number;
  overallWidth?: number;
  overallHeight?: number;
  weight?: number;
  loadCapacity?: number;
  shape?: string | string[];
  shapes?: string[];
  priceHigh?: number;
  year?: number;
  scene?: string;
  glassCount?: string;
  glassHeight?: string;
  images?: unknown[];
  mainImage?: unknown;
  gallery?: unknown[];
  description?: string;
  features?: string[];
  customOptions?: string[];
  viewProductText?: string;
  viewProductLink?: string;
  quoteText?: string;
  quoteLink?: string;
  customizeText?: string;
  customizeLink?: string;
};

export type SanityPostDoc = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: unknown;
  excerpt?: string;
  body?: unknown[];
  author?: string;
  publishedAt?: string;
  tags?: string[];
  category?: string;
};

export type PageContent = {
  _id?: string;
  _type?: string;
  homeHero?: {
    headline?: string;
    subheadline?: string;
    ctaQuote?: string;
    ctaProducts?: string;
  };
  aboutUs?: {
    title?: string;
    body?: string;
    factoryArea?: string;
    annualOutput?: string;
    technicians?: string;
    countries?: string;
  };
  footerInfo?: {
    blurb?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    hours?: string;
  };
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackground?: unknown;
  heroBackgroundUrl?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroSlides?: {
    _key?: string;
    title?: string;
    subtitle?: string;
    image?: unknown;
    imageUrl?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
  }[];
  aboutTitle?: string;
  aboutButtonText?: string;
  aboutContent?: unknown[];
  aboutImage?: unknown;
  aboutImageUrl?: string;
  footerEmail?: string;
  footerPhone?: string;
  footerAddress?: string;
  footerBlurb?: string;
  heroButtonProducts?: string;
  pageHeading?: string;
  pageLede?: string;
  advantagesTitle?: string;
  advantages?: { _key?: string; title?: string; body?: string; icon?: string; image?: unknown }[];
  productDetailsTitle?: string;
  productDetails?: { _key?: string; title?: string; body?: string; image?: unknown }[];
  detailShotsTitle?: string;
  detailShots?: { _key?: string; caption?: string; image?: unknown; imageUrl?: string; imageAlt?: string }[];
  hotSeriesTitle?: string;
  seriesCards?: { name?: string; caption?: string; href?: string; image?: unknown }[];
  footprintTitle?: string;
  testimonialsTitle?: string;
  testimonials?: {
    name?: string;
    country?: string;
    flag?: string;
    text?: string;
    photo?: unknown;
  }[];
  navHome?: string;
  navProducts?: string;
  navSolutions?: string;
  navAbout?: string;
  navCustomize?: string;
  navBlog?: string;
  navContact?: string;
  brandName?: string;
  logo?: unknown;
  logoUrl?: string;
  footerSocialLinks?: { platform?: string; url?: string }[];
  productCustomOptions?: string[];
};

const stockMap: Record<string, StockStatus> = {
  in_stock: "In Stock",
  made_to_order: "Made to Order",
  out_of_stock: "Out of Stock",
  "In Stock": "In Stock",
  "Made to Order": "Made to Order",
  "Out of Stock": "Out of Stock",
};

function parseSize(size?: string) {
  const match = vercelStegaClean(size || "").match(/(\d+)\s*[x×]\s*(\d+)(?:\s*[x×]\s*(\d+))?/i);
  return {
    length: match ? Number(match[1]) : 0,
    width: match ? Number(match[2]) : 0,
    height: match?.[3] ? Number(match[3]) : 0,
  };
}

const seriesKeys: SeriesKey[] = ["pod", "airstream", "square", "container", "capsule", "others"];

function normalizeSeries(value?: string): SeriesKey {
  const clean = vercelStegaClean(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  if (clean === "in-stock" || clean === "instock") return "others";
  if (clean === "ny" || clean === "ny-style" || clean === "nystyle") return "capsule";
  if (seriesKeys.includes(clean as SeriesKey)) return clean as SeriesKey;
  return "pod";
}

function imageObjectPosition(image: unknown): string | undefined {
  const hotspot = (image as { hotspot?: { x?: number; y?: number } } | null)?.hotspot;
  if (typeof hotspot?.x !== "number" || typeof hotspot?.y !== "number") return undefined;
  return `${Math.round(hotspot.x * 1000) / 10}% ${Math.round(hotspot.y * 1000) / 10}%`;
}

function mapAxle(doc: SanityProductDoc): Axle {
  const axle = vercelStegaClean(doc.axle || "").toLowerCase();
  if (axle.includes("tandem") || axle.includes("tamdem") || axle.includes("双轴") || doc.axles === 2) {
    return "Tandem Axle";
  }
  return "Single Axle";
}

function mapShape(value?: string) {
  const clean = vercelStegaClean(value || "");
  if (clean === "350 Arc") return "375 Arc";
  return clean || undefined;
}

function uniqueMaterials(doc: SanityProductDoc) {
  const raw = [...(Array.isArray(doc.materials) ? doc.materials : []), doc.material].filter(Boolean) as string[];
  return [...new Set(raw.map((item) => mapMaterial(String(item))).filter((item): item is string => Boolean(item)))];
}

function uniqueShapes(doc: SanityProductDoc) {
  const raw = [
    ...(Array.isArray(doc.shapes) ? doc.shapes : []),
    ...(Array.isArray(doc.shape) ? doc.shape : doc.shape ? [doc.shape] : []),
  ];
  return [...new Set(raw.map((item) => mapShape(String(item))).filter((item): item is string => Boolean(item)))];
}

function mapMaterial(value?: string) {
  const clean = vercelStegaClean(value || "");
  if (!clean) return undefined;
  const lower = clean.toLowerCase();
  if (lower === "painted" || lower === "paint") return "Paint";
  if (lower.includes("stainless")) return "Stainless steel";
  if (lower === "titanium") return "Titanium";
  return clean;
}

function mapProductImage(source: unknown) {
  const url = imageUrl(source);
  if (!url) return undefined;
  return { url, objectPosition: imageObjectPosition(source) };
}

function uniqueProductImages(sources: unknown[]) {
  const seen = new Set<string>();
  const images: { url: string; objectPosition?: string }[] = [];
  for (const source of sources) {
    const mapped = mapProductImage(source);
    if (!mapped || seen.has(mapped.url)) continue;
    seen.add(mapped.url);
    images.push(mapped);
  }
  return images;
}

export function mapSanityProduct(doc: SanityProductDoc): Product {
  const parsed = parseSize(doc.size);
  const image = doc.mainImage ?? doc.gallery?.[0] ?? doc.images?.[0];
  const mappedMain = mapProductImage(image);
  const price = doc.price ?? 0;
  const rawStock = vercelStegaClean(doc.stockStatus ?? doc.stock ?? "Made to Order");
  const slug = vercelStegaClean(doc.slug || "");
  const cleanList = (values?: string[]) =>
    values?.map((value) => vercelStegaClean(value)).filter(Boolean);

  return withFactorySpecs({
    _id: doc._id?.replace(/^drafts\./, ""),
    slug,
    sku: vercelStegaClean(doc.sku ?? slug),
    series: normalizeSeries(doc.series),
    name: doc.title,
    length: doc.length ?? parsed.length,
    width: doc.width ?? parsed.width,
    height: (doc.height ?? parsed.height) || undefined,
    overallLength: productOverallLength(doc.length ?? parsed.length) ?? doc.overallLength,
    overallWidth: productOverallWidth(doc.width ?? parsed.width) ?? doc.overallWidth,
    overallHeight: doc.overallHeight || undefined,
    weight: doc.weight || undefined,
    loadCapacity: doc.loadCapacity || undefined,
    size: doc.size ? vercelStegaClean(doc.size) : undefined,
    shape: uniqueShapes(doc)[0],
    shapes: uniqueShapes(doc),
    material: uniqueMaterials(doc)[0],
    materials: uniqueMaterials(doc),
    axle: mapAxle(doc),
    glassCount: doc.glassCount ? vercelStegaClean(doc.glassCount) : undefined,
    glassHeight: doc.glassHeight ? vercelStegaClean(doc.glassHeight) : undefined,
    stockStatus: stockMap[rawStock] ?? "Made to Order",
    priceLow: price,
    priceHigh: doc.priceHigh ?? price,
    description: doc.description ?? "",
    year: doc.year,
    scene: doc.scene ? vercelStegaClean(doc.scene) : undefined,
    imageUrl: mappedMain?.url,
    imageObjectPosition: mappedMain?.objectPosition,
    galleryImages: uniqueProductImages(doc.gallery ?? []),
    features: cleanList(doc.features),
    customOptions: cleanList(doc.customOptions),
    viewProductText: doc.viewProductText ? vercelStegaClean(doc.viewProductText) : undefined,
    viewProductLink: doc.viewProductLink
      ? cleanProductHref(vercelStegaClean(doc.viewProductLink), doc.series, doc.slug) || undefined
      : undefined,
    quoteText: doc.quoteText ? vercelStegaClean(doc.quoteText) : undefined,
    quoteLink: doc.quoteLink ? vercelStegaClean(doc.quoteLink) : undefined,
    customizeText: doc.customizeText ? vercelStegaClean(doc.customizeText) : undefined,
    customizeLink: doc.customizeLink ? vercelStegaClean(doc.customizeLink) : undefined,
  });
}

const categories = ["Buying Guide", "Industry News", "Case Study"] as const;

export function mapSanityPost(doc: SanityPostDoc): Post {
  const tag = doc.tags?.find((item) => categories.includes(item as (typeof categories)[number]));
  const category = categories.includes(doc.category as (typeof categories)[number])
    ? (doc.category as Post["category"])
    : ((tag as Post["category"]) ?? "Industry News");
  return {
    _id: doc._id?.replace(/^drafts\./, ""),
    slug: vercelStegaClean(doc.slug || "").toLowerCase(),
    title: doc.title,
    excerpt: doc.excerpt ?? "",
    author: doc.author ?? "Chris Machinery",
    date: (doc.publishedAt ?? "").slice(0, 10),
    category,
    body: "",
    coverUrl: imageUrl(doc.coverImage),
    bodyBlocks: doc.body,
    tags: doc.tags,
  };
}

function blocksToText(blocks?: unknown[]) {
  if (!blocks?.length) return "";
  return blocks
    .map((raw) => {
      const block = raw as { children?: { text?: string }[] };
      return (block.children ?? []).map((child) => child.text ?? "").join("");
    })
    .filter(Boolean)
    .join("\n");
}

export function normalizePageContent(doc: PageContent | null): PageContent | null {
  if (!doc) return null;
  return {
    ...doc,
    heroBackgroundUrl: imageUrl(doc.heroBackground),
    aboutImageUrl: imageUrl(doc.aboutImage),
    logoUrl: imageUrl(doc.logo, 256),
    productCustomOptions: (doc.productCustomOptions ?? [])
      .map((item) => vercelStegaClean(item))
      .filter(Boolean),
    homeHero: {
      headline: doc.heroTitle && doc.heroTitle !== "home" ? doc.heroTitle : doc.homeHero?.headline,
      subheadline: doc.heroSubtitle ?? doc.homeHero?.subheadline,
      ctaQuote: doc.heroButtonText ?? doc.homeHero?.ctaQuote,
      ctaProducts: doc.heroButtonProducts ?? doc.homeHero?.ctaProducts,
    },
    heroSlides: (doc.heroSlides ?? []).map((slide) => ({
      ...slide,
      imageUrl: imageUrl(slide.image, 2400),
    })),
    detailShots: (doc.detailShots ?? []).map((shot) => ({
      ...shot,
      imageUrl: imageUrl(shot.image, 1200),
      imageAlt: cmsImageAlt(shot.image),
    })),
    aboutUs: {
      title: doc.aboutTitle ?? doc.aboutUs?.title,
      body: blocksToText(doc.aboutContent) || doc.aboutUs?.body,
      factoryArea: doc.aboutUs?.factoryArea,
      annualOutput: doc.aboutUs?.annualOutput,
      technicians: doc.aboutUs?.technicians,
      countries: doc.aboutUs?.countries,
    },
    footerInfo: {
      blurb: doc.footerInfo?.blurb,
      address: doc.footerAddress ?? doc.footerInfo?.address,
      email: doc.footerEmail ?? doc.footerInfo?.email,
      phone: doc.footerPhone ?? doc.footerInfo?.phone,
      whatsapp: doc.footerInfo?.whatsapp,
      hours: doc.footerInfo?.hours,
    },
  };
}

export type SitePageDoc = {
  _id: string;
  path: string;
  title: string;
  subtitle?: string;
  heroImage?: unknown;
  factoryArea?: string;
  annualOutput?: string;
  technicians?: string;
  countries?: string;
  factoryTitle?: string;
  factoryBody?: string;
  factoryVideoUrl?: string;
  buildTitle?: string;
  buildIntro?: string;
  buildSteps?: { title?: string; body?: string; images?: unknown[]; image?: unknown }[];
  flowImages?: unknown[];
  certImages?: unknown[];
  gallery?: unknown[];
  logos?: unknown[];
  mapImage?: unknown;
  mapEmbedUrl?: string;
  qrImage?: unknown;
  address?: string;
  faqTitle?: string;
  faq?: { question?: string; answer?: string }[];
  included?: string[];
  customizable?: string[];
  arcGuideTitle?: string;
  arcGuideNote?: string;
  arcGuides?: { _key?: string; label?: string; body?: string; image?: unknown }[];
  customerPhotosTitle?: string;
  customerPhotos?: { _key?: string; image?: unknown; imageAlt?: string }[];
  podGuide?: {
    introTitle?: string;
    intro?: string;
    shapeBody?: string;
    introImage?: unknown;
    tocCompare?: string;
    tocSize?: string;
    tocKitchen?: string;
    tocFaq?: string;
    tocModels?: string;
    sizeTitle?: string;
    sizeNote?: string;
    sizeRows?: {
      scene?: string;
      length?: string;
      width?: string;
      axle?: string;
      shape?: string;
      material?: string;
      note?: string;
      exampleLabel?: string;
      exampleHref?: string;
      image?: unknown;
    }[];
    kitchenTitle?: string;
    kitchenBody?: string;
    kitchenImage?: unknown;
    kitchenLinkLabel?: string;
    kitchenLinkHref?: string;
    quoteLabel?: string;
    quoteHref?: string;
    faqTitle?: string;
    faq?: { question?: string; answer?: string }[];
  };
};

export function mapSitePage(doc: SitePageDoc) {
  const img = (source?: unknown) => imageUrl(source);
  return {
    _id: doc._id?.replace(/^drafts\./, ""),
    path: doc.path,
    title: doc.title,
    subtitle: doc.subtitle,
    heroImageUrl: img(doc.heroImage),
    factoryArea: doc.factoryArea,
    annualOutput: doc.annualOutput,
    technicians: doc.technicians,
    countries: doc.countries,
    factoryTitle: doc.factoryTitle,
    factoryBody: doc.factoryBody,
    factoryVideoUrl: doc.factoryVideoUrl ? vercelStegaClean(doc.factoryVideoUrl) : undefined,
    buildTitle: doc.buildTitle,
    buildIntro: doc.buildIntro,
    buildSteps: (doc.buildSteps ?? []).map((step) => ({
      title: step.title,
      body: step.body,
      imageUrls: [0, 1, 2].map((i) => img(step.images?.[i]) || (i === 0 ? img(step.image) : undefined)),
    })),
    flowImageUrls: (doc.flowImages ?? []).map((item) => img(item)),
    certImageUrls: (doc.certImages ?? []).map((item) => img(item)),
    galleryUrls: (doc.gallery ?? []).map((item) => img(item)),
    logoUrls: (doc.logos ?? []).map((item) => img(item)),
    mapImageUrl: img(doc.mapImage),
    mapEmbedUrl: doc.mapEmbedUrl ? vercelStegaClean(doc.mapEmbedUrl) : undefined,
    qrImageUrl: img(doc.qrImage),
    address: doc.address,
    faqTitle: doc.faqTitle,
    faq: doc.faq,
    included: (doc.included ?? []).map((item) => vercelStegaClean(item)).filter(Boolean),
    customizable: (doc.customizable ?? []).map((item) => vercelStegaClean(item)).filter(Boolean),
    arcGuideTitle: doc.arcGuideTitle ? vercelStegaClean(doc.arcGuideTitle) : undefined,
    arcGuideNote: doc.arcGuideNote ? vercelStegaClean(doc.arcGuideNote) : undefined,
    customerPhotosTitle: doc.customerPhotosTitle,
    customerPhotos: (doc.customerPhotos ?? []).map((shot) => ({
      imageUrl: imageUrl(shot.image, 1200),
      imageAlt: cmsImageAlt(shot.image),
    })),
    arcGuides: (doc.arcGuides ?? []).map((item) => ({
      _key: item._key,
      label: item.label ? vercelStegaClean(item.label) : undefined,
      body: item.body ? vercelStegaClean(item.body) : undefined,
      imageUrl: imageUrl(item.image, 1000),
      imageAlt:
        item.image && typeof item.image === "object" && "alt" in item.image
          ? vercelStegaClean(String((item.image as { alt?: string }).alt || ""))
          : undefined,
    })),
    podGuide: doc.podGuide
      ? {
          introTitle: doc.podGuide.introTitle,
          intro: doc.podGuide.intro,
          shapeBody: doc.podGuide.shapeBody,
          introImageUrl: img(doc.podGuide.introImage),
          introImageAlt: cmsImageAlt(doc.podGuide.introImage),
          tocCompare: doc.podGuide.tocCompare,
          tocSize: doc.podGuide.tocSize,
          tocKitchen: doc.podGuide.tocKitchen,
          tocFaq: doc.podGuide.tocFaq,
          tocModels: doc.podGuide.tocModels,
          sizeTitle: doc.podGuide.sizeTitle,
          sizeNote: doc.podGuide.sizeNote,
          sizeRows: (doc.podGuide.sizeRows ?? []).map((row) => ({
            scene: row.scene,
            length: row.length,
            width: row.width,
            axle: row.axle,
            shape: row.shape,
            material: row.material,
            note: row.note,
            exampleLabel: row.exampleLabel,
            exampleHref: row.exampleHref ? vercelStegaClean(row.exampleHref) : "",
            imageUrl: imageUrl(row.image, 1200),
            imageAlt: cmsImageAlt(row.image),
          })),
          kitchenTitle: doc.podGuide.kitchenTitle,
          kitchenBody: doc.podGuide.kitchenBody,
          kitchenImageUrl: img(doc.podGuide.kitchenImage),
          kitchenImageAlt: cmsImageAlt(doc.podGuide.kitchenImage),
          kitchenLinkLabel: doc.podGuide.kitchenLinkLabel,
          kitchenLinkHref: doc.podGuide.kitchenLinkHref
            ? vercelStegaClean(doc.podGuide.kitchenLinkHref)
            : "",
          quoteLabel: doc.podGuide.quoteLabel,
          quoteHref: doc.podGuide.quoteHref ? vercelStegaClean(doc.podGuide.quoteHref) : "",
          faqTitle: doc.podGuide.faqTitle,
          faq: doc.podGuide.faq,
        }
      : undefined,
  };
}

function hrefFromUrl(url?: string) {
  const trimmed = vercelStegaClean(url || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/")) return trimmed;
  try {
    return new URL(trimmed).pathname || trimmed;
  } catch {
    return trimmed.startsWith("http") ? trimmed : `/${trimmed.replace(/^\/+/, "")}`;
  }
}

export type SanitySolutionDoc = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  equipment?: string[];
  advice?: string;
  lede?: string;
  content?: unknown[];
  recommendedSlugs?: string[];
  sceneImage?: unknown;
  icon?: unknown;
  featuredProducts?: {
    _id?: string;
    title?: string;
    slug?: string;
    series?: string;
  }[];
  recommendedModels?: {
    label?: string;
    url?: string;
    product?: {
      _id?: string;
      title?: string;
      slug?: string;
      series?: string;
    };
  }[];
};

export type RecommendedProductLink = {
  _id?: string;
  name: string;
  slug: string;
  series: string;
  href: string;
};

export function mapSanitySolution(doc: SanitySolutionDoc) {
  const fromModels = (doc.recommendedModels ?? [])
    .map((item, index) => {
      const product = item.product;
      const slug = vercelStegaClean(product?.slug || "");
      const series = normalizeSeries(product?.series);
      const href = hrefFromUrl(item.url) || (slug ? `/products/${series}/${slug}` : "");
      if (!href) return null;
      return {
        _id: product?._id?.replace(/^drafts\./, ""),
        name: item.label || product?.title || slug || `Model ${index + 1}`,
        slug: slug || href,
        series,
        href,
      } satisfies RecommendedProductLink;
    })
    .filter(Boolean) as RecommendedProductLink[];

  const fromRefs = (doc.featuredProducts ?? [])
    .filter((item) => item?.slug)
    .map((item) => {
      const slug = vercelStegaClean(item.slug || "");
      const series = normalizeSeries(item.series);
      return {
        _id: item._id?.replace(/^drafts\./, ""),
        name: item.title || slug,
        slug,
        series,
        href: `/products/${series}/${slug}`,
      } satisfies RecommendedProductLink;
    });

  const equipmentIds = resolveEquipmentIds(
    doc.equipment?.length
      ? doc.equipment
      : localSolutions.find((item) => item.slug === doc.slug)?.equipment,
  );

  return {
    _id: doc._id?.replace(/^drafts\./, ""),
    slug: doc.slug,
    name: doc.title,
    recommended: doc.recommendedSlugs ?? [],
    recommendedProducts: fromModels.length ? fromModels : fromRefs,
    equipmentIds,
    equipment: equipmentLabels(equipmentIds),
    advice: doc.advice ?? doc.description ?? "",
    lede: typeof doc.lede === "string" ? doc.lede : "",
    content: Array.isArray(doc.content) ? doc.content : [],
    imageUrl: imageUrl(doc.sceneImage) || imageUrl(doc.icon),
  };
}

export type SanityStockUnitDoc = {
  _id?: string;
  title?: string;
  quantity?: number;
  colorMaterial?: string;
  bodyDimension?: string;
  include?: string;
  summary?: string;
  videoUrl?: string;
  photos?: unknown[];
  product?: { _id?: string; title?: string; slug?: string; series?: string };
};

export type StockCard = {
  _id: string;
  model: string;
  quantity: number;
  colorMaterial: string;
  bodyDimension: string;
  include: string;
  videoUrl?: string;
  photos: { url?: string; alt?: string }[];
  productSlug?: string;
  productHref?: string;
};

export function mapStockUnit(doc: SanityStockUnitDoc): StockCard {
  const series = vercelStegaClean(doc.product?.series || "");
  const slug = vercelStegaClean(doc.product?.slug || "");
  return {
    _id: (doc._id || "").replace(/^drafts\./, ""),
    model: vercelStegaClean(doc.title || doc.product?.title || ""),
    quantity: Number(doc.quantity) > 0 ? Math.floor(Number(doc.quantity)) : 1,
    colorMaterial: vercelStegaClean(doc.colorMaterial || ""),
    bodyDimension: vercelStegaClean(doc.bodyDimension || ""),
    include: vercelStegaClean(doc.include || doc.summary || ""),
    videoUrl: externalVideoHref(vercelStegaClean(doc.videoUrl || "")) || undefined,
    photos: (doc.photos ?? []).map((photo) => ({
      url: imageUrl(photo, 1600) || undefined,
      alt: cmsImageAlt(photo),
    })),
    productSlug: slug || undefined,
    productHref: slug && series ? `/products/${series}/${slug}` : undefined,
  };
}
