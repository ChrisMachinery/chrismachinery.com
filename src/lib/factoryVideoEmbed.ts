const YT_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;
const BVID = /^BV[\w]+$/i;

function youtubeEmbed(id: string) {
  return YT_ID.test(id) ? `https://www.youtube.com/embed/${id}` : undefined;
}

export function factoryVideoEmbedSrc(value?: string) {
  const raw = (value || "").trim();
  if (!raw) return undefined;
  const fromIframe = raw.match(/src=["']([^"']+)["']/i)?.[1];
  const src = fromIframe || raw;
  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);

    if (host === "youtu.be") return youtubeEmbed(parts[0] || "");
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
        return youtubeEmbed(parts[1] || "");
      }
      const v = url.searchParams.get("v");
      if (v) return youtubeEmbed(v);
    }
    if (host === "vimeo.com") {
      const id = parts.find((part) => VIMEO_ID.test(part));
      return id ? `https://player.vimeo.com/video/${id}` : undefined;
    }
    if (host === "player.vimeo.com" && parts[0] === "video" && VIMEO_ID.test(parts[1] || "")) {
      return `https://player.vimeo.com/video/${parts[1]}`;
    }
    if (host === "bilibili.com" || host === "m.bilibili.com") {
      const bvid = parts.find((part) => BVID.test(part));
      return bvid ? `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0` : undefined;
    }
    if (host === "player.bilibili.com") {
      const bvid = url.searchParams.get("bvid") || "";
      return BVID.test(bvid) ? `https://player.bilibili.com/player.html?bvid=${bvid}&autoplay=0` : undefined;
    }
  } catch {
    return undefined;
  }
  return undefined;
}
