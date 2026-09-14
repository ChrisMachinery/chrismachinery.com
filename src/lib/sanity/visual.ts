import { createDataAttribute } from "next-sanity";
import { createEditUrl } from "@sanity/client/csm";
import { VERCEL_STEGA_REGEX, vercelStegaClean, vercelStegaCombine } from "@vercel/stega";
import { sanityDataset, sanityProjectId } from "@/lib/sanity.client";

export type SanityEditProps = {
  "data-sanity": string;
  "data-sanity-edit-target": string;
};

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

export function stegaText(
  id: string | undefined,
  type: string,
  path: string,
  text: string,
) {
  if (!text) return text;
  if (VERCEL_STEGA_REGEX.test(text)) return text;
  // Public Vercel HTML stays clean. Local / Presentation still encode for click-to-edit.
  if (process.env.NODE_ENV === "production") return text;
  const href = createEditUrl({
    baseUrl: studioUrl,
    id: (id || "pageContent").replace(/^drafts\./, ""),
    type,
    path,
    projectId: sanityProjectId,
    dataset: sanityDataset,
  });
  return vercelStegaCombine(text, { origin: "sanity.io", href }, false);
}

export function plainText(text: string) {
  return text ? vercelStegaClean(text) : text;
}

export function cmsEdit(
  id: string | undefined,
  type: string,
  path: string,
): SanityEditProps | undefined {
  if (!id) return undefined;
  const attr = createDataAttribute({
    id: id.replace(/^drafts\./, ""),
    type,
    projectId: sanityProjectId,
    dataset: sanityDataset,
    baseUrl: studioUrl,
    path,
  });
  return {
    "data-sanity": String(attr()),
    "data-sanity-edit-target": "",
  };
}

export function cmsLinkEdit(id: string | undefined, type: string, path: string) {
  if (!id) return undefined;
  const attr = createDataAttribute({
    id: id.replace(/^drafts\./, ""),
    type,
    projectId: sanityProjectId,
    dataset: sanityDataset,
    baseUrl: studioUrl,
    path,
  });
  return {
    "data-sanity": String(attr()),
    "data-sanity-overlay-element": "capture" as const,
  };
}

export function homePageAttr(documentId?: string) {
  return createDataAttribute({
    id: (documentId || "pageContent").replace(/^drafts\./, ""),
    type: "pageContent",
    projectId: sanityProjectId,
    dataset: sanityDataset,
    baseUrl: studioUrl,
  });
}

export function editField(attr: ReturnType<typeof homePageAttr>, path: string): SanityEditProps {
  return {
    "data-sanity": attr(path),
    "data-sanity-edit-target": "",
  };
}
