"use client";

import { useTranslations } from "next-intl";
import { shapeChipLabel, shapeGroupLabel } from "@/lib/productFamily";
import { specLabel } from "@/lib/specI18n";

export function ShapeOptionChips({
  shapes,
  value,
  onChange,
  label,
}: {
  shapes: string[];
  value?: string;
  onChange?: (shape: string) => void;
  label?: string;
}) {
  const t = useTranslations();
  if (!shapes.length) return null;
  const group = label ?? (shapeGroupLabel(shapes) === "Arc" ? t("specs.shape") : t("specs.shape"));
  return (
    <div className="mt-2">
      <p className="text-xs text-black/55">{group}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {shapes.map((shape) => {
          const selected = value ? value === shape : false;
          const clickable = Boolean(onChange);
          const mapped = specLabel(t, shape);
          const display = mapped !== shape ? mapped : shapeChipLabel(shape);
          return clickable ? (
            <button
              key={shape}
              type="button"
              className={`rounded border px-2 py-1 text-xs ${selected ? "border-brand bg-accent" : "border-black/15 bg-black/5"}`}
              onClick={() => onChange?.(shape)}
            >
              {display}
            </button>
          ) : (
            <span key={shape} className="rounded bg-black/5 px-2 py-1 text-xs">
              {display}
            </span>
          );
        })}
      </div>
    </div>
  );
}
