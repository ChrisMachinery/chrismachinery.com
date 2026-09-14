import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { FactoryPhotoGallery, FactoryPhotoGalleryEditor } from "@/components/about/FactoryPhotoGallery";
import { ProcessStepCarousel } from "@/components/about/ProcessStepCarousel";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { PlainTextBody } from "@/components/media/PlainTextBody";
import { Hreflang } from "@/components/seo/JsonLd";
import { factoryVideoEmbedSrc } from "@/lib/factoryVideoEmbed";
import { getSitePage } from "@/lib/sanity/fetch";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Chris Machinery | Food Trailer Factory",
  description: "5,000㎡ factory, 200+ units per year, 50+ technicians, 30+ export markets.",
};

const defaultSteps = [
  { title: "Drafting", body: "Layout drawings signed off before we cut steel." },
  { title: "Cutting & welding", body: "Galvanized chassis and body work to drawing." },
  { title: "Finishing", body: "Polish, paint, or stainless — wrap-ready skins." },
  { title: "QC & packing", body: "Inspection photos, then crate-ready export packing." },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isDraft = (await draftMode()).isEnabled;
  const page = await getSitePage("/about");
  const id = page?._id;
  const s = (path: string, text: string) => stegaText(id, "sitePage", path, text);
  const stats = [
    ["Factory Area", s("factoryArea", page?.factoryArea ?? "5,000㎡")],
    ["Annual Output", s("annualOutput", page?.annualOutput ?? "200+ Units")],
    ["Skilled Technicians", s("technicians", page?.technicians ?? "50+")],
    ["Countries Exported", s("countries", page?.countries ?? "30+")],
  ] as const;
  const factoryVideo = factoryVideoEmbedSrc(page?.factoryVideoUrl);
  const gallery = isDraft
    ? (page?.galleryUrls ?? [])
    : (page?.galleryUrls ?? []).filter(Boolean);
  const steps = defaultSteps.map((step, i) => ({
    title: s(`buildSteps[${i}].title`, page?.buildSteps?.[i]?.title || step.title),
    body: s(`buildSteps[${i}].body`, page?.buildSteps?.[i]?.body || step.body),
    imageUrls: page?.buildSteps?.[i]?.imageUrls,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path="/about" />
      <h1 className="type-page" {...cmsEdit(id, "sitePage", "title")}>
        {s("title", page?.title ?? "About Us")}
      </h1>
      <p className="type-lede mt-4 max-w-3xl" {...cmsEdit(id, "sitePage", "subtitle")}>
        {s("subtitle", page?.subtitle || "5,000㎡ factory, 200+ units per year, 50+ technicians, 30+ export markets.")}
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([k, v], i) => {
          const path = (["factoryArea", "annualOutput", "technicians", "countries"] as const)[i];
          return (
            <div key={k} className="rounded-lg bg-dark p-6 text-white" {...cmsEdit(id, "sitePage", path)}>
              <p className="text-sm text-white/70">{k}</p>
              <p className="mt-2 font-heading text-3xl text-accent">{v}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="type-section" {...cmsEdit(id, "sitePage", "factoryTitle")}>
            {s("factoryTitle", page?.factoryTitle ?? "Our factory")}
          </h2>
          <PlainTextBody
            className="mt-4 max-w-xl"
            documentId={id}
            documentType="sitePage"
            path="factoryBody"
            text={
              page?.factoryBody ??
              "One plant in Jiangsu: drawings, fabrication, finish, and export packing under the same roof. Buyers get a named factory — not a trading desk."
            }
          />
        </div>
        <div>
          {factoryVideo ? (
            <div className="overflow-hidden rounded-lg bg-black" {...cmsEdit(id, "sitePage", "factoryVideoUrl")}>
              <iframe
                title="Chris Machinery factory video"
                src={factoryVideo}
                className="aspect-video w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <ImgPlaceholder
              documentId={id}
              documentType="sitePage"
              path="heroImage"
              label="可贴 YouTube 链接播视频，或放工厂全景 1 张。建议 16:9，约 1800×1000 JPG。"
              className="min-h-64 rounded-lg lg:min-h-80"
              src={page?.heroImageUrl}
            />
          )}
          {isDraft && !factoryVideo ? (
            <p className="type-body mt-3" {...cmsEdit(id, "sitePage", "factoryVideoUrl")}>
              {s("factoryVideoUrl", "Or paste a YouTube / Vimeo / Bilibili link")}
            </p>
          ) : null}
        </div>
      </div>

      <h2 className="type-section mt-16" {...cmsEdit(id, "sitePage", "buildTitle")}>
        {s("buildTitle", page?.buildTitle ?? "How we build")}
      </h2>
      <PlainTextBody
        className="mt-3 w-full"
        documentId={id}
        documentType="sitePage"
        path="buildIntro"
        text={
          page?.buildIntro ??
          "Four stages, one factory. This is the path we quote and ship against."
        }
      />
      <ol className="mt-8 grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={i} className="flex h-full min-h-0 flex-col border-t border-black/10 pt-4">
            <p className="text-xs tracking-wide text-black/45">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="type-card mt-2" {...cmsEdit(id, "sitePage", `buildSteps[${i}].title`)}>
              {step.title}
            </h3>
            <p className="type-body mt-2 min-h-16 flex-1" {...cmsEdit(id, "sitePage", `buildSteps[${i}].body`)}>
              {step.body}
            </p>
            <ProcessStepCarousel documentId={id} stepIndex={i} srcs={step.imageUrls} />
          </li>
        ))}
      </ol>

      {isDraft ? (
        <FactoryPhotoGalleryEditor documentId={id} images={gallery} />
      ) : (
        <FactoryPhotoGallery documentId={id} images={gallery} />
      )}
    </div>
  );
}
