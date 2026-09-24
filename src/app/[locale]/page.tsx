import { getTranslations, setRequestLocale } from "next-intl/server";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AdvantageIcon } from "@/components/home/AdvantageIcon";
import { DetailShotCarousel } from "@/components/home/DetailShotCarousel";
import { ProductDetailRows } from "@/components/home/ProductDetailRows";
import { FlagAvatar } from "@/components/home/FlagAvatar";
import { getPageContent } from "@/lib/sanity/fetch";
import { urlFor } from "@/lib/sanity/client";
import { advantageImageAlt, resolveAdvantageIcon } from "@/lib/advantageIcons";
import { resolveTestimonialPlace } from "@/lib/testimonialFlags";
import { cmsEdit, plainText, stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeGraphJsonLd } from "@/lib/seo";
import { socialHref } from "@/lib/socialLinks";
import {
  localizedAdvantages,
  localizedBlock,
  localizedProductDetails,
  localizedTestimonials,
} from "@/data/localizedHome";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("meta");
  const page = await getPageContent();
  return withCanonical(locale, "/", {
    title: t("homeTitle"),
    description: uiText(locale, page?.pageLede, t("homeDescription")),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const page = await getPageContent();
  const id = page?._id || "pageContent";
  const s = (path: string, text: string) => stegaText(id, "pageContent", path, text);

  const hero = page?.homeHero;
  const about = page?.aboutUs;

  const defaultHeroSlides = [
    {
      title: t("home.slogan"),
      subtitle: t("home.sub"),
      imageLabel: "Homepage hero banner",
      primaryText: t("cta.quote"),
      primaryHref: "/contact",
      secondaryText: t("cta.products"),
      secondaryHref: "/products/pod",
      src: page?.heroBackgroundUrl,
    },
    {
      title: t("home.hero2Title"),
      subtitle: t("home.hero2Sub"),
      imageLabel: "Homepage banner 2 - Pod / Airstream",
      primaryText: t("cta.quote"),
      primaryHref: "/contact",
      secondaryText: t("cta.products"),
      secondaryHref: "/products/airstream",
    },
    {
      title: t("home.hero3Title"),
      subtitle: t("home.hero3Sub"),
      imageLabel: "Homepage banner 3 - galvanized chassis",
      primaryText: t("cta.quote"),
      primaryHref: "/contact",
      secondaryText: t("cta.products"),
      secondaryHref: "/products/square",
    },
    {
      title: t("home.hero4Title"),
      subtitle: t("home.hero4Sub"),
      imageLabel: "Homepage banner 4 - custom drawings",
      primaryText: t("cta.quote"),
      primaryHref: "/contact",
      secondaryText: t("cta.customize"),
      secondaryHref: "/customize",
    },
  ];

  const cmsSlides = page?.heroSlides?.length ? page.heroSlides : [];
  const heroSlides = Array.from({ length: Math.max(4, cmsSlides.length) }, (_, i) => {
    const cms = cmsSlides[i];
    const fallback = defaultHeroSlides[i] ?? defaultHeroSlides[0];
    const useLegacy = i === 0 && !cms;
    return {
      title: s(
        `heroSlides[${i}].title`,
        uiText(
          locale,
          cms?.title || (useLegacy ? hero?.headline : undefined),
          fallback.title,
        ),
      ),
      subtitle: s(
        `heroSlides[${i}].subtitle`,
        uiText(
          locale,
          cms?.subtitle || (useLegacy ? hero?.subheadline : undefined),
          fallback.subtitle,
        ),
      ),
      imageLabel: s(`heroSlides[${i}].image`, fallback.imageLabel),
      src: cms?.imageUrl || (i === 0 ? page?.heroBackgroundUrl : undefined) || fallback.src,
      primaryText: s(
        `heroSlides[${i}].primaryButtonText`,
        uiText(
          locale,
          cms?.primaryButtonText || (useLegacy ? hero?.ctaQuote : undefined),
          fallback.primaryText,
        ),
      ),
      primaryHref:
        cms?.primaryButtonLink ||
        (useLegacy ? page?.heroButtonLink : undefined) ||
        fallback.primaryHref,
      secondaryText: s(
        `heroSlides[${i}].secondaryButtonText`,
        uiText(
          locale,
          cms?.secondaryButtonText || (useLegacy ? hero?.ctaProducts : undefined),
          fallback.secondaryText,
        ),
      ),
      secondaryHref: cms?.secondaryButtonLink || fallback.secondaryHref,
    };
  });

  const defaultQuotes = [
    { name: "Amelia K.", country: "UK", flag: "UK", text: "We ordered a 4000 Airstream stainless. Export pack was complete." },
    { name: "Luca B.", country: "CH", flag: "CH", text: "Square 4500 with fryer line arrived crate-ready. Docs were complete." },
    { name: "Sofia R.", country: "PT", flag: "PT", text: "Pod 3000 for a coffee concept — wrap-ready paint and solid welds." },
    { name: "Erik N.", country: "NO", flag: "NO", text: "Factory visit confirmed the galvanizing. Would buy again." },
    { name: "Anna M.", country: "AT", flag: "AT", text: "Chassis quality matched the drawings. Quote came back the same day." },
    { name: "Sophie L.", country: "FR", flag: "FR", text: "Custom window layout and logo wrap were done in-house. Clean finish." },
  ];

  const cmsQuotes = (page?.testimonials ?? []).filter(
    (item) => item?.name?.trim() || item?.text?.trim(),
  );
  const sourceQuotes = Array.from({ length: 6 }, (_, i) => cmsQuotes[i] ?? defaultQuotes[i]);
  const quotes = sourceQuotes.map((item, i) => {
    const place = resolveTestimonialPlace(item.country, item.flag);
    return {
      name: s(`testimonials[${i}].name`, item.name || ""),
      country: place.country,
      iso: place.iso,
      text: s(
        `testimonials[${i}].text`,
        uiText(locale, item.text, localizedTestimonials[locale]?.[i] || ""),
      ),
    };
  });

  const advantageCount = Math.max(4, page?.advantages?.length ?? 0);
  const advantages = Array.from({ length: advantageCount }, (_, i) => {
    const cms = page?.advantages?.[i];
    const copy = localizedBlock(locale, i, cms, localizedAdvantages);
    return {
      icon: resolveAdvantageIcon(cms?.icon, i),
      title: s(`advantages[${i}].title`, copy.title),
      body: s(`advantages[${i}].body`, copy.body),
      imageUrl: cms?.image ? urlFor(cms.image as never)?.width(1200).auto("format").url() : undefined,
      imageLabel: s(`advantages[${i}].image`, `Advantage photo ${i + 1}`),
      imageAlt: advantageImageAlt(cms?.image, i),
    };
  });

  const defaultDetails = [
    {
      title: "Galvanized chassis and food-grade interiors",
      body: "Hot-dip galvanized frames for coastal and winter roads. Stainless prep surfaces and wrap-ready bodies specified for daily service.",
      imageLabel: "Product detail 1 - chassis and interior",
    },
    {
      title: "Drawings, QC, and export packing",
      body: "Layout drawings before production. In-process and final inspection, then crate-ready packing with photos before shipment.",
      imageLabel: "Product detail 2 - drawings and QC",
    },
  ];
  const cmsDetails = page?.productDetails ?? [];
  const productDetails = (cmsDetails.length ? cmsDetails : defaultDetails).map((item, i) => {
    const fallback = defaultDetails[i] ?? defaultDetails[0];
    const cms = cmsDetails[i];
    const copy = localizedBlock(locale, i, cms, localizedProductDetails);
    return {
      title: s(`productDetails[${i}].title`, copy.title || fallback.title),
      body: s(`productDetails[${i}].body`, copy.body || fallback.body),
      imageUrl: cms?.image ? urlFor(cms.image as never)?.width(1600).auto("format").url() : undefined,
      imageLabel: s(`productDetails[${i}].image`, fallback.imageLabel),
    };
  });
  const detailShotCount = Math.max(6, page?.detailShots?.length ?? 0);
  const detailShots = Array.from({ length: detailShotCount }, (_, i) => {
    const cms = page?.detailShots?.[i];
    return {
      imageUrl: cms?.imageUrl,
      caption: s(`detailShots[${i}].caption`, cms?.caption || ""),
      imageLabel: s(`detailShots[${i}].image`, `Close-up ${i + 1}`),
      alt: cms?.imageAlt,
    };
  });

  return (
    <div>
      <JsonLd
        data={homeGraphJsonLd({
          description: uiText(locale, page?.pageLede, t("meta.homeDescription")),
          logo: page?.logoUrl,
          email: page?.footerInfo?.email,
          telephone: page?.footerInfo?.phone,
          address: page?.footerInfo?.address,
          sameAs: (page?.footerSocialLinks ?? [])
            .map((item) => socialHref(undefined, item.url) || item.url || "")
            .filter((url) => /^https?:\/\//i.test(url) && !url.includes("wa.me")),
        })}
      />
      <HeroBanner documentId={id} slides={heroSlides} />
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <h1 className="type-page" {...cmsEdit(id, "pageContent", "pageHeading")}>
          {s("pageHeading", uiText(locale, page?.pageHeading, t("home.pageHeading")))}
        </h1>
        <p className="type-lede mt-3 w-full whitespace-pre-wrap" {...cmsEdit(id, "pageContent", "pageLede")}>
          {s("pageLede", uiText(locale, page?.pageLede, t("meta.homeDescription")))}
        </p>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="type-section">{s("advantagesTitle", uiText(locale, page?.advantagesTitle, t("home.advantages")))}</h2>
          <div className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item, i) => (
              <article key={i} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white"
                    {...cmsEdit(id, "pageContent", `advantages[${i}].icon`)}
                  >
                    <AdvantageIcon name={item.icon} />
                  </div>
                  <h3 className="type-sub">{item.title}</h3>
                </div>
                <p className="type-body mt-3">{item.body}</p>
                <ImgPlaceholder
                  documentId={id}
                  documentType="pageContent"
                  path={`advantages[${i}].image`}
                  alt={item.imageAlt || item.title}
                  className="mt-4 aspect-[4/3] w-full rounded-2xl"
                  src={item.imageUrl}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailRows
        documentId={id}
        heading={s("productDetailsTitle", uiText(locale, page?.productDetailsTitle, t("home.details")))}
        items={productDetails}
      />

      <DetailShotCarousel
        documentId={id}
        heading={s("detailShotsTitle", uiText(locale, page?.detailShotsTitle, t("home.closeups")))}
        slides={detailShots}
      />

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="type-section">{s("testimonialsTitle", uiText(locale, page?.testimonialsTitle, t("home.testimonials")))}</h2>
          <div className="mt-8 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quotes.map((q, i) => (
              <blockquote
                key={i}
                className="card-hover flex h-full flex-col rounded-lg border border-black/5 bg-white p-5"
              >
                <FlagAvatar
                  iso={q.iso}
                  label={q.country}
                  documentId={id}
                  path={`testimonials[${i}].country`}
                />
                <p className="type-body flex-1 whitespace-pre-line">“{q.text}”</p>
                <footer className="mt-3 text-sm font-semibold text-brand" {...cmsEdit(id, "pageContent", `testimonials[${i}].country`)}>
                  {q.name} · {q.country}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-200 py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 lg:grid-cols-2">
          <div>
            <h2 className="type-section">
              {s("aboutTitle", uiText(locale, about?.title, t("home.aboutTitle")))}
            </h2>
            <p className="type-body mt-4 max-w-xl">
              {s("aboutContent", uiText(locale, about?.body, t("home.aboutBody")))}
            </p>
            <PreviewNavLink
              href="/about"
              className="mt-6 min-touch inline-flex items-center rounded bg-accent px-5 font-heading text-brand"
            >
              {plainText(uiText(locale, page?.aboutButtonText, t("cta.learn")))}
            </PreviewNavLink>
          </div>
          <ImgPlaceholder
            documentId={id}
            documentType="pageContent"
            path="aboutImage"
            alt="Factory workshop"
            className="min-h-[260px] rounded-lg"
            src={page?.aboutImageUrl}
          />
        </div>
      </section>
    </div>
  );
}
