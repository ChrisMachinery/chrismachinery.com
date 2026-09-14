import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { client, isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity.client";

export { client, isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId };

export function getSanityClient(options?: { useCdn?: boolean; token?: string }) {
  if (!isSanityConfigured()) return null;
  return client.withConfig({
    useCdn: options?.useCdn ?? true,
    token: options?.token,
    stega: options?.token ? false : undefined,
  });
}

export function urlFor(source: SanityImageSource) {
  if (!isSanityConfigured()) return null;
  return imageUrlBuilder(client).image(source);
}

export function hasImageAsset(source: unknown) {
  if (!source || typeof source !== "object") return false;
  if ("_ref" in source && typeof (source as { _ref?: string })._ref === "string") return true;
  const asset = (source as { asset?: { _ref?: string } }).asset;
  return Boolean(asset && (typeof asset === "string" || asset._ref));
}

export function imageUrl(source: unknown, width = 1600) {
  if (!hasImageAsset(source)) return undefined;
  try {
    return urlFor(source as SanityImageSource)?.width(width).auto("format").url() || undefined;
  } catch {
    return undefined;
  }
}
