"use client";

import { useEffect, useState } from "react";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";

const SLIDE_COUNT = 3;

export function ProcessStepCarousel({
  documentId,
  stepIndex,
  srcs,
}: {
  documentId?: string;
  stepIndex: number;
  srcs?: (string | undefined)[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % SLIDE_COUNT);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className="relative mt-auto w-full pt-4"
      aria-roledescription="carousel"
      aria-label={`Process step ${stepIndex + 1} photos`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <ImgPlaceholder
              documentId={documentId}
              documentType="sitePage"
              path={`buildSteps[${stepIndex}].images[${i}]`}
              alt={`Build step photo ${i + 1}`}
              className="h-full w-full break-words px-2 leading-snug"
              src={srcs?.[i]}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
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
    </div>
  );
}
