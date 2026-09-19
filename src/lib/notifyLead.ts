import type { Lead } from "@/lib/types";

function leadText(lead: Lead) {
  return [
    `Inquiry: ${lead.inquiryId}`,
    `Date: ${lead.createdAt}`,
    `Name: ${lead.name || "-"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `Country: ${lead.country || lead.geo || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    `Product: ${lead.product || "-"}`,
    `Shape: ${lead.shape || "-"}`,
    `Material: ${lead.material || "-"}`,
    `Source: ${lead.sourceUrl || "-"}`,
    "",
    "Customer message:",
    lead.message?.trim() || "-",
  ].join("\n");
}

export async function notifyLeadEmail(lead: Lead, pdf: Buffer) {
  const to = process.env.LEADS_NOTIFY_EMAIL?.trim() || process.env.SALES_NOTIFY_EMAIL?.trim();
  const key = process.env.RESEND_API_KEY?.trim();
  if (!to || !key) return;

  const from = process.env.LEADS_FROM_EMAIL?.trim() || "Chris Machinery <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `[Inquiry] ${lead.inquiryId} ${lead.product || lead.email}`,
      text: leadText(lead),
      attachments: [
        {
          filename: `${lead.inquiryId}.pdf`,
          content: pdf.toString("base64"),
        },
      ],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[lead] email notify failed", res.status, detail.slice(0, 300));
  }
}
