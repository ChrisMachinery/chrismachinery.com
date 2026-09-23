import type { ComponentProps, ReactNode } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { LinkPlaceholder } from "@/components/media/LinkPlaceholder";
import { PlainTextBody } from "@/components/media/PlainTextBody";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { cmsEdit, cmsLinkEdit, stegaText } from "@/lib/sanity/visual";
import { isProductDetailPath } from "@/lib/productUrl";
import {
  SERIES_GUIDE_DEFAULTS,
  type GuideSeries,
  type SeriesGuideCms,
} from "@/lib/seriesGuides";

function productPathFromHref(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  try {
    const url = value.startsWith("http") ? new URL(value) : new URL(value, "https://www.chrismachinery.com");
    if (!isProductDetailPath(url.pathname)) return "";
    return url.pathname.replace(/^\/(en|es|fr|ar)(?=\/)/, "") || url.pathname;
  } catch {
    return "";
  }
}

function productSlugFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "products" ? parts[2] || "" : "";
}

export function CatalogSeriesGuide({
  series,
  documentId,
  cms,
  shapeGuide,
}: {
  series: GuideSeries;
  documentId?: string;
  cms?: SeriesGuideCms | null;
  shapeGuide?: ReactNode;
}) {
  const d = SERIES_GUIDE_DEFAULTS[series];
  const s = (path: string, text: string) => stegaText(documentId, "sitePage", path, text);
  const toc = [
    {
      href: `#${d.compareSectionId}`,
      label: cms?.tocCompare?.trim() || d.tocCompare,
      path: "podGuide.tocCompare",
    },
    { href: `#${series}-size`, label: cms?.tocSize?.trim() || d.tocSize, path: "podGuide.tocSize" },
    {
      href: `#${series}-kitchen`,
      label: cms?.tocKitchen?.trim() || d.tocKitchen,
      path: "podGuide.tocKitchen",
    },
    { href: `#${series}-faq`, label: cms?.tocFaq?.trim() || d.tocFaq, path: "podGuide.tocFaq" },
    { href: "#series-catalog", label: cms?.tocModels?.trim() || d.tocModels, path: "podGuide.tocModels" },
  ];
  const rows = d.sizeRows.map((row, i) => {
    const cmsRow = cms?.sizeRows?.[i];
    return {
      scene: cmsRow?.scene?.trim() || row.scene,
      length: cmsRow?.length?.trim() || row.length,
      width: cmsRow?.width?.trim() || row.width,
      axle: cmsRow?.axle?.trim() || row.axle,
      shape: cmsRow?.shape?.trim() || row.shape,
      material: cmsRow?.material?.trim() || row.material,
      note: cmsRow?.note?.trim() || row.note,
      exampleLabel: cmsRow?.exampleLabel?.trim() || row.exampleLabel,
      exampleHref: cmsRow?.exampleHref?.trim() || "",
      imageUrl: cmsRow?.imageUrl,
      imageAlt: cmsRow?.imageAlt,
      imageLabel: row.imageLabel,
    };
  });
  const quoteLabel = cms?.quoteLabel?.trim() || d.quoteLabel;
  const quoteHref = (cms?.quoteHref?.trim() || d.quoteHref) as ComponentProps<typeof PreviewNavLink>["href"];
  function quoteButton() {
    return (
      <span className="relative inline-flex" {...cmsLinkEdit(documentId, "sitePage", "podGuide.quoteHref")}>
        <PreviewNavLink
          href={quoteHref}
          className="min-touch inline-flex items-center justify-center rounded bg-accent px-6 font-heading text-brand"
        >
          {s("podGuide.quoteLabel", quoteLabel)}
        </PreviewNavLink>
      </span>
    );
  }
  const faqs = d.faq.map((item, i) => ({
    question: cms?.faq?.[i]?.question?.trim() || item.question,
    answer: cms?.faq?.[i]?.answer?.trim() || item.answer,
  }));

  return (
    <div className="mt-8 space-y-12">
      <section>
        <h2 className="type-section" {...cmsEdit(documentId, "sitePage", "podGuide.introTitle")}>
          {s("podGuide.introTitle", cms?.introTitle?.trim() || d.introTitle)}
        </h2>
        <PlainTextBody
          text={cms?.intro?.trim() || d.intro}
          documentId={documentId}
          documentType="sitePage"
          path="podGuide.intro"
          className="mt-4"
        />
      </section>

      <nav
        className="sticky top-16 z-30 -mx-4 border-y border-black/10 bg-white/95 px-4 py-2 backdrop-blur"
        aria-label={`${series} guide sections`}
      >
        <div className="flex w-full min-w-0 items-stretch justify-between gap-1.5 sm:gap-3">
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-accent px-1 text-center text-[11px] font-semibold leading-tight text-brand sm:px-3 sm:text-sm"
              {...cmsEdit(documentId, "sitePage", item.path)}
            >
              {s(item.path, item.label)}
            </a>
          ))}
        </div>
      </nav>

      <section id={shapeGuide ? undefined : d.compareSectionId} className={shapeGuide ? undefined : "scroll-mt-24"}>
        {shapeGuide ?? (
          <h2 className="type-section" {...cmsEdit(documentId, "sitePage", "podGuide.tocCompare")}>
            {s("podGuide.tocCompare", cms?.tocCompare?.trim() || d.tocCompare)}
          </h2>
        )}
        <PlainTextBody
          text={cms?.shapeBody?.trim() || d.shapeBody}
          documentId={documentId}
          documentType="sitePage"
          path="podGuide.shapeBody"
          className="mt-4"
        />
      </section>

      <section id={`${series}-size`} className="scroll-mt-24">
        <h2 className="type-section" {...cmsEdit(documentId, "sitePage", "podGuide.sizeTitle")}>
          {s("podGuide.sizeTitle", cms?.sizeTitle?.trim() || d.sizeTitle)}
        </h2>
        <PlainTextBody
          text={cms?.sizeNote?.trim() || d.sizeNote}
          documentId={documentId}
          documentType="sitePage"
          path="podGuide.sizeNote"
          className="mt-4"
        />
        <div className="mt-6 grid gap-5 lg:grid-cols-3" {...cmsEdit(documentId, "sitePage", "podGuide.sizeRows")}>
          {rows.map((row, i) => {
            const productPath = productPathFromHref(row.exampleHref);
            const productSlug = productSlugFromPath(productPath);
            const cardQuoteHref = (
              productSlug
                ? `/contact?product=${productSlug}&from=${encodeURIComponent(`/products/${series}`)}`
                : quoteHref
            ) as ComponentProps<typeof PreviewNavLink>["href"];
            return (
            <article key={row.scene} className="flex flex-col rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <h3
                className="font-heading text-lg text-brand"
                {...cmsLinkEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].exampleHref`)}
              >
                <span {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].scene`)}>
                  {productPath ? (
                    <PreviewNavLink
                      href={productPath as ComponentProps<typeof PreviewNavLink>["href"]}
                      className="text-inherit no-underline hover:no-underline"
                    >
                      {s(`podGuide.sizeRows[${i}].scene`, row.scene)}
                    </PreviewNavLink>
                  ) : (
                    s(`podGuide.sizeRows[${i}].scene`, row.scene)
                  )}
                </span>
              </h3>
              <dl className="type-body mt-3 space-y-1 text-sm">
                <div>
                  <dt className="inline font-semibold">Length: </dt>
                  <dd className="inline" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].length`)}>
                    {s(`podGuide.sizeRows[${i}].length`, row.length)}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Width: </dt>
                  <dd className="inline" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].width`)}>
                    {s(`podGuide.sizeRows[${i}].width`, row.width)}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Axle: </dt>
                  <dd className="inline" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].axle`)}>
                    {s(`podGuide.sizeRows[${i}].axle`, row.axle)}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Shape: </dt>
                  <dd className="inline" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].shape`)}>
                    {s(`podGuide.sizeRows[${i}].shape`, row.shape)}
                  </dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Material: </dt>
                  <dd className="inline" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].material`)}>
                    {s(`podGuide.sizeRows[${i}].material`, row.material)}
                  </dd>
                </div>
              </dl>
              <p className="type-body mt-3 flex-1 text-sm" {...cmsEdit(documentId, "sitePage", `podGuide.sizeRows[${i}].note`)}>
                {s(`podGuide.sizeRows[${i}].note`, row.note)}
              </p>
              <ImgPlaceholder
                documentId={documentId}
                documentType="sitePage"
                path={`podGuide.sizeRows[${i}].image`}
                alt={row.imageAlt || `${row.scene} ${series} food trailer`}
                className="mt-4 aspect-[4/3] w-full rounded-lg"
                src={row.imageUrl}
              />
              <div className="mt-4">
                <PreviewNavLink
                  href={cardQuoteHref}
                  className="min-touch inline-flex items-center justify-center rounded bg-accent px-6 font-heading text-brand no-underline hover:no-underline"
                >
                  {s("podGuide.quoteLabel", quoteLabel)}
                </PreviewNavLink>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <section id={`${series}-kitchen`} className="scroll-mt-24">
        <h2 className="type-section" {...cmsEdit(documentId, "sitePage", "podGuide.kitchenTitle")}>
          {s("podGuide.kitchenTitle", cms?.kitchenTitle?.trim() || d.kitchenTitle)}
        </h2>
        <PlainTextBody
          text={cms?.kitchenBody?.trim() || d.kitchenBody}
          documentId={documentId}
          documentType="sitePage"
          path="podGuide.kitchenBody"
          className="mt-4"
        />
        <div className="mt-6 flex flex-wrap items-start gap-3">
          {quoteButton()}
          <LinkPlaceholder
            documentId={documentId}
            path="podGuide.kitchenLinkHref"
            writePath="podGuide.kitchenLinkHref"
            label={cms?.kitchenLinkLabel?.trim() || d.kitchenLinkLabel}
            href={cms?.kitchenLinkHref}
          />
        </div>
      </section>

      <section id={`${series}-faq`} className="scroll-mt-24">
        <h2 className="type-section" {...cmsEdit(documentId, "sitePage", "podGuide.faqTitle")}>
          {s("podGuide.faqTitle", cms?.faqTitle?.trim() || d.faqTitle)}
        </h2>
        <dl className="mt-5 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white" {...cmsEdit(documentId, "sitePage", "podGuide.faq")}>
          {faqs.map((item, i) => (
            <div key={item.question} className="px-5 py-4">
              <dt className="font-heading text-brand" {...cmsEdit(documentId, "sitePage", `podGuide.faq[${i}].question`)}>
                {s(`podGuide.faq[${i}].question`, item.question)}
              </dt>
              <dd className="type-body mt-2" {...cmsEdit(documentId, "sitePage", `podGuide.faq[${i}].answer`)}>
                {s(`podGuide.faq[${i}].answer`, item.answer)}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
