"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { products as localProducts, productSizeKey, productSizeLabel, type Product } from "@/data/products";
import { colorPresets, equipment as localEquipment, trailerExtras as localExtras } from "@/data/catalog";
import {
  DRAFT_KEY,
  emptyDraft,
  equipmentTotal,
  extrasTotal,
  formatInquiryMessage,
  matchProduct,
  materialLabel,
  materialsForSeries,
  normalizeMaterial,
  seriesFromCatalog,
  seriesNeedsShape,
  shapesForSeries,
  sizesForSeries,
  type CustomizerDraft,
  type MaterialKind,
} from "@/lib/customizer";
import { productMaterials, productShapes, shapeChipLabel } from "@/lib/productFamily";
import { buildQuoteSnapshot } from "@/lib/quoteTable";

const fonts = ["Montserrat", "Inter", "Oswald", "Playfair Display"];
const templates = ["Badge", "Script", "Block", "Circle", "Flag", "Minimal"];

export function Customizer({
  catalog = localProducts,
  extras = localExtras,
  kitchen = localEquipment,
  seedSlug,
  seedMaterial,
  seedShape,
  seedSolution,
}: {
  catalog?: Product[];
  extras?: typeof localExtras;
  kitchen?: typeof localEquipment;
  seedSlug?: string;
  seedMaterial?: string;
  seedShape?: string;
  seedSolution?: { slug: string; name: string; equipmentIds: string[] };
}) {
  const t = useTranslations("customizer");
  const router = useRouter();
  const [draft, setDraft] = useState<CustomizerDraft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let next: CustomizerDraft = emptyDraft;
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<CustomizerDraft>;
        next = {
          ...emptyDraft,
          ...parsed,
          extras: parsed.extras ?? {},
          equipment: parsed.equipment ?? [],
        };
      } catch {
        /* ignore */
      }
    }
    if (seedSlug) {
      const product = catalog.find((item) => item.slug === seedSlug);
      if (product) {
        const kinds = productMaterials(product)
          .map((item) => normalizeMaterial(item))
          .filter((item): item is MaterialKind => Boolean(item));
        const fromUrl = seedMaterial ? normalizeMaterial(seedMaterial) : null;
        const material =
          (fromUrl && kinds.includes(fromUrl) ? fromUrl : kinds[0]) ??
          normalizeMaterial(product.material) ??
          "";
        const productShapeList = productShapes(product);
        const seriesShapes = shapesForSeries(product.series, catalog);
        const shape =
          (seedShape && seriesShapes.includes(seedShape) ? seedShape : "") ||
          productShapeList[0] ||
          "";
        next = {
          ...next,
          series: product.series,
          sizeKey: productSizeKey(product),
          sizeLabel: productSizeLabel(product),
          shape,
          material,
          stainlessFinish: material === "stainless" ? next.stainlessFinish : "",
          slug: product.slug,
        };
      }
    }
    if (seedSolution?.equipmentIds.length) {
      next = {
        ...next,
        extras: {},
        equipment: seedSolution.equipmentIds,
        solutionSlug: seedSolution.slug,
        solutionName: seedSolution.name,
      };
    }
    setDraft(next);
    setReady(true);
  }, [seedSlug, seedMaterial, seedShape, seedSolution, catalog]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, ready]);

  const seriesList = useMemo(() => seriesFromCatalog(catalog), [catalog]);
  const sizes = useMemo(
    () => (draft.series ? sizesForSeries(catalog, draft.series, draft.shape) : []),
    [catalog, draft.series, draft.shape],
  );
  const shapes = useMemo(
    () => (draft.series && seriesNeedsShape(draft.series) ? shapesForSeries(draft.series, catalog) : []),
    [catalog, draft.series],
  );
  const materials = useMemo(
    () => (draft.series && draft.sizeKey ? materialsForSeries(draft.series, catalog, draft.sizeKey) : []),
    [catalog, draft.series, draft.sizeKey],
  );

  useEffect(() => {
    if (!draft.series || sizes.length !== 1 || draft.sizeKey) return;
    const only = sizes[0];
    const kinds = materialsForSeries(draft.series, catalog, only.key);
    const product = matchProduct(
      catalog,
      draft.series,
      only.key,
      kinds.length === 1 ? kinds[0] : "",
      draft.shape,
    );
    setDraft((d) => ({
      ...d,
      sizeKey: only.key,
      sizeLabel: only.label,
      material: kinds.length === 1 ? kinds[0] : "",
      stainlessFinish: kinds.length === 1 && kinds[0] === "paint" ? "" : d.stainlessFinish,
      slug: product?.slug ?? "",
    }));
  }, [catalog, draft.series, draft.sizeKey, sizes]);

  useEffect(() => {
    if (!draft.sizeKey || !materials.length) return;
    const allowed = Boolean(draft.material && materials.includes(draft.material));
    if (allowed) return;
    const next = materials.length === 1 ? materials[0] : "";
    if (draft.material === next) return;
    const product = matchProduct(catalog, draft.series, draft.sizeKey, next, draft.shape);
    setDraft((d) => ({
      ...d,
      material: next,
      stainlessFinish: next === "stainless" ? d.stainlessFinish : "",
      slug: product?.slug ?? d.slug,
    }));
  }, [catalog, draft.material, draft.series, draft.sizeKey, materials]);

  const extraSum = extrasTotal(draft, extras);
  const kitchenSum = equipmentTotal(draft, kitchen);
  const total = extraSum + kitchenSum;
  const categories = [...new Set(kitchen.map((item) => item.category))];

  function selectSeries(series: string) {
    setDraft((d) => ({
      ...emptyDraft,
      series,
      brandName: d.brandName,
      font: d.font,
      template: d.template,
      logoName: d.logoName,
      extras: d.extras,
      equipment: d.equipment,
      solutionSlug: d.solutionSlug,
      solutionName: d.solutionName,
    }));
    setError("");
  }

  function selectShape(shape: string) {
    const nextSizes = sizesForSeries(catalog, draft.series, shape);
    const keepSize = nextSizes.some((item) => item.key === draft.sizeKey);
    const sizeKey = keepSize ? draft.sizeKey : "";
    const sizeLabel = keepSize ? draft.sizeLabel : "";
    const material = keepSize ? draft.material : "";
    const product = matchProduct(catalog, draft.series, sizeKey, material, shape);
    setDraft((d) => ({
      ...d,
      shape,
      sizeKey,
      sizeLabel,
      material,
      stainlessFinish: material === "stainless" ? d.stainlessFinish : "",
      slug: product?.slug ?? "",
    }));
    setError("");
  }

  function selectSize(key: string, label: string) {
    const kinds = materialsForSeries(draft.series, catalog, key);
    const material = kinds.length === 1 ? kinds[0] : "";
    const product = matchProduct(catalog, draft.series, key, material, draft.shape);
    setDraft((d) => ({
      ...d,
      sizeKey: key,
      sizeLabel: label,
      material,
      stainlessFinish: material === "stainless" ? d.stainlessFinish : "",
      slug: product?.slug ?? "",
    }));
    setError("");
  }

  function selectMaterial(kind: MaterialKind) {
    const product = matchProduct(catalog, draft.series, draft.sizeKey, kind, draft.shape);
    setDraft((d) => ({
      ...d,
      material: kind,
      stainlessFinish: kind === "stainless" ? d.stainlessFinish : "",
      slug: product?.slug ?? d.slug,
    }));
    setError("");
  }

  function sendInquiry() {
    if (!draft.series || !draft.sizeKey || !draft.material) {
      setError(t("requiredError"));
      return;
    }
    if (seriesNeedsShape(draft.series) && !draft.shape) {
      setError(t("requiredError"));
      return;
    }
    if (draft.material === "stainless" && !draft.stainlessFinish) {
      setError(t("requiredError"));
      return;
    }
    const payload = {
      ...draft,
      estimatedEquipmentUsd: total,
      quoteSnapshot: buildQuoteSnapshot(draft, extras, kitchen),
    };
    const message = formatInquiryMessage(draft, extras, kitchen);
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...payload, inquiryMessage: message }));
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    router.push(
      `/contact?${new URLSearchParams({
        ...(draft.slug ? { product: draft.slug } : {}),
        ...(draft.shape ? { shape: draft.shape } : {}),
        ...(draft.material === "stainless"
          ? { material: "Stainless steel" }
          : draft.material === "paint"
            ? { material: "Paint" }
            : {}),
        ...(draft.solutionSlug ? { solution: draft.solutionSlug } : {}),
      }).toString()}`,
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section>
        <h2 className="type-sub">
          {t("stepSeries")} <span className="text-red-700">*</span>
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {seriesList.map((item) => (
            <button
              key={item}
              type="button"
              className={`min-touch rounded px-4 capitalize ${draft.series === item ? "bg-accent" : "border border-black/10"}`}
              onClick={() => selectSeries(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {seriesNeedsShape(draft.series) ? (
        <section>
          <h2 className="type-sub">
            {t("stepShape")} <span className="text-red-700">*</span>
          </h2>
          <p className="mt-2 text-sm text-black/65">
            {draft.series === "pod" ? t("shapeHintPod") : t("shapeHintAirstream")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {shapes.map((shape) => (
              <button
                key={shape}
                type="button"
                className={`min-touch rounded px-4 ${draft.shape === shape ? "bg-accent" : "border border-black/10"}`}
                onClick={() => selectShape(shape)}
              >
                {shapeChipLabel(shape)}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="type-sub">
          {t("stepSize")} <span className="text-red-700">*</span>
        </h2>
        {draft.series ? (
          seriesNeedsShape(draft.series) && !draft.shape ? (
            <p className="mt-2 text-sm">{t("chooseShape")}</p>
          ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {sizes.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`min-touch rounded border px-3 text-start text-sm ${draft.sizeKey === item.key ? "border-brand bg-accent/50" : "border-black/10"}`}
                onClick={() => selectSize(item.key, item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>
          )
        ) : (
          <p className="mt-2 text-sm">{t("chooseSeries")}</p>
        )}
      </section>

      <section>
        <h2 className="type-sub">
          {t("stepMaterial")} <span className="text-red-700">*</span>
        </h2>
        {draft.sizeKey ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {materials.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className={`min-touch rounded px-4 ${draft.material === kind ? "bg-accent" : "border border-black/10"}`}
                  onClick={() => selectMaterial(kind)}
                >
                  {materialLabel(kind)}
                </button>
              ))}
            </div>
            {draft.material === "stainless" ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {(["matt", "mirror"] as const).map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    className={`min-touch rounded px-4 capitalize ${draft.stainlessFinish === finish ? "bg-accent" : "border border-black/10"}`}
                    onClick={() => setDraft((d) => ({ ...d, stainlessFinish: finish }))}
                  >
                    {finish === "matt" ? t("matt") : t("mirror")}
                  </button>
                ))}
              </div>
            ) : null}
            {draft.material === "paint" ? (
              <div className="mt-4">
                <p className="text-sm">{t("primary")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex + c.name}
                      type="button"
                      title={c.name}
                      className={`h-11 w-11 rounded border ${draft.hex === c.hex ? "border-brand ring-2 ring-accent" : "border-black/10"}`}
                      style={{ background: c.hex }}
                      onClick={() => setDraft((d) => ({ ...d, primary: c.hex, hex: c.hex }))}
                    />
                  ))}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <label className="text-sm">
                    {t("hex")}
                    <input
                      value={draft.hex}
                      onChange={(e) => setDraft((d) => ({ ...d, hex: e.target.value, primary: e.target.value }))}
                      className="mt-1 min-h-11 w-full rounded border px-2"
                    />
                  </label>
                  <label className="text-sm">
                    {t("ral")}
                    <input
                      value={draft.ral}
                      onChange={(e) => setDraft((d) => ({ ...d, ral: e.target.value }))}
                      className="mt-1 min-h-11 w-full rounded border px-2"
                      placeholder="RAL 9005"
                    />
                  </label>
                  <label className="text-sm">
                    {t("accent")}
                    <input
                      type="color"
                      value={draft.accent}
                      onChange={(e) => setDraft((d) => ({ ...d, accent: e.target.value }))}
                      className="mt-1 h-11 w-full"
                    />
                  </label>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-2 text-sm">{t("chooseSize")}</p>
        )}
      </section>

      <section>
        <h2 className="type-sub">{t("stepExtras")}</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm" suppressHydrationWarning>
            <thead>
              <tr className="border-b text-left text-brand">
                <th className="py-2 font-heading">{t("extraItem")}</th>
                <th className="py-2 font-heading">{t("qty")}</th>
                <th className="py-2 font-heading">{t("unitPrice")}</th>
                <th className="py-2 text-end font-heading">{t("lineTotal")}</th>
              </tr>
            </thead>
            <tbody>
              {extras.map((item) => {
                const qty = draft.extras[item.id] ?? 0;
                return (
                  <tr key={item.id} className="border-b border-black/5">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={0}
                        className="min-h-11 w-20 rounded border px-2"
                        value={qty}
                        onChange={(e) => {
                          const next = Math.max(0, Number(e.target.value) || 0);
                          setDraft((d) => ({ ...d, extras: { ...d.extras, [item.id]: next } }));
                        }}
                      />
                    </td>
                    <td className="py-2">USD {item.price}</td>
                    <td className="py-2 text-end">USD {(item.price * qty).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="type-sub">{t("equipment")}</h2>
        {draft.solutionName ? (
          <p className="type-body mt-2">
            {t("solutionPackage", { name: draft.solutionName })}
          </p>
        ) : null}
        {categories.map((cat) => (
          <fieldset key={cat} className="mt-3">
            <legend className="font-heading text-sm text-brand">{cat}</legend>
            {kitchen
              .filter((item) => item.category === cat)
              .map((item) => (
                <label key={item.id} className="flex min-h-11 items-center justify-between gap-3 text-sm">
                  <span>
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={draft.equipment.includes(item.id)}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          equipment: e.target.checked
                            ? [...d.equipment, item.id]
                            : d.equipment.filter((id) => id !== item.id),
                        }))
                      }
                    />
                    {item.name}
                  </span>
                  <span>USD {item.price}</span>
                </label>
              ))}
          </fieldset>
        ))}
      </section>

      <section>
        <h2 className="type-sub">{t("logo")}</h2>
        <input
          value={draft.brandName}
          onChange={(e) => setDraft((d) => ({ ...d, brandName: e.target.value }))}
          className="mt-2 min-h-11 w-full rounded border px-3"
          placeholder={t("brandPlaceholder")}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {fonts.map((font) => (
            <button
              key={font}
              type="button"
              className={`min-touch rounded px-3 text-sm ${draft.font === font ? "bg-accent" : "border"}`}
              onClick={() => setDraft((d) => ({ ...d, font }))}
            >
              {font}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {templates.map((template) => (
            <button
              key={template}
              type="button"
              className={`min-touch rounded px-3 text-sm ${draft.template === template ? "bg-accent" : "border"}`}
              onClick={() => setDraft((d) => ({ ...d, template }))}
            >
              {template}
            </button>
          ))}
        </div>
        <label className="mt-3 block text-sm">
          {t("upload")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="mt-2 block"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                setError("Logo must be JPG/PNG/WEBP and ≤ 2MB.");
                return;
              }
              setError("");
              setDraft((d) => ({ ...d, logoName: file.name }));
            }}
          />
        </label>
      </section>

      <div className="border-t pt-6">
        <p className="font-heading text-brand">
          {t("total")}: USD {total.toLocaleString()}
        </p>
        <p className="mt-1 text-xs">{t("draft")}</p>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <button
          type="button"
          onClick={sendInquiry}
          className="mt-4 min-touch w-full rounded bg-accent font-heading text-brand"
        >
          {t("send")}
        </button>
      </div>
    </div>
  );
}
