"use client";

import { useEffect, useState } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";

export type DetailShotSlide = {
  imageUrl?: string;
  caption?: string;
  imageLabel: string;
  alt?: string;
};

function visibleCount() {
  if (typeof window === "undefined") return 4;
  if (window.matchMedia("(min-width: 1024px)").matches) return 4;
  if (window.matchMedia("(min-width: 640px)").matches) return 2;
  return 1;
}

export function DetailShotCarousel({
  documentId,
  documentType = "pageContent",
  pathPrefix = "detailShots",
  heading,
  slides,
  contained = true,
  showCaptions = true,
  ariaLabel = "Close-up detail photos",
}: {
  documentId: string;
  documentType?: string;
  pathPrefix?: string;
  heading: string;
  slides: DetailShotSlide[];
  contained?: boolean;
  showCaptions?: boolean;
  ariaLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(4);
  const count = slides.length;
  const maxIndex = Math.max(0, count - visible);

  useEffect(() => {
    const sync = () => setVisible(visibleCount());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    setIndex((value) => Math.min(value, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || maxIndex < 1) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value >= maxIndex ? 0 : value + 1));
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, maxIndex]);

  if (!count) return null;

  const inner = (
    <>
      <div className="flex items-end justify-between gap-4">
        <h2 className="type-card">{heading}</h2>
        {maxIndex > 0 ? (
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous photos"
              className="min-touch rounded border border-black/10 px-3 font-heading text-sm text-brand"
              onClick={() => setIndex((value) => (value <= 0 ? maxIndex : value - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photos"
              className="min-touch rounded border border-black/10 px-3 font-heading text-sm text-brand"
              onClick={() => setIndex((value) => (value >= maxIndex ? 0 : value + 1))}
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-6 overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${(index * 100) / visible}%)` }}
        >
          {slides.map((slide, i) => (
            <figure key={i} className="w-full shrink-0 px-1.5 sm:w-1/2 lg:w-1/4">
              <ImgPlaceholder
                documentId={documentId}
                documentType={documentType}
                path={`${pathPrefix}[${i}].image`}
                alt={slide.alt || ""}
                className="aspect-[4/3] w-full rounded-xl"
                src={slide.imageUrl}
              />
              {showCaptions && slide.caption ? (
                <figcaption className="type-body mt-2 px-0.5">{slide.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>
      {maxIndex > 0 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo set ${i + 1}`}
              aria-current={i === index ? true : undefined}
              className={`h-2 rounded-full ${i === index ? "w-5 bg-brand" : "w-2 bg-black/20"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </>
  );

  return (
    <section
      className={contained ? "bg-white py-10 md:py-12" : "mt-14 md:mt-16"}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {contained ? <div className="mx-auto max-w-7xl px-4">{inner}</div> : inner}
    </section>
  );
}
