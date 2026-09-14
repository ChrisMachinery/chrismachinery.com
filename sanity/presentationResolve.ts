import { defineDocuments, defineLocations } from "sanity/presentation";
import { PREVIEW_ORIGINS } from "./lib/previewUrl";

const LOCALES = ["", "/es", "/fr", "/ar"] as const;
const ORIGINS = ["", ...PREVIEW_ORIGINS] as const;

function routes(pattern: string) {
  const out: string[] = [];
  for (const origin of ORIGINS) {
    for (const loc of LOCALES) {
      out.push(`${origin}${loc}${pattern}`);
    }
  }
  return out;
}

export const presentationResolve = {
  mainDocuments: defineDocuments([
    {
      route: routes("/products/:series/:slug"),
      filter: `_type == "product" && slug.current == $slug`,
    },
    {
      route: routes("/blog/:slug"),
      filter: `_type == "blogPost" && slug.current == $slug`,
    },
    {
      route: routes("/solutions/:slug"),
      filter: `_type == "solution" && slug.current == $slug`,
    },
    {
      route: routes("/products/:series"),
      resolve: ({ params }) => ({
        filter: `_type == "sitePage" && path == $path`,
        params: { path: `/products/${params.series}` },
      }),
    },
    {
      route: routes("/about"),
      filter: `_type == "sitePage" && path == "/about"`,
    },
    {
      route: routes("/solutions"),
      filter: `_type == "sitePage" && path == "/solutions"`,
    },
    {
      route: routes("/blog"),
      filter: `_type == "sitePage" && path == "/blog"`,
    },
    {
      route: routes("/contact"),
      filter: `_type == "sitePage" && path == "/contact"`,
    },
    {
      route: routes("/customize"),
      filter: `_type == "sitePage" && path == "/customize"`,
    },
    {
      route: [
        "/",
        "/es",
        "/fr",
        "/ar",
        ...PREVIEW_ORIGINS,
        ...PREVIEW_ORIGINS.map((origin) => `${origin}/`),
        ...PREVIEW_ORIGINS.flatMap((origin) => ["/es", "/fr", "/ar"].map((loc) => `${origin}${loc}`)),
      ],
      filter: `_type == "pageContent" && (_id in ["pageContent", "drafts.pageContent"] || slug.current == "home")`,
    },
  ]),
  locations: {
    pageContent: defineLocations({
      select: { title: "heroSlides.0.title" },
      resolve: () => ({
        locations: [
          { title: "Home", href: "/" },
          { title: "Can be customized (all products)", href: "/products" },
        ],
      }),
    }),
    sitePage: defineLocations({
      select: { title: "title", path: "path" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Page", href: doc?.path || "/" }],
      }),
    }),
    product: defineLocations({
      select: { title: "title", slug: "slug.current", series: "series" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Product",
            href: doc?.series ? `/products/${doc.series}/${doc.slug}` : `/products/${doc?.slug}`,
          },
        ],
      }),
    }),
    blogPost: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Blog post", href: `/blog/${doc?.slug}` }],
      }),
    }),
    solution: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Solution", href: `/solutions/${doc?.slug}` }],
      }),
    }),
    customizeCatalog: defineLocations({
      resolve: () => ({
        locations: [{ title: "Customize", href: "/customize" }],
      }),
    }),
    solutionsBoard: defineLocations({
      resolve: () => ({
        locations: [{ title: "Solutions cards", href: "/solutions" }],
      }),
    }),
  },
};
