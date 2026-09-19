import { cache } from "react";
import { draftMode } from "next/headers";
import { posts as localPosts } from "@/data/posts";
import { solutions as localSolutions } from "@/data/solutions";
import {
  getProduct as getLocalProduct,
  inStockProducts as localInStock,
  liveProducts,
  type Product,
  type SeriesKey,
} from "@/data/products";
import { groupProductsByFamily, productFamilyKey, withFamilyShapes } from "@/lib/productFamily";
import { equipment, trailerExtras, type EquipmentItem, type TrailerExtra } from "@/data/catalog";
import { equipmentLabels } from "@/lib/solutionQuote";
import { client, getSanityClient, isSanityConfigured } from "./client";
import {
  mapSanityPost,
  mapSanityProduct,
  mapSanitySolution,
  mapSitePage,
  mapStockUnit,
  normalizePageContent,
  type PageContent,
  type SanityPostDoc,
  type SanityProductDoc,
  type SanitySolutionDoc,
  type SanityStockUnitDoc,
  type SitePageDoc,
} from "./map";
import {
  blogPostBySlugQuery,
  blogPostsQuery,
  pageContentQuery,
  productBySlugQuery,
  productIdBySlugQuery,
  productsQuery,
  sitePageByPathQuery,
  sitePagesByPathsQuery,
  solutionsQuery,
  solutionsBoardQuery,
  stockBoardQuery,
  customizeCatalogQuery,
} from "./queries";

const FETCH_TIMEOUT_MS = 8000;

