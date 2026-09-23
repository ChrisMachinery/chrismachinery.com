"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ComponentProps } from "react";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { Link } from "@/i18n/navigation";

type AppHref = ComponentProps<typeof Link>["href"];

export type HeroSlideView = {
  title: string;
  subtitle: string;
  imageLabel: string;
  src?: string;
  primaryText: string;
  primaryHref: string;
  secondaryText: string;
  secondaryHref: string;
};

function BannerLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <PreviewNavLink href={href as AppHref} className={className}>
      {children}
    </PreviewNavLink>
  );
}

export function HeroBanner({
  documentId,
  slides,
}: {
  documentId: string;
  slides: HeroSlideView[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = slides[index] ?? slides[0];

  useEffect(() => {
    if (count < 2 || paused) return;
    if (typeof window !== "undefined" && window.self !== window.top) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % count);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!current) return null;

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Homepage banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[70vh] w-full md:min-h-[80vh]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <ImgPlaceholder
              priority={i === 0}
              documentId={documentId}
              documentType="pageContent"
              path={`heroSlides[${i}].image`}
              alt={slide.title}
              className="h-full min-h-[70vh] w-full md:min-h-[80vh]"
              src={slide.src}
            />
          </div>
        ))}
        {current.src ? (
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent" />
        ) : null}

        <div className="absolute inset-0 z-10 flex items-start justify-start p-2 sm:p-3 md:p-4">
          <div
            key={index}
            className="w-[min(100%,13.75rem)] rounded-md bg-white/25 p-2.5 shadow-sm ring-1 ring-white/35 backdrop-blur-[4px] sm:w-auto sm:max-w-xs sm:p-3 md:max-w-sm md:p-3.5"
          >
            <h1 className="font-heading text-base leading-snug text-brand drop-shadow-sm sm:text-lg md:text-xl">
              {current.title}
            </h1>
            <p className="mt-1 text-xs leading-snug text-black/70 sm:text-sm">{current.subtitle}</p>
            <div className="mt-2.5 flex flex-col gap-1.5 sm:mt-3 sm:flex-row sm:flex-wrap sm:gap-2">
              <BannerLink
                href={current.primaryHref}
                className="min-touch inline-flex items-center justify-center rounded bg-accent px-3 font-heading text-xs text-brand shadow-sm hover:scale-[1.02] sm:px-4 sm:text-sm"
              >
                {current.primaryText}
              </BannerLink>
              <BannerLink
                href={current.secondaryHref}
                className="min-touch inline-flex items-center justify-center rounded border border-brand px-3 font-heading text-xs text-brand hover:bg-black/5 sm:px-4 sm:text-sm"
              >
                {current.secondaryText}
              </BannerLink>
            </div>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="min-touch absolute start-3 top-1/2 z-20 inline-flex -translate-y-1/2 rounded-full bg-white/80 px-3 text-xl font-semibold text-brand shadow"
            aria-label="Previous banner"
            onClick={() => setIndex((value) => (value - 1 + count) % count)}
          >
            ‹
          </button>
          <button
            type="button"
            className="min-touch absolute end-3 top-1/2 z-20 inline-flex -translate-y-1/2 rounded-full bg-white/80 px-3 text-xl font-semibold text-brand shadow"
            aria-label="Next banner"
            onClick={() => setIndex((value) => (value + 1) % count)}
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index ? true : undefined}
                className={`h-2.5 rounded-full ${
                  i === index ? "w-8 bg-accent" : "w-2.5 bg-white/80"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
