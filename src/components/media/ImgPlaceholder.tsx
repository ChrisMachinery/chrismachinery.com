import { vercelStegaClean } from "@vercel/stega";
import { cmsEdit, stegaText, type SanityEditProps } from "@/lib/sanity/visual";

export function ImgPlaceholder({
  label,
  alt,
  className = "",
  priority = false,
  src,
  objectPosition,
  documentId,
  documentType,
  path,
}: {
  label: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  src?: string;
  objectPosition?: string;
  documentId?: string;
  documentType?: string;
  path?: string;
}) {
  const encoded =
    documentId && documentType && path
      ? stegaText(documentId, documentType, path, vercelStegaClean(label))
      : label;
  const clean = vercelStegaClean(encoded);
  const seoAlt = vercelStegaClean(alt ?? "");
  const edit: SanityEditProps | undefined =
    documentId && documentType && path ? cmsEdit(documentId, documentType, path) : undefined;

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} {...edit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={seoAlt || clean}
          className="pointer-events-none h-full w-full object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          loading={priority ? "eager" : "lazy"}
          draggable={false}
          suppressHydrationWarning
        />
        <span
          data-protect-image=""
          className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-3 text-center text-sm text-transparent"
        >
          {encoded}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`img-placeholder flex items-center justify-center text-center px-3 ${className}`}
      role="img"
      aria-label={clean}
      data-priority={priority ? "true" : undefined}
      {...edit}
    >
      [图片: {encoded}]
    </div>
  );
}
