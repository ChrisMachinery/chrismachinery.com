"use client";

import { useEffect, useState } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";

export function StockCardCarousel({
  documentId,
  photos,
  label,
  videoHref,
  videoLabel,
}: {
  documentId?: string;
  photos: { url?: string; alt?: string }[];
  label: string;
  videoHref?: string;
  videoLabel?: string;
}) {
  const slides = photos.length ? photos : [{ url: undefined, alt: undefined }];
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setIndex((value) => Math.min(value, count - 1));
  }, [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  return (
    <div
      className="relative aspect-[16/10] w-full shrink-0 overflow-hidden"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((photo, i) => (
        <div
          key={`${photo.url || "empty"}-${i}`}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <ImgPlaceholder
            documentId={documentId}
            documentType="stockUnit"
            path={`photos[${i}]`}
            label={`${label} ${i + 1}`}
            alt={photo.alt}
            className="h-full w-full"
            src={photo.url}
          />
        </div>
      ))}
      {videoHref ? (
        <a
          href={videoHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute end-3 top-3 z-10 inline-flex items-center gap-1.5 rounded bg-black/70 px-2.5 py-1.5 text-xs font-heading text-white shadow hover:bg-black/85"
          aria-label={videoLabel || "Watch video"}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
            <path d="M8 5.5v13l11-6.5L8 5.5z" />
          </svg>
          {videoLabel || "Video"}
        </a>
      ) : null}
      {count > 1 ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index ? true : undefined}
              className={`h-2 rounded-full ${i === index ? "w-5 bg-accent" : "w-2 bg-white/80 shadow"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
