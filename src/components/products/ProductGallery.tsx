"use client";

import { useState } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";

export function ProductGallery({
  documentId,
  label,
  images,
}: {
  documentId?: string;
  label: string;
  images: { url: string; objectPosition?: string; path: string }[];
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  if (!current) {
    return (
      <ImgPlaceholder
        documentId={documentId}
        documentType="product"
        path="mainImage"
        label={label}
        className="aspect-square w-full rounded-lg"
      />
    );
  }

  return (
    <div>
      <ImgPlaceholder
        documentId={documentId}
        documentType="product"
        path={current.path}
        label={label}
        className="aspect-square w-full rounded-lg"
        src={current.url}
        objectPosition={current.objectPosition}
        priority
      />
      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {images.map((image, i) => (
            <button
              key={`${image.path}-${i}`}
              type="button"
              className={`min-touch overflow-hidden rounded border ${
                i === index ? "border-brand" : "border-black/10"
              }`}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
            >
              <ImgPlaceholder
                documentId={documentId}
                documentType="product"
                path={image.path}
                label={`${label} ${i + 1}`}
                className="aspect-square w-full"
                src={image.url}
                objectPosition={image.objectPosition}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
