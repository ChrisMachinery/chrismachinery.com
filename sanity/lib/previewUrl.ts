export const PREVIEW_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

function vercelOrigin() {
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`;
  }
  return "";
}

export function previewOrigin() {
  return (
    process.env.SANITY_STUDIO_PREVIEW_ORIGIN ||
    process.env.NEXT_PUBLIC_PREVIEW_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    vercelOrigin() ||
    "http://localhost:3000"
  );
}

export function previewAllowOrigins() {
  return [
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://*.vercel.app",
    ...PREVIEW_ORIGINS,
    previewOrigin(),
    vercelOrigin(),
  ].filter(Boolean);
}
