import type { Product } from "@/data/products";
import { productSizeLabel } from "@/data/products";
import { productShapes } from "@/lib/productFamily";
import { DEFAULT_OG, SITE_NAME, SITE_URL } from "@/lib/site";
import { localizedHref } from "@/lib/seoCanonical";

export function productJsonLd(product: Product) {
  const availability =
    product.stockStatus === "In Stock"
      ? "https://schema.org/InStock"
      : product.stockStatus === "Out of Stock"
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/PreOrder";

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [
      product.imageUrl,
      ...(product.galleryImages?.map((item) => item.url) ?? []),
      DEFAULT_OG,
    ].filter((url, i, list): url is string => Boolean(url) && list.indexOf(url) === i),
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: { "@type": "Brand", name: SITE_NAME },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Body size",
        value: productSizeLabel(product),
      },
      ...(product.weight
        ? [{ "@type": "PropertyValue", name: "Weight", value: `${product.weight}KG` }]
        : []),
      ...(productShapes(product).length
        ? [{ "@type": "PropertyValue", name: "Shape", value: productShapes(product).join(" / ") }]
        : []),
    ],
    offers: {
      "@type": "Offer",
      availability,
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/products/${product.series}/${product.slug}`,
    },
  };
}

function schemaText(value?: string) {
  const text = value?.trim();
  if (!text || text.includes("【") || /^\[TEXT/i.test(text) || /^factory address$/i.test(text)) {
    return undefined;
  }
  return text;
}

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const DEFAULT_ORG_CONTACT = {
  email: "Info@chrismachinery.com",
  telephone: "+86-513-82899907",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 288 Taihu Road Haimen Port New Area, Haimen District",
    addressLocality: "Nantong City",
    addressRegion: "Jiangsu",
    postalCode: "226100",
    addressCountry: "CN",
  },
};

const DEFAULT_SAME_AS = [
  "https://www.facebook.com/profile.php?id=61573611268688",
  "https://www.instagram.com/chris.machinery/",
  "https://www.youtube.com/@ChrisMachineryCom/videos",
];

export function organizationJsonLd(input?: {
  logo?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
  description?: string;
}) {
  const email = schemaText(input?.email) || DEFAULT_ORG_CONTACT.email;
  const telephone =
    schemaText(input?.telephone)?.split(/[;；]/)[0]?.trim() || DEFAULT_ORG_CONTACT.telephone;
  const cmsAddress = schemaText(input?.address);
  const address =
    cmsAddress && !/taihu|haimen|nantong/i.test(cmsAddress)
      ? { "@type": "PostalAddress", streetAddress: cmsAddress, addressCountry: "CN" }
      : DEFAULT_ORG_CONTACT.address;
  const sameAs = (input?.sameAs ?? [])
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//i.test(url));

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: input?.logo || `${SITE_URL}/icon.png`,
    },
    email,
    telephone,
    address,
    sameAs: sameAs.length ? sameAs : DEFAULT_SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      telephone,
      email,
      contactType: "sales",
    },
  };
  if (input?.description) organization.description = input.description;
  return organization;
}

export function homeGraphJsonLd(input: {
  description: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}) {
  const organization = organizationJsonLd({ ...input, description: undefined });
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: input.description,
        publisher: { "@id": ORG_ID },
      },
      organization,
    ],
  };
}

export function contactPageJsonLd(input: {
  locale: string;
  name: string;
  description: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: string;
  hours?: string;
  sameAs?: string[];
}) {
  const organization = organizationJsonLd({ ...input, description: undefined });
  const hours = schemaText(input.hours);
  if (hours && /^(Mo|Tu|We|Th|Fr|Sa|Su|Mon|Tue)/i.test(hours)) {
    organization.openingHours = hours;
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "ContactPage",
        name: input.name,
        url: localizedHref(input.locale, "/contact"),
        description: input.description,
        mainEntity: { "@id": ORG_ID },
      },
    ],
  };
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedHref(locale, item.path),
    })),
  };
}

export function collectionPageJsonLd(input: {
  locale: string;
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  const url = localizedHref(input.locale, input.path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      name: input.name,
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: localizedHref(input.locale, item.path),
      })),
    },
  };
}

export const DEFAULT_ABOUT_STATS = {
  factoryArea: "7,000㎡",
  annualOutput: "500+ Units",
  technicians: "15+",
  countries: "30+",
};

export function aboutMetaDescription(stats: {
  factoryArea?: string;
  annualOutput?: string;
  technicians?: string;
  countries?: string;
}) {
  const area = schemaText(stats.factoryArea) || DEFAULT_ABOUT_STATS.factoryArea;
  const output = (schemaText(stats.annualOutput) || DEFAULT_ABOUT_STATS.annualOutput)
    .replace(/\s*units?/i, "")
    .trim();
  const technicians = schemaText(stats.technicians) || DEFAULT_ABOUT_STATS.technicians;
  const countries = schemaText(stats.countries) || DEFAULT_ABOUT_STATS.countries;
  return `${area} factory, ${output} units per year, ${technicians} technicians, ${countries} export markets.`;
}

export function aboutPageJsonLd(input: {
  locale: string;
  name: string;
  description: string;
  logo?: string;
  email?: string;
  telephone?: string;
  address?: string;
  sameAs?: string[];
}) {
  const organization = organizationJsonLd(input);
  const plantId = `${SITE_URL}/#plant`;
  const url = localizedHref(input.locale, "/about");
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "ManufacturingPlant",
        "@id": plantId,
        name: `${SITE_NAME} Factory`,
        url,
        address: organization.address,
        telephone: organization.telephone,
        parentOrganization: { "@id": ORG_ID },
      },
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url,
        name: input.name,
        description: input.description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": ORG_ID },
        about: { "@id": plantId },
      },
    ],
  };
}

export function blogPostingJsonLd(input: {
  locale: string;
  title: string;
  description?: string;
  slug: string;
  date?: string;
  author?: string;
  image?: string;
}) {
  const url = localizedHref(input.locale, `/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    author: { "@type": "Person", name: input.author || SITE_NAME },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
    url,
    ...(input.image ? { image: input.image } : {}),
  };
}
