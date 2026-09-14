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
import { getPageContent } from "@/lib/sanity/fetch";
import { plainText } from "@/lib/sanity/visual";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/favicon.ico" },
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
    home: plainText(page?.navHome || tNav("home")),
    products: plainText(page?.navProducts || tNav("products")),
    solutions: plainText(page?.navSolutions || tNav("solutions")),
    about: plainText(page?.navAbout || tNav("about")),
    customize: plainText(page?.navCustomize || tNav("customize")),
    blog: plainText(page?.navBlog || tNav("blog")),
    contact: plainText(page?.navContact || tNav("contact")),
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans">
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
