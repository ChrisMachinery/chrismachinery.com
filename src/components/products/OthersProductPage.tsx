import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { PlainTextBody } from "@/components/media/PlainTextBody";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { ProductCtaButton } from "@/components/products/ProductCtaButton";
import { getSitePage } from "@/lib/sanity/fetch";
import { resolveOthersCatalog } from "@/lib/othersCatalog";
import { localePrefix } from "@/lib/inquirySource";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";
import { withCanonical } from "@/lib/seoCanonical";
import type { Metadata } from "next";

export async function othersProductMetadata(locale: string, slug: string): Promise<Metadata> {
  const page = await getSitePage("/products/others");
  const card = resolveOthersCatalog(page?._id, page?.othersCards).find((row) => row.item.slug === slug);
  if (!card) return {};
  const description = card.body.replace(/\s+/g, " ").trim().slice(0, 160);
  return withCanonical(locale, `/products/others/${slug}`, {
    title: `${card.item.name} | Chris Machinery`,
    description: description || `${card.item.name} custom food trailer from Chris Machinery.`,
  });
}

export async function OthersProductPage({ locale, slug }: { locale: string; slug: string }) {
  const t = await getTranslations();
  const page = await getSitePage("/products/others");
  const card = resolveOthersCatalog(page?._id, page?.othersCards).find((row) => row.item.slug === slug);
  if (!card) notFound();
  const { item, body, edit } = card;
  const s = (path: string, text: string) => stegaText(edit.documentId, "sitePage", path, text);
  const from = `${localePrefix(locale)}/products/others/${item.slug}`;
  const quoteHref = `/contact?product=${item.slug}&from=${encodeURIComponent(from)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <PreviewNavLink href="/products/others" className="text-sm font-semibold text-brand underline underline-offset-2">
        {t("products.backToOthers")}
      </PreviewNavLink>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start">
        <ImgPlaceholder
          documentId={edit.documentId}
          documentType="sitePage"
          path={edit.imagePath}
          alt={item.name}
          className="aspect-square w-full rounded-lg"
          src={item.imageUrl}
        />
        <div>
          <h1 className="type-page" {...cmsEdit(edit.documentId, "sitePage", edit.titlePath || "title")}>
            {s(edit.titlePath || "title", item.name)}
          </h1>
          <PlainTextBody
            text={body}
            documentId={edit.documentId}
            documentType="sitePage"
            path={edit.bodyPath}
            className="mt-6"
          />
          {!body ? (
            <p
              className="type-body mt-6 min-h-24 rounded border border-dashed border-black/15 p-4 text-black/45"
              {...cmsEdit(edit.documentId, "sitePage", edit.bodyPath || "othersCards")}
            >
              {process.env.NODE_ENV === "production" ? "" : t("products.othersBodyHint")}
            </p>
          ) : null}
          <ProductCtaButton
            textPath="title"
            linkPath="title"
            text={t("products.getQuote")}
            href={quoteHref}
            previewNavigates
            wrapClassName="relative mt-8 inline-flex"
            className="min-touch inline-flex items-center justify-center rounded bg-accent px-8 font-heading text-brand"
          />
        </div>
      </div>
    </div>
  );
}
