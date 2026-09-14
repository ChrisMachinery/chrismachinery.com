export const DEFAULT_SOCIAL_PLATFORMS = [
  "WhatsApp",
  "Email",
  "Facebook",
  "Instagram",
  "YouTube",
] as const;

export type SocialKey = "whatsapp" | "email" | "wechat" | "facebook" | "instagram" | "youtube";

const KEY_ALIASES: Record<string, SocialKey> = {
  whatsapp: "whatsapp",
  wa: "whatsapp",
  email: "email",
  mail: "email",
  邮箱: "email",
  wechat: "wechat",
  weixin: "wechat",
  微信: "wechat",
  facebook: "facebook",
  fb: "facebook",
  instagram: "instagram",
  ig: "instagram",
  youtube: "youtube",
  yt: "youtube",
};

export function isHiddenSocialPlatform(value?: string) {
  const raw = (value || "").trim().toLowerCase();
  return (
    raw.includes("linkedin") ||
    raw.includes("领英") ||
    raw.includes("wechat") ||
    raw.includes("weixin") ||
    raw.includes("微信")
  );
}

export function socialKey(value?: string): SocialKey | undefined {
  const raw = (value || "").trim().toLowerCase();
  if (!raw || isHiddenSocialPlatform(raw)) return undefined;
  return KEY_ALIASES[raw] || KEY_ALIASES[raw.replace(/\s+/g, "")];
}

export function socialHref(key: SocialKey | undefined, url?: string) {
  const href = url?.trim() || "";
  if (!href) return undefined;
  if (key === "email" && !href.includes("://") && href.includes("@")) return `mailto:${href}`;
  if (key === "whatsapp" && /^\+?\d[\d\s-]{7,}$/.test(href.replace(/\s/g, ""))) {
    return `https://wa.me/${href.replace(/\D/g, "")}`;
  }
  return href;
}

export function resolveFooterSocialLinks(cms?: { platform?: string; url?: string }[]) {
  const fromCms = (cms ?? [])
    .map((item, index) => ({ ...item, index }))
    .filter((item) => !isHiddenSocialPlatform(item.platform));

  return DEFAULT_SOCIAL_PLATFORMS.map((label, i) => {
    const byName = fromCms.find((item) => socialKey(item.platform) === socialKey(label));
    const hit = byName ?? fromCms[i];
    const platform = hit?.platform?.trim() || label;
    const key = socialKey(platform) ?? socialKey(label) ?? "whatsapp";
    return {
      key,
      label,
      platform,
      url: hit?.url?.trim() || "",
      index: hit?.index ?? i,
    };
  });
}
