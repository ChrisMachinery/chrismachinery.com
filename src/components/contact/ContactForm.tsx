"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { isInquiryFormPath, localePrefix } from "@/lib/inquirySource";
import type { EquipmentItem, TrailerExtra } from "@/data/catalog";
import { equipment as localKitchen, trailerExtras as localExtras } from "@/data/catalog";
import type { Product } from "@/data/products";
import { getProduct } from "@/data/products";
import { ShapeOptionChips } from "@/components/products/ShapeOptionChips";
import { productMaterials, productShapes } from "@/lib/productFamily";
import { clearCustomizerDraft, draftForProduct, formatInquiryMessage } from "@/lib/customizer";
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
  stockInquiry,
}: {
  catalogProduct?: Product;
  initialShape?: string;
  initialMaterial?: string;
  extras?: TrailerExtra[];
  kitchen?: EquipmentItem[];
  solutionQuote?: { slug: string; name: string; equipmentIds: string[] };
  stockInquiry?: {
    model: string;
    quantity: string;
    color: string;
    dimension: string;
    include: string;
  };
}) {
  const t = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();
  const [sourceUrl, setSourceUrl] = useState("");
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
    if (stockInquiry?.model) return stockInquiry.model;
    if (product) return getProduct(product)?.name ?? product;
    if (solutionQuote) return solutionQuote.name;
    return "";
  }, [params, catalogProduct, solutionQuote, stockInquiry]);

  const [message, setMessage] = useState("");
  const [product, setProduct] = useState(prefillProduct);
  const [productSlug, setProductSlug] = useState(params.get("product") ?? "");

  useEffect(() => {
    setProduct(prefillProduct);
  }, [prefillProduct]);

  useEffect(() => {
    const productParam = params.get("product") ?? catalogProduct?.slug ?? "";
    if (stockInquiry?.model) {
      setProduct(stockInquiry.model);
      setProductSlug(productParam || catalogProduct?.slug || "");
      setMessage(
        t("stock.inquiryMessage", {
          model: stockInquiry.model,
          qty: stockInquiry.quantity || "1",
          color: stockInquiry.color || "—",
          dim: stockInquiry.dimension || "—",
          include: stockInquiry.include || "—",
        }),
      );
      return;
    }

    const customizerDraft = draftForProduct(productParam);
    const inquiryMessage = customizerDraft?.inquiryMessage || "";
    const draftSlug = customizerDraft?.slug || "";
    const draftSolution = customizerDraft?.solutionSlug || "";
    const matchesSolution = !solutionQuote || draftSolution === solutionQuote.slug || Boolean(inquiryMessage);

    if (customizerDraft && inquiryMessage && matchesSolution) {
      setMessage(inquiryMessage);
      if (draftSlug) setProductSlug(draftSlug);
      if (!prefillProduct) {
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

    if (customizerDraft) {
      setMessage(formatInquiryMessage(customizerDraft, extras, kitchen));
      if (draftSlug) setProductSlug(draftSlug);
      return;
    }

    setProductSlug(productParam);
    if (!solutionQuote) setMessage("");
  }, [catalogProduct, extras, initialShape, kitchen, params, prefillProduct, solutionQuote, stockInquiry, t]);

  useEffect(() => {
    const origin = window.location.origin;
    const from = params.get("from");
    if (from) {
      try {
        const url = from.startsWith("http") ? new URL(from) : new URL(from, origin);
        if (!isInquiryFormPath(url.pathname)) {
          setSourceUrl(`${origin}${url.pathname}${url.hash}`);
          return;
        }
      } catch {
        /* fall through */
      }
    }
    try {
      if (document.referrer) {
        const url = new URL(document.referrer);
        if (url.origin === origin && !isInquiryFormPath(url.pathname)) {
          setSourceUrl(`${url.origin}${url.pathname}${url.hash}`);
          return;
        }
      }
    } catch {
      /* fall through */
    }
    const prefix = localePrefix(locale);
    if (params.get("stock")) {
      const stockId = params.get("stockId");
      setSourceUrl(`${origin}${prefix}/products/in-stock${stockId ? `#stock-${stockId}` : ""}`);
      return;
    }
    if (params.get("solution") || solutionQuote?.slug) {
      setSourceUrl(`${origin}${prefix}/solutions`);
      return;
    }
    if (catalogProduct) {
      setSourceUrl(`${origin}${prefix}/products/${catalogProduct.series}/${catalogProduct.slug}`);
      return;
    }
    setSourceUrl("");
  }, [catalogProduct, locale, params, solutionQuote]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const customerMessage = String(data.get("message") ?? "");
    const productKey = String(data.get("productSlug") ?? productSlug).trim();
    const parsed = draftForProduct(productKey);
    const selected =
      parsed ||
      draftFromProduct(catalogProduct || (productKey ? getProduct(productKey) : undefined), {
        shape: String(data.get("shape") || shape),
        material: normalizeMaterial(String(data.get("material") || material)) || undefined,
        equipment: solutionQuote?.equipmentIds,
        solutionSlug: solutionQuote?.slug,
        solutionName: solutionQuote?.name,
      });
    if (selected.series || selected.slug || selected.sizeLabel) {
      data.set(
        "customConfig",
        JSON.stringify({
          ...selected,
          quoteSnapshot: buildQuoteSnapshot(selected, extras, kitchen),
          customerMessage,
        }),
      );
    }

    setSending(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/leads", { method: "POST", body: data });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const json = (await res.json()) as { inquiryId: string };
      setInquiryId(json.inquiryId);
      setStatus("ok");
      clearCustomizerDraft();
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
        {t("contact.name")} *
        <input required name="name" className="min-h-11 rounded border border-black/15 px-3" />
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
            label={t("contact.material")}
          />
          <input type="hidden" name="material" value={material} />
        </div>
      ) : null}
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="productSeries" value={catalogProduct?.series ?? ""} />
      <input type="hidden" name="sourceUrl" value={sourceUrl} />
      <input type="hidden" name="from" value={params.get("from") ?? ""} />
      <input type="hidden" name="stock" value={params.get("stock") === "1" ? "1" : ""} />
      <input type="hidden" name="stockId" value={params.get("stockId") ?? ""} />
      <input type="hidden" name="solution" value={params.get("solution") ?? solutionQuote?.slug ?? ""} />
      <input type="hidden" name="locale" value={locale} />
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
      {status === "error" ? <p className="text-sm text-red-700">{t("contact.error")}</p> : null}
    </form>
  );
}
