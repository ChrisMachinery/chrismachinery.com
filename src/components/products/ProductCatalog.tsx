"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Product, SeriesKey } from "@/data/products";
import { filterOptions, productKgLabel, productSizeLabel } from "@/data/products";
import { CatalogProductCard } from "@/components/products/CatalogProductCard";
import { materialFilterIsUseful, productMaterials, productShapes, shapeFilterIsUseful } from "@/lib/productFamily";

type Filters = {
  width: number[];
  length: number[];
  shape: string[];
  material: string[];
  axle: string[];
};

const empty: Filters = {
  width: [],
  length: [],
  shape: [],
  material: [],
  axle: [],
};

function axleFilterLabel(value: string) {
  if (value === "Single Axle") return "Single";
  if (value === "Tandem Axle") return "Tandem";
  return value;
}

function toggle(list: number[] | string[], value: number | string) {
  const next = list as (number | string)[];
  return next.includes(value)
    ? next.filter((item) => item !== value)
    : [...next, value];
}

export function ProductCatalog({
  series,
  items,
  mode,
}: {
  series: SeriesKey | "in-stock";
  items: Product[];
  mode: "filter" | "stock" | "others";
}) {
  const t = useTranslations();
  const [filters, setFilters] = useState<Filters>(empty);
  const [drawer, setDrawer] = useState(false);
  const [sort, setSort] = useState<"length" | "new">(mode === "others" ? "new" : "length");
  const [compare, setCompare] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = items.filter((item) => {
      if (filters.width.length && !filters.width.includes(item.width)) return false;
      if (filters.length.length && !filters.length.includes(item.length)) return false;
      if (filters.shape.length && !productShapes(item).some((shape) => filters.shape.includes(shape))) return false;
      if (filters.material.length && !productMaterials(item).some((mat) => filters.material.includes(mat))) return false;
      if (filters.axle.length && !filters.axle.includes(item.axle)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "new") return (b.year ?? 0) - (a.year ?? 0);
      return a.length - b.length;
    });
    return list;
  }, [items, filters, sort]);

  const compared = items.filter((item) => compare.includes(item.slug));
  const options = series !== "in-stock" && series !== "others" ? filterOptions[series] : null;
  const showShapeFilter = Boolean(options && shapeFilterIsUseful(items));
  const showMaterialFilter = Boolean(options && materialFilterIsUseful(items));

  function setCompareSlug(slug: string, on: boolean) {
    setCompare((prev) => {
      if (on) {
        if (prev.includes(slug) || prev.length >= 3) return prev;
        const next = [...prev, slug];
        requestAnimationFrame(() => {
          document.getElementById("compare")?.scrollIntoView({ behavior: "smooth" });
        });
        return next;
      }
      return prev.filter((id) => id !== slug);
    });
  }

  const filterUi = options ? (
    <div className="space-y-5">
      {(["width", "length", "shape", "material", "axle"] as const).map((key) => {
        if (key === "shape" && !showShapeFilter) return null;
        if (key === "material" && !showMaterialFilter) return null;
        const values = (options as Record<string, readonly (string | number)[] | undefined>)[key];
        if (!values) return null;
        return (
          <fieldset key={key}>
            <legend className="mb-2 font-heading text-sm text-brand">
              {key === "length"
                ? t("products.filterLength")
                : key === "width"
                  ? t("products.filterWidth")
                  : key === "axle"
                    ? t("products.filterAxle")
                    : key === "shape"
                      ? t("products.filterShape")
                      : key === "material"
                        ? t("products.filterMaterial")
                        : key}
            </legend>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = (filters[key] as (string | number)[]).includes(value);
                return (
                  <button
                    key={String(value)}
                    type="button"
                    className={`min-touch rounded border px-3 text-sm ${selected ? "border-brand bg-accent" : "border-black/15"}`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        [key]: toggle(prev[key] as never, value as never),
                      }))
                    }
                  >
                    {key === "axle" ? axleFilterLabel(String(value)) : String(value)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  ) : null;

  return (
    <div>
      {mode === "stock" ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {(["length", "new"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={`min-touch rounded px-4 text-sm font-semibold ${sort === key ? "bg-accent text-brand" : "border border-black/10"}`}
              onClick={() => setSort(key)}
            >
              {key === "length" ? t("products.sortLength") : t("products.sortNew")}
            </button>
          ))}
        </div>
      ) : null}

      {mode === "filter" ? (
        <>
          <div className="mb-4 lg:hidden">
            <button
              type="button"
              className="min-touch rounded bg-brand px-4 font-heading text-white"
              onClick={() => setDrawer(true)}
            >
              {t("cta.filter")}
            </button>
          </div>
          <p className="mb-6 text-sm">{t("products.summary", { count: filtered.length })}</p>
        </>
      ) : null}

      <div className={`grid gap-8 ${mode === "filter" ? "lg:grid-cols-[240px_1fr]" : ""}`}>
        {mode === "filter" ? (
          <aside className="hidden lg:block">{filterUi}</aside>
        ) : null}

        <div>
          {filtered.length === 0 ? (
            <p className="rounded border border-dashed border-black/20 p-8">
              {items.length === 0
                ? "This series has no products yet. Publish a product in Structure with this series selected."
                : mode === "stock"
                  ? t("products.inStockEmpty")
                  : t("products.noMatch")}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <CatalogProductCard
                  key={item.slug}
                  item={item}
                  compare={compare.includes(item.slug)}
                  quoteLabel={mode === "stock" ? t("cta.buy") : t("products.getQuote")}
                  onCompare={setCompareSlug}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {mode === "filter" || mode === "stock" ? (
        <section id="compare" className="mt-16">
          <h2 className="type-section">{t("products.compareTitle")}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="compare-table min-w-full border-collapse text-sm" suppressHydrationWarning>
              <thead>
                <tr>
                  {[
                    "Model",
                    t("products.bodySize"),
                    t("products.weight"),
                    t("products.loadCapacity"),
                    "Axle",
                    "Shape",
                    "Material",
                    "Stock",
                  ].map((label) => (
                    <th key={label} className="bg-white font-heading font-semibold text-brand">
                      <div>{label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(compared.length ? compared : filtered).map((item) => (
                  <tr key={item.slug} className={compare.includes(item.slug) ? "bg-accent/40" : "bg-white"}>
                    {[
                      item.name,
                      productSizeLabel(item),
                      productKgLabel(item.weight) || "—",
                      productKgLabel(item.loadCapacity) || "—",
                      item.axle,
                      productShapes(item).join(" / ") || "—",
                      productMaterials(item).join(" / ") || "—",
                      item.stockStatus,
                    ].map((value, col) => (
                      <td key={col} className={col === 0 ? "font-semibold text-brand" : "text-brand"}>
                        <div>{value}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {drawer ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setDrawer(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <button type="button" className="min-touch font-semibold" onClick={() => setFilters(empty)}>
                {t("cta.reset")}
              </button>
              <button type="button" className="min-touch font-semibold" onClick={() => setDrawer(false)}>
                {t("cta.close")}
              </button>
            </div>
            {filterUi}
            <button
              type="button"
              className="mt-6 min-touch w-full rounded bg-accent font-heading text-brand"
              onClick={() => setDrawer(false)}
            >
              {t("cta.results", { count: filtered.length })}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
