import type { ReactNode } from "react";
import { CatalogSeriesGuide } from "@/components/products/CatalogSeriesGuide";
import type { SeriesGuideCms } from "@/lib/seriesGuides";

export function PodSeriesGuide({
  documentId,
  cms,
  shapeGuide,
}: {
  documentId?: string;
  cms?: SeriesGuideCms | null;
  shapeGuide?: ReactNode;
}) {
  return <CatalogSeriesGuide series="pod" documentId={documentId} cms={cms} shapeGuide={shapeGuide} />;
}
