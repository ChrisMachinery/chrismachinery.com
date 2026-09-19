import { getLocale, getTranslations } from "next-intl/server";
import { localePrefix } from "@/lib/inquirySource";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { StockCardCarousel } from "@/components/products/StockCardCarousel";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";
import { videoHostKind } from "@/lib/factoryVideoEmbed";
import { withSearchParams } from "@/lib/solutionQuote";
import type { StockCard } from "@/lib/sanity/map";
import type { ComponentProps } from "react";

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) return null;
  return (
    <div className="mt-3">
      <p className="text-xs uppercase tracking-wide text-black/45">{label}</p>
      <p className="type-body mt-1 whitespace-pre-line">{value}</p>
    </div>
  );
}

export async function InStockBoard({
  boardId,
  cards,
}: {
  boardId: string;
  cards: StockCard[];
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  if (!cards.length) {
    return (
      <p className="mt-10 rounded border border-dashed border-black/20 p-8">
        {t("products.inStockEmpty")}
      </p>
    );
  }

  return (
    <div
      className="mt-10 grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
      {...cmsEdit(boardId, "stockBoard", "cards")}
    >
      {cards.map((item) => {
        const s = (path: string, text: string) => stegaText(item._id, "stockUnit", path, text);
        const qty = item.quantity || 1;
        const quoteHref = withSearchParams("/contact", {
          stock: "1",
          stockId: item._id,
          product: item.productSlug,
          model: item.model,
          qty: String(qty),
          color: item.colorMaterial?.slice(0, 120),
          dim: item.bodyDimension?.slice(0, 120),
          include: item.include?.slice(0, 400),
          from: `${localePrefix(locale)}/products/in-stock#stock-${item._id}`,
        }) as ComponentProps<typeof PreviewNavLink>["href"];
        return (
          <article
            id={`stock-${item._id}`}
            key={item._id}
            className="card-hover flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-black/5 bg-white"
          >
            <StockCardCarousel
              documentId={item._id}
              photos={item.photos}
              label={item.model || "In-stock trailer"}
              videoHref={item.videoUrl}
              videoLabel={t("stock.watchVideo")}
            />
            <div className="flex min-h-0 flex-1 flex-col p-5">
              <Spec label={t("stock.model")} value={s("title", item.model)} />
              <Spec label={t("stock.qtyLabel")} value={s("quantity", String(qty))} />
              <Spec label={t("stock.color")} value={s("colorMaterial", item.colorMaterial)} />
              <Spec label={t("stock.dimension")} value={s("bodyDimension", item.bodyDimension)} />
              <Spec label={t("stock.include")} value={s("include", item.include)} />
              {item.videoUrl ? (
                <div className="mt-3" {...cmsEdit(item._id, "stockUnit", "videoUrl")}>
                  <p className="text-xs uppercase tracking-wide text-black/45">{t("stock.video")}</p>
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body mt-1 inline-flex min-touch items-center gap-2 font-heading text-brand underline underline-offset-2 hover:text-black"
                  >
                    {t(
                      (
                        {
                          youtube: "stock.watchYoutube",
                          vimeo: "stock.watchVimeo",
                          bilibili: "stock.watchBilibili",
                          video: "stock.watchVideo",
                        } as const
                      )[videoHostKind(item.videoUrl)],
                    )}
                  </a>
                </div>
              ) : null}
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <PreviewNavLink
                  href={quoteHref}
                  className="min-touch inline-flex items-center rounded bg-accent px-5 font-heading text-brand"
                >
                  {t("stock.quote")}
                </PreviewNavLink>
                {item.productHref ? (
                  <PreviewNavLink
                    href={item.productHref as ComponentProps<typeof PreviewNavLink>["href"]}
                    className="min-touch inline-flex items-center rounded border border-brand px-5 font-heading text-brand"
                  >
                    {t("stock.view")}
                  </PreviewNavLink>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
