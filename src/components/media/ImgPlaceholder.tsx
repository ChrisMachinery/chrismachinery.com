import { cmsEdit, type SanityEditProps } from "@/lib/sanity/visual";

export function ImgPlaceholder({
  label: _label,
  alt,
  className = "",
  priority = false,
  src,
  objectPosition,
  documentId,
  documentType,
  path,
}: {
  label?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
  src?: string;
  objectPosition?: string;
  documentId?: string;
  documentType?: string;
  path?: string;
}) {
  const seoAlt = (alt || "").trim();
  const edit: SanityEditProps | undefined =
    documentId && documentType && path ? cmsEdit(documentId, documentType, path) : undefined;

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} {...edit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={seoAlt}
          className="pointer-events-none h-full w-full object-cover"
          style={objectPosition ? { objectPosition } : undefined}
          loading={priority ? "eager" : "lazy"}
          draggable={false}
          suppressHydrationWarning
        />
        <span data-protect-image="" className="absolute inset-0 z-[1]" aria-hidden />
      </div>
    );
  }

  return <div className={`img-placeholder ${className}`} {...edit} />;
}
