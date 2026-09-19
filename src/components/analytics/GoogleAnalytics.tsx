import Script from "next/script";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-E2C68S54GV";

export function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;
  const id = GA_MEASUREMENT_ID;
  if (!id.startsWith("G-")) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
