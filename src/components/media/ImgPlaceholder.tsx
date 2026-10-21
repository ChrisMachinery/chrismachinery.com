import { cmsImageEdit } from "@/lib/sanity/visual";

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
  const edit =
    documentId && documentType && path ? cmsImageEdit(documentId, documentType, path) : undefined;

  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`} data-protect-image="" {...edit}>
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
      </div>
    );
  }

  return (
    <div
      className={`img-placeholder relative flex items-center justify-center ${edit ? "cursor-pointer" : ""} ${className}`}
      {...edit}
    >
      {edit ? (
        <span className="pointer-events-none px-4 text-center text-sm text-black/40">点击上传图片</span>
      ) : null}
    </div>
  );
}
