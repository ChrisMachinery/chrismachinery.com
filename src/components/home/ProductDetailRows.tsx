import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { PlainTextBody } from "@/components/media/PlainTextBody";

export type ProductDetailRow = {
  title: string;
  body: string;
  imageUrl?: string;
  imageLabel: string;
};

export function ProductDetailRows({
  documentId,
  heading,
  items,
}: {
  documentId: string;
  heading: string;
  items: ProductDetailRow[];
}) {
  if (!items.length) return null;

  return (
    <section className="bg-neutral-200 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="type-section">{heading}</h2>
        <div className="mt-10 space-y-12 md:space-y-16">
          {items.map((item, i) => {
            const imageFirst = i % 2 === 1;
            return (
              <article
                key={i}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                <div className={`rounded-2xl bg-white p-6 shadow-sm md:p-8 ${imageFirst ? "lg:order-2" : ""}`}>
                  <h3 className="type-sub">{item.title}</h3>
                  <PlainTextBody
                    text={item.body}
                    documentId={documentId}
                    path={`productDetails[${i}].body`}
                  />
                </div>
                <ImgPlaceholder
                  documentId={documentId}
                  documentType="pageContent"
                  path={`productDetails[${i}].image`}
                  label={item.imageLabel}
                  className={`aspect-[8/5] w-full rounded-2xl ${imageFirst ? "lg:order-1" : ""}`}
                  src={item.imageUrl}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
