import { draftMode } from "next/headers";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FactoryPhotoGallery, FactoryPhotoGalleryEditor } from "@/components/about/FactoryPhotoGallery";
import { ProcessStepCarousel } from "@/components/about/ProcessStepCarousel";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { PlainTextBody } from "@/components/media/PlainTextBody";
import { factoryVideoEmbedSrc } from "@/lib/factoryVideoEmbed";
import { getPageContent, getSitePage } from "@/lib/sanity/fetch";
import { cmsEdit, plainText, stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import { localizedAbout } from "@/data/localizedHome";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutMetaDescription, aboutPageJsonLd, breadcrumbJsonLd, DEFAULT_ABOUT_STATS } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await getSitePage("/about");
  return withCanonical(locale, "/about", {
    title: "About Chris Machinery | Food Trailer Factory",
    description: aboutMetaDescription({
      factoryArea: page?.factoryArea,
      annualOutput: page?.annualOutput,
      technicians: page?.technicians,
      countries: page?.countries,
    }),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const copy = localizedAbout[locale] ?? localizedAbout.en;
  const isDraft = (await draftMode()).isEnabled;
  const [page, site] = await Promise.all([getSitePage("/about"), getPageContent()]);
  const id = page?._id;
  const s = (path: string, text: string) => stegaText(id, "sitePage", path, text);
  const heading = s("title", uiText(locale, page?.title, copy.title));
  const lede = s("subtitle", uiText(locale, page?.subtitle, copy.subtitle));
  const stats = [
    [copy.stats[0], s("factoryArea", page?.factoryArea ?? DEFAULT_ABOUT_STATS.factoryArea)],
    [copy.stats[1], s("annualOutput", page?.annualOutput ?? DEFAULT_ABOUT_STATS.annualOutput)],
    [copy.stats[2], s("technicians", page?.technicians ?? DEFAULT_ABOUT_STATS.technicians)],
    [copy.stats[3], s("countries", page?.countries ?? DEFAULT_ABOUT_STATS.countries)],
  ] as const;
  const factoryVideo = factoryVideoEmbedSrc(page?.factoryVideoUrl);
  const gallery = isDraft
    ? (page?.galleryUrls ?? [])
    : (page?.galleryUrls ?? []).filter(Boolean);
  const steps = copy.steps.map((step, i) => ({
    title: s(`buildSteps[${i}].title`, uiText(locale, page?.buildSteps?.[i]?.title, step.title)),
    body: s(`buildSteps[${i}].body`, uiText(locale, page?.buildSteps?.[i]?.body, step.body)),
    imageUrls: page?.buildSteps?.[i]?.imageUrls,
  }));
  const description = aboutMetaDescription({
    factoryArea: page?.factoryArea,
    annualOutput: page?.annualOutput,
    technicians: page?.technicians,
    countries: page?.countries,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t("nav.home"), path: "/" },
          { name: t("nav.about"), path: "/about" },
        ])}
      />
      <JsonLd
        data={aboutPageJsonLd({
          locale,
          name: plainText(heading),
          description,
          logo: site?.logoUrl,
          email: site?.footerInfo?.email,
          telephone: site?.footerInfo?.phone,
          address: site?.footerInfo?.address,
          sameAs: (site?.footerSocialLinks ?? [])
            .map((item) => item.url || "")
            .filter((url) => /^https?:\/\//i.test(url) && !url.includes("wa.me")),
        })}
      />
      <h1 className="type-page" {...cmsEdit(id, "sitePage", "title")}>
        {heading}
      </h1>
      <p className="type-lede mt-4 max-w-3xl" {...cmsEdit(id, "sitePage", "subtitle")}>
        {lede}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v], i) => {
          const path = (["factoryArea", "annualOutput", "technicians", "countries"] as const)[i];
          return (
            <div key={k} className="rounded-lg bg-dark p-6 text-white" {...cmsEdit(id, "sitePage", path)}>
              <p className="text-sm text-white/70">{k}</p>
              <p className="mt-2 font-heading text-3xl text-accent">{v}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="type-section" {...cmsEdit(id, "sitePage", "factoryTitle")}>
            {s("factoryTitle", uiText(locale, page?.factoryTitle, copy.factoryTitle))}
          </h2>
          <PlainTextBody
            className="mt-4 max-w-xl"
            documentId={id}
            documentType="sitePage"
            path="factoryBody"
            text={uiText(locale, page?.factoryBody, copy.factoryBody)}
          />
        </div>
        <div>
          {factoryVideo ? (
            <div className="overflow-hidden rounded-lg bg-black" {...cmsEdit(id, "sitePage", "factoryVideoUrl")}>
              <iframe
                title="Chris Machinery factory video"
                src={factoryVideo}
                className="aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <ImgPlaceholder
              documentId={id}
              documentType="sitePage"
              path="heroImage"
              alt="Chris Machinery food trailer factory"
              className="min-h-64 rounded-lg lg:min-h-80"
              src={page?.heroImageUrl}
            />
          )}
          {isDraft && !factoryVideo ? (
            <p className="type-body mt-3" {...cmsEdit(id, "sitePage", "factoryVideoUrl")}>
              {s("factoryVideoUrl", "Or paste a YouTube / Vimeo / Bilibili link")}
            </p>
          ) : null}
        </div>
      </div>

      <h2 className="type-section mt-16" {...cmsEdit(id, "sitePage", "buildTitle")}>
        {s("buildTitle", uiText(locale, page?.buildTitle, copy.buildTitle))}
      </h2>
      <PlainTextBody
        className="mt-3 w-full"
        documentId={id}
        documentType="sitePage"
        path="buildIntro"
        text={uiText(locale, page?.buildIntro, copy.buildIntro)}
      />
      <ol className="mt-8 grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={i} className="flex h-full min-h-0 flex-col border-t border-black/10 pt-4">
            <p className="text-xs tracking-wide text-black/45">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="type-card mt-2" {...cmsEdit(id, "sitePage", `buildSteps[${i}].title`)}>
              {step.title}
            </h3>
            <p className="type-body mt-2 min-h-16 flex-1" {...cmsEdit(id, "sitePage", `buildSteps[${i}].body`)}>
              {step.body}
            </p>
            <ProcessStepCarousel documentId={id} stepIndex={i} srcs={step.imageUrls} />
          </li>
        ))}
      </ol>

      {isDraft ? (
        <FactoryPhotoGalleryEditor documentId={id} images={gallery} heading={copy.factoryPhotos} />
      ) : (
        <FactoryPhotoGallery documentId={id} images={gallery} heading={copy.factoryPhotos} />
      )}
    </div>
  );
}
