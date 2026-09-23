import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Inter, Montserrat } from "next/font/google";
import { routing } from "@/i18n/routing";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DraftPreviewExtras } from "@/components/sanity/DraftPreviewExtras";
import { SanityLive } from "@/lib/sanity.live";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProtectSiteImages } from "@/components/media/ProtectSiteImages";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getPageContent } from "@/lib/sanity/fetch";
import { plainText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Chris Machinery food trailers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isDraft = (await draftMode()).isEnabled;
  const tNav = await getTranslations("nav");
  let page: Awaited<ReturnType<typeof getPageContent>> = null;
  try {
    page = await getPageContent();
  } catch {
    page = null;
  }
  const nav = {
    documentId: page?._id,
    logoUrl: page?.logoUrl,
    brand: plainText(page?.brandName || "Chris Machinery"),
    home: plainText(uiText(locale, page?.navHome, tNav("home"))),
    products: plainText(uiText(locale, page?.navProducts, tNav("products"))),
    solutions: plainText(uiText(locale, page?.navSolutions, tNav("solutions"))),
    about: plainText(uiText(locale, page?.navAbout, tNav("about"))),
    customize: plainText(uiText(locale, page?.navCustomize, tNav("customize"))),
    blog: plainText(uiText(locale, page?.navBlog, tNav("blog"))),
    contact: plainText(uiText(locale, page?.navContact, tNav("contact"))),
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans">
        {isDraft ? null : <GoogleAnalytics />}
        <style
          dangerouslySetInnerHTML={{
            __html: `
html{-webkit-text-size-adjust:100%;}
body{margin:0;background:#fff;color:#4a5568;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;}
img,video{max-width:100%;height:auto;display:block;}
.site-header{position:sticky;top:0;z-index:40;background:#fff;border-bottom:1px solid rgba(0,0,0,.06);}
.site-header-inner{display:flex;align-items:center;justify-content:space-between;gap:12px;max-width:80rem;margin:0 auto;padding:12px 16px;}
.site-nav-desktop{display:none;}
.site-menu-btn{display:inline-flex;align-items:center;justify-content:center;}
@media (min-width:1024px){
  .site-nav-desktop{display:flex;align-items:center;gap:4px;}
  .site-menu-btn{display:none;}
}
`,
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header cms={nav} />
          <ProtectSiteImages />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
          {isDraft ? (
            <>
              <SanityLive onReconnect={false} onRestart={false} />
              <VisualEditing />
              <DraftPreviewExtras draft />
            </>
          ) : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
