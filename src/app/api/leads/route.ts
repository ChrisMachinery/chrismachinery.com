import { NextRequest, NextResponse } from "next/server";
import { createSanityInquiry } from "@/lib/sanity/fetch";
import { quotePdf, saveLead } from "@/lib/leads";

function isBot(form: FormData | Record<string, unknown>) {
  const honey =
    form instanceof FormData ? String(form.get("company_website") ?? "") : String(form.company_website ?? "");
  return honey.trim().length > 0;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  let payload: Record<string, unknown> = {};

  try {
    if (contentType.includes("application/json")) {
      payload = (await req.json()) as Record<string, unknown>;
    } else {
      const form = await req.formData();
      if (isBot(form)) {
        return NextResponse.json({ ok: true });
      }
      payload = Object.fromEntries(form.entries());
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (isBot(payload)) {
    return NextResponse.json({ ok: true });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const country = String(payload.country ?? "").trim();
  const product = String(payload.product ?? "").trim();
  const message = String(payload.message ?? "").trim();
  if (!email || !country) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let customConfig: Record<string, unknown> | undefined;
  try {
    customConfig =
      typeof payload.customConfig === "string"
        ? (JSON.parse(payload.customConfig || "{}") as Record<string, unknown>)
        : ((payload.customConfig as Record<string, unknown> | undefined) ?? undefined);
  } catch {
    return NextResponse.json({ error: "Invalid custom config" }, { status: 400 });
  }

  const lead = await saveLead({
    name,
    email,
    phone,
    product,
    shape: String(payload.shape ?? ""),
    material: String(payload.material ?? ""),
    message,
    country,
    budget: String(payload.budget ?? ""),
    sourceUrl: req.headers.get("referer") ?? "",
    customConfig,
    geo: req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? "",
  });

  const config = lead.customConfig;
  try {
    const inquiry = await createSanityInquiry({
      inquiryId: lead.inquiryId,
      createdAt: lead.createdAt,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      country: lead.country || country,
      productName: lead.product,
      productSlug: String(payload.productSlug ?? "").trim() || undefined,
      series: config && typeof config.series === "string" ? config.series : undefined,
      sizeLabel: config && typeof config.sizeLabel === "string" ? config.sizeLabel : undefined,
      solutionName: config && typeof config.solutionName === "string" ? config.solutionName : undefined,
      shape: lead.shape,
      material: lead.material,
      message: lead.message,
    });
    if (!inquiry && (process.env.VERCEL || process.env.NODE_ENV === "production")) {
      return NextResponse.json({ error: "Inquiry could not be saved" }, { status: 503 });
    }
  } catch (error) {
    console.error("[sanity] inquiry create failed", error);
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Inquiry could not be saved" }, { status: 503 });
    }
  }

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    }).catch(() => undefined);
  }

  if (process.env.SALES_NOTIFY_EMAIL) {
    console.info(`[lead] notify ${process.env.SALES_NOTIFY_EMAIL}`, lead.inquiryId);
  }

  const pdf = await quotePdf(lead);
  return NextResponse.json(
    {
      ok: true,
      inquiryId: lead.inquiryId,
      pdfBase64: pdf.toString("base64"),
      filename: `${lead.inquiryId}.pdf`,
    },
    { status: 201 },
  );
}
