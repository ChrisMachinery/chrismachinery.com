"use client";

import { useState } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";

export function ProductGallery({
  documentId,
  documentType = "product",
  alt,
  images,
}: {
  documentId?: string;
  documentType?: string;
  alt: string;
  images: { url: string; objectPosition?: string; path: string }[];
}) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  if (!current) {
    return (
      <ImgPlaceholder
        documentId={documentId}
        documentType={documentType}
        path="mainImage"
        alt={alt}
        className="aspect-square w-full rounded-lg"
      />
    );
  }

  return (
    <div>
      <ImgPlaceholder
        documentId={documentId}
        documentType={documentType}
        path={current.path}
        alt={alt}
        className="aspect-square w-full rounded-lg"
        src={current.url || undefined}
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
                documentType={documentType}
                path={image.path}
                alt={`${alt} photo ${i + 1}`}
                className="aspect-square w-full"
                src={image.url || undefined}
                objectPosition={image.objectPosition}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
