import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { getCatalogProduct, getPageContent, getSitePage, getSolutions, getCustomizeOptions } from "@/lib/sanity/fetch";
import { uiText } from "@/lib/i18nCopy";
import { cmsEdit, plainText, stegaText } from "@/lib/sanity/visual";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPageJsonLd } from "@/lib/seo";
import { faqJsonLd } from "@/lib/seriesGuides";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";

const CONTACT_H1 = "Contact Our Team for Custom Trailer Quotes";
const CONTACT_DESCRIPTION = "Request a factory quote within 24 hours. WhatsApp, email, and inquiry form.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return withCanonical(locale, "/contact", {
    title: "Contact Our Team for Custom Trailer Quotes | Chris Machinery",
    description: CONTACT_DESCRIPTION,
  });
}

function visibleHeading(locale: string, cmsTitle: string | undefined, translated: string) {
  const cms = cmsTitle?.trim();
  if (cms && !/^contact$/i.test(cms)) {
    return locale === "en" ? cms : translated;
  }
  return translated;
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    product?: string;
    shape?: string;
    material?: string;
    solution?: string;
    stock?: string;
    model?: string;
    qty?: string;
    color?: string;
    dim?: string;
    include?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [page, site] = await Promise.all([getSitePage("/contact"), getPageContent()]);
  const [catalogProduct, solutions, options] = await Promise.all([
    query.product ? getCatalogProduct(query.product) : Promise.resolve(undefined),
    getSolutions(),
    getCustomizeOptions(),
  ]);
  const solution = query.solution ? solutions.find((item) => item.slug === query.solution) : undefined;
  const quotedProduct =
    catalogProduct ||
    (solution?.recommendedProducts[0]?.slug
      ? await getCatalogProduct(solution.recommendedProducts[0].slug)
      : undefined);
  const s = (path: string, text: string) => stegaText(page?._id, "sitePage", path, text);
  const heading = s(
    "title",
    visibleHeading(locale, page?.title, t("contact.heading") || CONTACT_H1),
  );
  const lede = s(
    "subtitle",
    uiText(locale, page?.subtitle, CONTACT_DESCRIPTION),
  );
  const faqs = (
    [
      ["q1", "a1"],
      ["q2", "a2"],
      ["q3", "a3"],
      ["q4", "a4"],
      ["q5", "a5"],
      ["q6", "a6"],
    ] as const
  ).map(([q, a], i) => ({
    q: s(`faq[${i}].question`, uiText(locale, page?.faq?.[i]?.question, t(`faq.${q}`))),
    a: s(`faq[${i}].answer`, uiText(locale, page?.faq?.[i]?.answer, t(`faq.${a}`))),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={contactPageJsonLd({
          locale,
          name: plainText(heading),
          description: plainText(lede),
          logo: site?.logoUrl,
          email: site?.footerInfo?.email,
          telephone: site?.footerInfo?.phone,
          address: site?.footerInfo?.address,
          hours: site?.footerInfo?.hours,
          sameAs: (site?.footerSocialLinks ?? [])
            .map((item) => item.url || "")
            .filter((url) => /^https?:\/\//i.test(url) && !url.includes("wa.me")),
        })}
      />
      <JsonLd
        data={faqJsonLd(
          faqs.map((item) => ({
            question: plainText(item.q),
            answer: plainText(item.a),
          })),
        )}
      />
      <h1 className="type-page" {...cmsEdit(page?._id, "sitePage", "title")}>
        {heading}
      </h1>
      <p className="type-lede mt-3 mb-8" {...cmsEdit(page?._id, "sitePage", "subtitle")}>
        {lede}
      </p>
      <Suspense>
        <ContactForm
          catalogProduct={quotedProduct}
          initialShape={query.shape}
          initialMaterial={query.material}
          extras={options.extras}
          kitchen={options.kitchen}
          solutionQuote={
            solution
              ? {
                  slug: solution.slug,
                  name: solution.name,
                  equipmentIds: solution.equipmentIds ?? [],
                }
              : undefined
          }
          stockInquiry={
            query.stock
              ? {
                  model: query.model || quotedProduct?.name || query.product || "",
                  quantity: query.qty || "1",
                  color: query.color || "",
                  dimension: query.dim || "",
                  include: query.include || "",
                }
              : undefined
          }
        />
      </Suspense>
      <section className="mt-10">
        <h2 className="font-heading text-base font-semibold text-brand">
          {s("faqTitle", uiText(locale, page?.faqTitle, t("faq.title")))}
        </h2>
        <div className="contact-faq mt-3 divide-y border-y">
          {faqs.map((item, i) => (
            <details key={i} className="py-2.5">
              <summary className="min-touch cursor-pointer font-heading text-sm font-semibold text-brand">
                {item.q}
              </summary>
              <p className="type-body mt-1.5">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
