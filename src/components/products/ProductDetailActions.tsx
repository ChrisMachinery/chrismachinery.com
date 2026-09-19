"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { ProductCtaButton } from "@/components/products/ProductCtaButton";
import { ShapeOptionChips } from "@/components/products/ShapeOptionChips";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { withSearchParams } from "@/lib/solutionQuote";

export function ProductDetailActions({
  documentId,
  slug,
  shapes,
  materials,
  quoteText,
  quoteLink,
  customizeText,
  customizeLink,
  quoteLabel,
  customizeLabel,
  seriesGuideHref,
  seriesGuideText,
  materialLabel = "Material",
}: {
  documentId?: string;
  slug: string;
  shapes: string[];
  materials: string[];
  quoteText?: string;
  quoteLink?: string;
  customizeText?: string;
  customizeLink?: string;
  quoteLabel: string;
  customizeLabel: string;
  seriesGuideHref?: ComponentProps<typeof PreviewNavLink>["href"];
  seriesGuideText?: string;
  materialLabel?: string;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const fromShape = params.get("shape") || "";
  const fromMaterial = params.get("material") || "";
  const solution = params.get("solution") || "";
  const [shape, setShape] = useState(shapes.includes(fromShape) ? fromShape : shapes[0] || "");
  const [material, setMaterial] = useState(
    materials.includes(fromMaterial) ? fromMaterial : materials[0] || "",
  );
  const quoteHref = withSearchParams(quoteLink || `/contact?product=${slug}`, {
    shape,
    material,
    solution: solution || undefined,
    from: pathname,
  });
  const customizeHref = withSearchParams(customizeLink || `/customize?product=${slug}`, {
    shape,
    material,
    solution: solution || undefined,
  });

  return (
    <div className="mt-6">
      <ShapeOptionChips
        shapes={shapes}
        value={shape}
        onChange={shapes.length > 1 ? setShape : undefined}
      />
      <ShapeOptionChips
        shapes={materials}
        value={material}
        onChange={materials.length > 1 ? setMaterial : undefined}
        label={materialLabel}
      />
      {seriesGuideHref && seriesGuideText ? (
        <p className="mt-2 text-xs text-black/55">
          <PreviewNavLink href={seriesGuideHref} className="underline underline-offset-2 hover:text-brand">
            {seriesGuideText}
          </PreviewNavLink>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <ProductCtaButton
          documentId={documentId}
          textPath="quoteText"
          linkPath="quoteLink"
          text={quoteText || quoteLabel}
          href={quoteHref}
          wrapClassName="relative inline-block"
          className="min-touch inline-flex items-center rounded bg-accent px-5 font-heading text-brand"
        />
        <ProductCtaButton
          documentId={documentId}
          textPath="customizeText"
          linkPath="customizeLink"
          text={customizeText || customizeLabel}
          href={customizeHref}
          wrapClassName="relative inline-block"
          className="min-touch inline-flex items-center rounded border border-brand px-5 font-heading"
        />
      </div>
    </div>
  );
}
