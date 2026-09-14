export function googleMapsEmbedSrc(value?: string) {
  const raw = (value || "").trim();
  if (!raw) return undefined;
  const fromIframe = raw.match(/src=["']([^"']+)["']/i)?.[1];
  const src = fromIframe || raw;
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname;
    const embed = url.searchParams.get("output") === "embed" || path.includes("embed");
    if (host === "google.com" && (path.startsWith("/maps/embed") || (path === "/maps" && embed))) return src;
    if (host === "maps.google.com" && embed) return src;
  } catch {
    return undefined;
  }
  return undefined;
}
