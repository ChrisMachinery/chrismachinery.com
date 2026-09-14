"use client";

import { useIsPresentationTool } from "@sanity/visual-editing/react";
import { usePathname } from "next/navigation";

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

export function DraftPreviewExtras({ draft }: { draft: boolean }) {
  const isPresentation = useIsPresentationTool();
  const pathname = usePathname();

  if (!draft || isPresentation !== false) return null;

  const exitHref = `/api/draft-mode/disable?redirect=${encodeURIComponent(pathname || "/")}`;
  const onSolutions = /\/solutions\/?$/.test(pathname || "");

  return (
    <div className="fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-full border border-black/10 bg-brand px-4 py-2 text-sm text-white shadow-lg">
      <span>Draft preview</span>
      {onSolutions ? (
        <a
          href={`${studioUrl}/intent/edit/id=solutionsBoard;type=solutionsBoard`}
          className="rounded-full border border-white/30 px-3 py-1 font-medium text-white hover:bg-white/10"
        >
          增减方案卡片
        </a>
      ) : null}
      <a href={exitHref} className="rounded-full bg-accent px-3 py-1 font-medium text-brand hover:opacity-90">
        Exit
      </a>
    </div>
  );
}
