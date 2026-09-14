import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";

export type ArcGuideItem = {
  _key?: string;
  label?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SeriesOptionGuideDefaults = {
  title: string;
  note: string;
  items: readonly { label: string; body: string }[];
};

export function SeriesArcGuide({
  documentId,
  title,
  note,
  items,
  defaults,
  imageAlts,
  sectionId,
  placeholderSuffix,
  columns,
  imageAspectClass = "aspect-[5/2]",
}: {
  documentId?: string;
  title?: string;
  note?: string;
  items?: ArcGuideItem[];
  defaults: SeriesOptionGuideDefaults;
  imageAlts?: readonly { alt?: string }[];
  sectionId: string;
  placeholderSuffix: string;
  columns: 2 | 3;
  imageAspectClass?: string;
}) {
  const list =
    items?.filter((item) => item.label || item.body || item.imageUrl)?.length
      ? items.filter((item) => item.label || item.body || item.imageUrl)
      : defaults.items.map((item) => ({ ...item }));
  const heading = title?.trim() || defaults.title;
  const blurb = note?.trim() || defaults.note;
  const s = (path: string, text: string) => stegaText(documentId, "sitePage", path, text);
  const shown = list.slice(0, columns);

  return (
    <section
      id={sectionId}
      className="mt-8 scroll-mt-24 rounded-2xl border border-black/10 bg-black/[0.03] p-5 md:p-6"
      {...cmsEdit(documentId, "sitePage", "arcGuides")}
    >
      <h2 className="font-heading text-lg text-brand">{s("arcGuideTitle", heading)}</h2>
      <p className="type-body mt-2 max-w-3xl">{s("arcGuideNote", blurb)}</p>
      <div className={columns === 2 ? "mt-5 grid gap-4 sm:grid-cols-2" : "mt-5 grid gap-4 sm:grid-cols-3"}>
        {shown.map((item, i) => {
          const fallback = defaults.items[i];
          const row = item as ArcGuideItem;
          const label = row.label?.trim() || fallback?.label || "";
          const body = row.body?.trim() || fallback?.body || "";
          return (
            <article key={row._key || label || i} className="flex flex-col rounded-xl bg-white p-4 shadow-sm">
              <p className="font-heading text-xl text-brand">{s(`arcGuides[${i}].label`, label)}</p>
              <p className="type-body mt-2">{s(`arcGuides[${i}].body`, body)}</p>
              <ImgPlaceholder
                documentId={documentId}
                documentType="sitePage"
                path={`arcGuides[${i}].image`}
                label={`${label} ${placeholderSuffix}`}
                alt={row.imageAlt || imageAlts?.[i]?.alt}
                className={`mt-4 ${imageAspectClass} w-full rounded-lg`}
                src={row.imageUrl}
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
