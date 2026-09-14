"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { EquipmentItem, TrailerExtra } from "@/data/catalog";
import { equipment as localKitchen, trailerExtras as localExtras } from "@/data/catalog";
import type { Product } from "@/data/products";
import { getProduct } from "@/data/products";
import { ShapeOptionChips } from "@/components/products/ShapeOptionChips";
import { productMaterials, productShapes } from "@/lib/productFamily";
import { DRAFT_KEY, formatInquiryMessage, isCustomizerDraft } from "@/lib/customizer";
import { buildQuoteSnapshot } from "@/lib/quoteTable";
import { draftFromProduct } from "@/lib/solutionQuote";
import { normalizeMaterial } from "@/lib/customizer";

export function ContactForm({
  catalogProduct,
  initialShape,
  initialMaterial,
  extras = localExtras,
  kitchen = localKitchen,
  solutionQuote,
}: {
  catalogProduct?: Product;
  initialShape?: string;
  initialMaterial?: string;
  extras?: TrailerExtra[];
  kitchen?: EquipmentItem[];
  solutionQuote?: { slug: string; name: string; equipmentIds: string[] };
}) {
  const t = useTranslations();
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [inquiryId, setInquiryId] = useState("");
  const [sending, setSending] = useState(false);
  const shapes = catalogProduct ? productShapes(catalogProduct) : [];
  const materials = catalogProduct ? productMaterials(catalogProduct) : [];
  const [shape, setShape] = useState(
    initialShape && shapes.includes(initialShape) ? initialShape : shapes[0] || "",
  );
  const [material, setMaterial] = useState(
    initialMaterial && materials.includes(initialMaterial) ? initialMaterial : materials[0] || "",
  );

  const prefillProduct = useMemo(() => {
    const product = params.get("product");
    if (catalogProduct) return catalogProduct.name;
    if (product) return getProduct(product)?.name ?? product;
    if (solutionQuote) return solutionQuote.name;
    return "";
  }, [params, catalogProduct, solutionQuote]);

  const [message, setMessage] = useState("");
  const [product, setProduct] = useState(prefillProduct);
  const [productSlug, setProductSlug] = useState(params.get("product") ?? "");

  useEffect(() => {
    setProduct(prefillProduct);
  }, [prefillProduct]);

  useEffect(() => {
    const productParam = params.get("product") ?? catalogProduct?.slug ?? "";
    const raw = sessionStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(DRAFT_KEY);
    let draft: Record<string, unknown> | undefined;
    if (raw) {
      try {
        draft = JSON.parse(raw) as Record<string, unknown>;
      } catch {
        draft = undefined;
      }
    }

    const inquiryMessage = typeof draft?.inquiryMessage === "string" ? draft.inquiryMessage : "";
    const draftSlug = typeof draft?.slug === "string" ? draft.slug : "";
    const draftSolution = typeof draft?.solutionSlug === "string" ? draft.solutionSlug : "";
    const customizerDraft = draft && isCustomizerDraft(draft) ? draft : undefined;
    const matchesUrl =
      Boolean(customizerDraft) &&
      (!productParam || draftSlug === productParam) &&
      (!solutionQuote || draftSolution === solutionQuote.slug || inquiryMessage);

    if (inquiryMessage && matchesUrl) {
      setMessage((prev) => prev || inquiryMessage);
      if (draftSlug) setProductSlug(draftSlug);
      if (!prefillProduct && customizerDraft) {
        setProduct(
          [customizerDraft.series, customizerDraft.shape, customizerDraft.sizeLabel].filter(Boolean).join(" "),
        );
      }
      return;
    }

    if (solutionQuote?.equipmentIds.length) {
      const built = draftFromProduct(catalogProduct, {
        shape: initialShape,
        material: normalizeMaterial(initialMaterial) || undefined,
        equipment: solutionQuote.equipmentIds,
        solutionSlug: solutionQuote.slug,
        solutionName: solutionQuote.name,
      });
      setMessage(formatInquiryMessage(built, extras, kitchen));
      if (catalogProduct?.slug) setProductSlug(catalogProduct.slug);
      return;
    }

    if (customizerDraft && !productParam && !solutionQuote) {
      setMessage((prev) => prev || formatInquiryMessage(customizerDraft, extras, kitchen));
      if (draftSlug) setProductSlug(draftSlug);
    }
  }, [catalogProduct, extras, initialShape, kitchen, params, prefillProduct, solutionQuote]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const customRaw = sessionStorage.getItem(DRAFT_KEY) ?? localStorage.getItem(DRAFT_KEY);
    if (customRaw) {
      try {
        const parsed = JSON.parse(customRaw) as Record<string, unknown>;
        if (isCustomizerDraft(parsed)) {
          data.set(
            "customConfig",
            JSON.stringify({
              ...parsed,
              quoteSnapshot: buildQuoteSnapshot(parsed, extras, kitchen),
              inquiryMessage: formatInquiryMessage(parsed, extras, kitchen),
            }),
          );
        } else {
          data.set("customConfig", JSON.stringify(parsed));
        }
      } catch {
        data.set("customConfig", customRaw);
      }
    }

    setSending(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/leads", { method: "POST", body: data });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const json = (await res.json()) as { inquiryId: string; pdfBase64?: string; filename?: string };
      setInquiryId(json.inquiryId);
      setStatus("ok");
      if (json.pdfBase64 && json.filename) {
        const bytes = Uint8Array.from(atob(json.pdfBase64), (c) => c.charCodeAt(0));
        const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = json.filename;
        a.click();
      }
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setSending(false);
    }
  }

  if (status === "ok") {
    return (
      <p className="rounded-lg bg-accent/40 p-6 font-heading text-brand">
        {t("contact.success")} ({inquiryId})
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 text-sm">
      <label className="grid gap-1">
        {t("contact.name")}
        <input name="name" className="min-h-11 rounded border border-black/15 px-3" />
      </label>
      <label className="grid gap-1">
        {t("contact.email")} *
        <input required type="email" name="email" className="min-h-11 rounded border border-black/15 px-3" />
      </label>
      <label className="grid gap-1">
        {t("contact.phone")}
        <input name="phone" className="min-h-11 rounded border border-black/15 px-3" />
      </label>
      <label className="grid gap-1">
        {t("contact.product")}
        <input
          name="product"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="min-h-11 rounded border border-black/15 px-3"
        />
      </label>
      {shapes.length ? (
        <div className="grid gap-1">
          {t("contact.shape")}
          <ShapeOptionChips
            shapes={shapes}
            value={shape}
            onChange={shapes.length > 1 ? setShape : undefined}
          />
          <input type="hidden" name="shape" value={shape} />
        </div>
      ) : null}
      {materials.length ? (
        <div className="grid gap-1">
          {t("contact.material")}
          <ShapeOptionChips
            shapes={materials}
            value={material}
            onChange={materials.length > 1 ? setMaterial : undefined}
            label="Material"
          />
          <input type="hidden" name="material" value={material} />
        </div>
      ) : null}
      <input type="hidden" name="productSlug" value={productSlug} />
      <label className="grid gap-1">
        {t("contact.country")} *
        <input required name="country" className="min-h-11 rounded border border-black/15 px-3" />
      </label>
      <label className="grid gap-1">
        {t("contact.budget")}
        <input name="budget" className="min-h-11 rounded border border-black/15 px-3" />
      </label>
      <label className="grid gap-1">
        {t("contact.message")}
        <textarea
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="max-h-40 min-h-24 overflow-y-auto rounded border border-black/15 px-3 py-2 font-mono text-xs leading-5 text-black/70"
        />
      </label>
      <div aria-hidden className="hidden">
        <input name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
        <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
      ) : null}
      <button type="submit" disabled={sending} className="min-touch rounded bg-accent font-heading text-sm text-brand disabled:opacity-60">
        {t("cta.send")}
      </button>
      {status === "error" ? <p className="text-sm text-red-700">Please check required fields and try again.</p> : null}
    </form>
  );
}
