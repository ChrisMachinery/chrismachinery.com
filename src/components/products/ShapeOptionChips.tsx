"use client";

import { shapeChipLabel, shapeGroupLabel } from "@/lib/productFamily";

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
  if (!shapes.length) return null;
  const group = label ?? shapeGroupLabel(shapes);
  return (
    <div className="mt-2">
      <p className="text-xs text-black/55">{group}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {shapes.map((shape) => {
          const selected = value ? value === shape : false;
          const clickable = Boolean(onChange);
          return clickable ? (
            <button
              key={shape}
              type="button"
              className={`rounded border px-2 py-1 text-xs ${selected ? "border-brand bg-accent" : "border-black/15 bg-black/5"}`}
              onClick={() => onChange?.(shape)}
            >
              {shapeChipLabel(shape)}
            </button>
          ) : (
            <span key={shape} className="rounded bg-black/5 px-2 py-1 text-xs">
              {shapeChipLabel(shape)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
