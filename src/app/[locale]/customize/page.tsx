import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getCatalogProducts, getCustomizeOptions, getSitePage, getSolutions } from "@/lib/sanity/fetch";
import { Customizer } from "@/components/customizer/CanvasPreview";
import { Hreflang } from "@/components/seo/JsonLd";
import { stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return withCanonical(locale, "/customize", {
    title: "Customize Your Food Trailer | Chris Machinery",
    description: "Choose series, size, colors, logo and kitchen equipment, then send a factory inquiry.",
  });
}

export default async function CustomizePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; material?: string; shape?: string; solution?: string }>;
}) {
  const { locale } = await params;
  const { product: productSlug, material: seedMaterial, shape: seedShape, solution: solutionSlug } =
    await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("customizer");
  const [catalog, page, solutions, options] = await Promise.all([
    getCatalogProducts(),
    getSitePage("/customize"),
    getSolutions(),
    getCustomizeOptions(),
  ]);
  const solution = solutionSlug ? solutions.find((item) => item.slug === solutionSlug) : undefined;
  const seedSlug = productSlug || solution?.recommendedProducts[0]?.slug;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path="/customize" />
      <h1 className="type-page mb-8">
        {stegaText(page?._id, "sitePage", "title", uiText(locale, page?.title, t("title")))}
      </h1>
      <Customizer
        catalog={catalog}
        extras={options.extras}
        kitchen={options.kitchen}
        seedSlug={seedSlug}
        seedMaterial={seedMaterial}
        seedShape={seedShape}
        seedSolution={
          solution
            ? {
                slug: solution.slug,
                name: solution.name,
                equipmentIds: solution.equipmentIds ?? [],
              }
            : undefined
        }
      />
    </div>
  );
}
