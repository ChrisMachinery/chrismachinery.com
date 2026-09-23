"use client";

import { at, insert, remove, setIfMissing } from "@sanity/mutate";
import { useDocuments } from "@sanity/visual-editing/react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { cmsEdit } from "@/lib/sanity/visual";

export const FACTORY_PHOTO_MAX = 8;

function newImageKey() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

function PhotoGrid({
  documentId,
  images,
  onRemove,
}: {
  documentId?: string;
  images: (string | undefined)[];
  onRemove?: (index: number) => void;
}) {
  if (!images.length) return null;
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      {images.map((src, i) => (
        <div key={`${src || "empty"}-${i}`} className="relative">
          <ImgPlaceholder
            documentId={documentId}
            documentType="sitePage"
            path={`gallery[${i}]`}
            alt={`Factory photo ${i + 1}`}
            className="aspect-video min-h-48 w-full rounded-lg"
            src={src}
          />
          {onRemove ? (
            <button
              type="button"
              aria-label={`Remove factory photo ${i + 1}`}
              onClick={() => onRemove(i)}
              className="absolute top-2 right-2 z-10 rounded bg-white/90 px-2 py-1 text-xs font-heading text-brand shadow"
            >
              删除
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function FactoryPhotoGallery({
  documentId,
  images,
  heading = "Factory photos",
}: {
  documentId?: string;
  images: (string | undefined)[];
  heading?: string;
}) {
  if (!images.length) return null;
  return (
    <section className="mt-16">
      <h2 className="type-section">{heading}</h2>
      <PhotoGrid documentId={documentId} images={images} />
    </section>
  );
}

export function FactoryPhotoGalleryEditor({
  documentId,
  images,
  heading = "Factory photos",
}: {
  documentId?: string;
  images: (string | undefined)[];
  heading?: string;
}) {
  const { getDocument } = useDocuments();
  const count = images.length;
  const canAdd = Boolean(documentId && count < FACTORY_PHOTO_MAX);

  const addPhoto = () => {
    if (!canAdd || !documentId) return;
    getDocument(documentId).patch(
      [
        at("gallery", setIfMissing([])),
        at("gallery", insert({ _type: "image", _key: newImageKey() }, "after", -1)),
      ],
      { commit: { debounce: 200 } },
    );
  };

  const removePhoto = (index: number) => {
    if (!documentId) return;
    getDocument(documentId).patch([at("gallery", remove(index))], { commit: { debounce: 200 } });
  };

  return (
    <section className="mt-16" {...cmsEdit(documentId, "sitePage", "gallery")}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="type-section">{heading}</h2>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canAdd}
            onClick={addPhoto}
            className="min-touch rounded border border-black/10 px-3 font-heading text-sm text-brand disabled:opacity-40"
          >
            增加
          </button>
          <button
            type="button"
            disabled={!count}
            onClick={() => removePhoto(count - 1)}
            className="min-touch rounded border border-black/10 px-3 font-heading text-sm text-brand disabled:opacity-40"
          >
            删除
          </button>
        </div>
      </div>
      {count ? (
        <PhotoGrid documentId={documentId} images={images} onRemove={removePhoto} />
      ) : (
        <p className="type-body mt-4 text-black/55">
          点「增加」添加 16:9 · 1800×1000 JPG 工厂图（最多 {FACTORY_PHOTO_MAX} 张）。
        </p>
      )}
    </section>
  );
}
