import { timingSafeEqual } from "node:crypto";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName, variantCookieName } from "@sanity/preview-url-secret/constants";
import { cookies, draftMode } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";
import { client } from "@/lib/sanity.client";

function secretsEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function previewClient(token: string) {
  return client.withConfig({
    token,
    useCdn: false,
    stega: false,
  });
}

function tokenCandidates() {
  return [process.env.SANITY_API_READ_TOKEN, process.env.SANITY_API_WRITE_TOKEN].filter(
    (token): token is string => Boolean(token),
  );
}

function safeRedirectPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/api/draft-mode")) return "/";
  return path;
}

function cookieFlags(request: Request) {
  const isSecure = true;
  const partitioned =
    isSecure &&
    request.headers.get("sec-fetch-dest") === "iframe" &&
    request.headers.get("sec-fetch-site") === "cross-site";
  return {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none" as const,
    partitioned,
  };
}

export async function GET(request: Request) {
  try {
    return await enableDraftMode(request);
  } catch (error) {
    unstable_rethrow(error);
    console.error("[draft-mode/enable]", error instanceof Error ? error.message : error);
    return new Response("Draft mode could not start. Is the Next.js app running?", { status: 500 });
  }
}

async function enableDraftMode(request: Request) {
  let redirectTo = "/";
  let studioPreviewPerspective: string | undefined;
  let studioPreviewVariant: string | undefined;
  let isValid = false;

  for (const token of tokenCandidates()) {
    try {
      const result = await validatePreviewUrl(previewClient(token), request.url);
      if (result.isValid) {
        isValid = true;
        redirectTo = safeRedirectPath(result.redirectTo || "/");
        studioPreviewPerspective = result.studioPreviewPerspective ?? undefined;
        studioPreviewVariant = result.studioPreviewVariant ?? undefined;
        break;
      }
    } catch (error) {
      console.error(
        "[draft-mode/enable] Sanity token rejected while validating preview secret:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  if (!isValid) {
    const url = new URL(request.url);
    const previewSecret = url.searchParams.get("sanity-preview-secret") || "";
    const expected = process.env.SANITY_PREVIEW_SECRET?.trim() || "";
    if (previewSecret && expected && secretsEqual(previewSecret, expected)) {
      isValid = true;
      redirectTo = safeRedirectPath(url.searchParams.get("sanity-preview-pathname") || "/");
      studioPreviewPerspective = url.searchParams.get("sanity-preview-perspective") || "drafts";
      studioPreviewVariant = url.searchParams.get("sanity-preview-variant") || undefined;
    }
  }

  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draftModeStore = await draftMode();
  if (!draftModeStore.isEnabled) {
    draftModeStore.enable();
  }

  const flags = cookieFlags(request);
  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");
  if (bypass?.value) {
    cookieStore.set({
      name: "__prerender_bypass",
      value: bypass.value,
      ...flags,
    });
  }

  if (studioPreviewPerspective) {
    cookieStore.set({
      name: perspectiveCookieName,
      value: studioPreviewPerspective,
      ...flags,
    });
  }

  if (studioPreviewVariant) {
    cookieStore.set({
      name: variantCookieName,
      value: studioPreviewVariant,
      ...flags,
    });
  }

  return redirect(redirectTo);
}