async function isDraftModeEnabled() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Sanity fetch timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function querySanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  options?: { stega?: boolean; useCdn?: boolean },
): Promise<T | null> {
  if (!isSanityConfigured()) return null;
  const isDraft = await isDraftModeEnabled();
  const stega = { enabled: options?.stega ?? isDraft };
  const useCdn = options?.useCdn ?? !isDraft;
  if (isDraft) {
    const tokens = [process.env.SANITY_API_WRITE_TOKEN, process.env.SANITY_API_READ_TOKEN].filter(
      (value): value is string => Boolean(value),
    );
    for (const token of tokens) {
      try {
        return await withTimeout(
          client
            .withConfig({
              useCdn: false,
              token,
              perspective: "drafts",
              stega,
            })
            .fetch<T>(query, params),
          FETCH_TIMEOUT_MS,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (!message.includes("project user not found")) {
          console.warn("[sanity] draft fetch failed", message);
        }
      }
    }
  }

  try {
    return await withTimeout(
      client
        .withConfig({
          useCdn,
          token: undefined,
          perspective: "published",
          stega,
        })
        .fetch<T>(query, params),
      FETCH_TIMEOUT_MS,
    );
  } catch {
    return null;
  }
}

function catalogDedupeKey(item: Product) {
  const sku = item.sku?.trim().toLowerCase();
  if (sku) return `sku:${sku}`;
  return ["spec", productFamilyKey(item), item.slug].join("|");
}

function dedupeCatalog(products: Product[]) {
  const seen = new Set<string>();
  const next: Product[] = [];
  for (const item of products) {
    const key = catalogDedupeKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(item);
  }
  return next;
}

async function fetchMappedProducts(): Promise<Product[] | null> {
  const docs = await querySanity<SanityProductDoc[]>(productsQuery, {}, { stega: false });
  if (!docs?.length) return null;
  return dedupeCatalog(docs.map(mapSanityProduct));
}

const catalogOnce = cache(async () => {
  const docs = await fetchMappedProducts();
  const list = docs?.length ? docs : localCatalog();
  return groupProductsByFamily(list);
});

function localCatalog() {
  return liveProducts().map((item) => ({ ...item, _id: `product-${item.slug}` }));
}

export async function getCatalogProducts(): Promise<Product[]> {
  return catalogOnce();
}

export async function getProductsBySeries(series: SeriesKey): Promise<Product[]> {
  const all = await getCatalogProducts();
  return all
    .filter((item) => item.series === series)
    .sort((a, b) => (series === "others" ? (b.year ?? 0) - (a.year ?? 0) : a.length - b.length));
}

export async function getInStockProducts(): Promise<Product[]> {
  if (!isSanityConfigured()) {
    return groupProductsByFamily(localInStock().map((item) => ({ ...item, _id: `product-${item.slug}` })));
  }
  const all = await fetchMappedProducts();
  if (!all) {
    return groupProductsByFamily(localInStock().map((item) => ({ ...item, _id: `product-${item.slug}` })));
  }
  return groupProductsByFamily(all.filter((item) => item.stockStatus === "In Stock")).sort(
    (a, b) => a.length - b.length,
  );
}

export async function getCatalogProduct(slug: string): Promise<Product | undefined> {
  const catalog = await catalogOnce();
  const product = catalog.find((item) => item.slug === slug) ?? (getLocalProduct(slug)
    ? { ...getLocalProduct(slug)!, _id: `product-${slug}` }
    : undefined);
  if (!product) return undefined;
  return withFamilyShapes(product, catalog);
}

export async function getSitePage(path: string) {
  const doc = await querySanity<SitePageDoc | null>(sitePageByPathQuery, { path });
  return doc?._id ? mapSitePage(doc) : null;
}

export async function getSitePagesByPaths(paths: string[]) {
  const docs = await querySanity<{ _id: string; path: string; title?: string }[]>(
    sitePagesByPathsQuery,
    { paths },
  );
  return docs ?? [];
}

export type CustomizeOptions = {
  extras: TrailerExtra[];
  kitchen: EquipmentItem[];
};

function mapCustomizeOptions(doc?: {
  trailerExtras?: { itemId?: string; name?: string; price?: number }[];
  kitchenEquipment?: { itemId?: string; category?: string; name?: string; price?: number }[];
} | null): CustomizeOptions {
  const extras = (doc?.trailerExtras ?? [])
    .filter((item) => item.itemId && item.name)
    .map((item) => ({ id: item.itemId!, name: item.name!, price: Number(item.price) || 0 }));
  const kitchen = (doc?.kitchenEquipment ?? [])
    .filter((item) => item.itemId && item.name)
    .map((item) => ({
      id: item.itemId!,
      category: item.category || "Furniture",
      name: item.name!,
      price: Number(item.price) || 0,
    }));
  return {
    extras: extras.length ? extras : trailerExtras,
    kitchen: kitchen.length ? kitchen : equipment,
  };
}

export const getCustomizeOptions = cache(async (): Promise<CustomizeOptions> => {
  const doc = await querySanity<{
    trailerExtras?: { itemId?: string; name?: string; price?: number }[];
    kitchenEquipment?: { itemId?: string; category?: string; name?: string; price?: number }[];
  } | null>(customizeCatalogQuery, {});
  return mapCustomizeOptions(doc);
});

const getSolutionsBoardDoc = cache(async () =>
  querySanity<{ _id?: string; cards?: SanitySolutionDoc[] | null } | null>(
    solutionsBoardQuery,
    {},
    { stega: false },
  ),
);

export async function getSolutionsBoardId() {
  const board = await getSolutionsBoardDoc();
  return board?._id?.replace(/^drafts\./, "") || "solutionsBoard";
}

export async function getSolutions() {
  const [options, board, docs, catalog] = await Promise.all([
    getCustomizeOptions(),
    getSolutionsBoardDoc(),
    querySanity<SanitySolutionDoc[]>(solutionsQuery, {}, { stega: false }),
    catalogOnce(),
  ]);
  const listed = (board?.cards ?? []).filter((item): item is SanitySolutionDoc => Boolean(item?.slug));
  const source = listed.length ? listed : docs;
  const mapped = source?.length
    ? source.map(mapSanitySolution)
    : localSolutions.map((item) => ({
        ...item,
        _id: `solution-${item.slug}`,
        equipmentIds: item.equipment,
        equipment: equipmentLabels(item.equipment, options.kitchen),
        recommendedProducts: [] as ReturnType<typeof mapSanitySolution>["recommendedProducts"],
      }));

  return mapped.map((item) => {
    const equipment = equipmentLabels(item.equipmentIds ?? item.equipment, options.kitchen);
    if (item.recommendedProducts.length) return { ...item, equipment };
    const recommendedProducts = (item.recommended ?? [])
      .map((slug) => catalog.find((product) => product.slug === slug) ?? getLocalProduct(slug))
      .filter((product): product is Product => Boolean(product))
      .map((product) => ({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        series: product.series,
        href: `/products/${product.series}/${product.slug}`,
      }));
    return { ...item, equipment, recommendedProducts };
  });
}

const getStockBoardDoc = cache(async () =>
  querySanity<{ _id?: string; cards?: SanityStockUnitDoc[] | null } | null>(
    stockBoardQuery,
    {},
    { stega: false },
  ),
);

export async function getStockBoardId() {
  const board = await getStockBoardDoc();
  return board?._id?.replace(/^drafts\./, "") || "stockBoard";
}

export async function getStockCards() {
  const board = await getStockBoardDoc();
  return (board?.cards ?? [])
    .filter((item): item is SanityStockUnitDoc => Boolean(item?._id || item?.title))
    .map(mapStockUnit);
}

export async function getBlogPosts() {
  const docs = await querySanity<SanityPostDoc[]>(blogPostsQuery, {}, { useCdn: false });
  if (docs?.length) return docs.map(mapSanityPost);
  return localPosts.map((item) => ({ ...item, _id: `post-${item.slug}` }));
}

export async function getBlogPost(slug: string) {
  const doc = await querySanity<SanityPostDoc | null>(blogPostBySlugQuery, { slug }, { useCdn: false });
  if (doc?.slug) return mapSanityPost(doc);
  const local = localPosts.find((item) => item.slug === slug);
  return local ? { ...local, _id: `post-${local.slug}` } : undefined;
}

export const getPageContent = cache(async (): Promise<PageContent | null> => {
  const doc = await querySanity<PageContent | null>(pageContentQuery, {});
  return normalizePageContent(doc);
});

export async function createSanityInquiry(input: {
  inquiryId: string;
  name?: string;
  email: string;
  phone?: string;
  country: string;
  productName?: string;
  productSlug?: string;
  series?: string;
  sizeLabel?: string;
  solutionName?: string;
  shape?: string;
  material?: string;
  message?: string;
  createdAt: string;
}) {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  const writeClient = getSanityClient({ useCdn: false, token });
  if (!writeClient || !token) return null;

  let productRef: { _type: "reference"; _ref: string } | undefined;
  if (input.productSlug) {
    const id = await writeClient.fetch<string | null>(productIdBySlugQuery, { slug: input.productSlug });
    if (id) productRef = { _type: "reference", _ref: id };
  }

  return writeClient.create({
    _type: "inquiry",
    inquiryId: input.inquiryId,
    createdAt: input.createdAt,
    country: input.country,
    name: input.name || undefined,
    productName: input.productName || undefined,
    productSlug: input.productSlug || undefined,
    series: input.series || undefined,
    sizeLabel: input.sizeLabel || undefined,
    solutionName: input.solutionName || undefined,
    email: input.email,
    phone: input.phone || undefined,
    product: productRef,
    shape: input.shape || undefined,
    material: input.material || undefined,
    message: input.message || undefined,
    status: "New",
  });
}
