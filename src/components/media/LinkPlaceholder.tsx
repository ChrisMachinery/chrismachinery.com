"use client";

import { cmsLinkEdit } from "@/lib/sanity/visual";

export function LinkPlaceholder({
  label,
  writePath,
  href,
  documentId,
  documentType = "sitePage",
  path,
  className = "",
}: {
  label: string;
  writePath: string;
  href?: string;
  documentId?: string;
  documentType?: string;
  path: string;
  className?: string;
}) {
  const edit = cmsLinkEdit(documentId, documentType, path);
  const cleanHref = href?.trim() || "";
  const hint = `写入位置：${writePath}`;

  if (cleanHref) {
    const external = cleanHref.startsWith("http");
    return (
      <a
        href={cleanHref}
        className={`min-touch inline-flex items-center font-heading text-black underline underline-offset-2 hover:text-black ${className}`}
        {...edit}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`link-placeholder min-touch inline-flex flex-col items-start rounded border border-dashed border-black/25 bg-black/[0.03] px-2 py-1 text-left ${className}`}
      title={`链接待替换 · ${hint}`}
      {...edit}
      onClick={() => {
        if (window.self !== window.top) return;
        window.alert(`链接待替换：【LINK: ${label}】\n${hint}`);
      }}
    >
      <span className="font-heading text-black">{label}</span>
      <span className="text-[11px] font-normal text-black/45">{hint}</span>
    </button>
  );
}
