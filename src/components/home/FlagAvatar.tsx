import type { ReactNode } from "react";
import { vercelStegaClean } from "@vercel/stega";
import { cmsEdit } from "@/lib/sanity/visual";

function GbFlag() {
  return (
    <svg viewBox="0 0 60 30" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#012169" d="M0 0h60v30H0z" />
      <path stroke="#fff" strokeWidth="6" d="M0 0l60 30M60 0L0 30" />
      <path stroke="#C8102E" strokeWidth="4" d="M0 0l60 30M60 0L0 30" />
      <path stroke="#fff" strokeWidth="10" d="M30 0v30M0 15h60" />
      <path stroke="#C8102E" strokeWidth="6" d="M30 0v30M0 15h60" />
    </svg>
  );
}

function ChFlag() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#DA291C" d="M0 0h32v32H0z" />
      <path fill="#fff" d="M13 6h6v20h-6zM6 13h20v6H6z" />
    </svg>
  );
}

function PtFlag() {
  return (
    <svg viewBox="0 0 60 40" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#006600" d="M0 0h24v40H0z" />
      <path fill="#FF0000" d="M24 0h36v40H24z" />
      <circle cx="24" cy="20" r="7" fill="#FFCC00" />
    </svg>
  );
}

function NoFlag() {
  return (
    <svg viewBox="0 0 22 16" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#BA0C2F" d="M0 0h22v16H0z" />
      <path fill="#fff" d="M0 6.4h22v3.2H0zM6.4 0h3.2v16H6.4z" />
      <path fill="#00205B" d="M0 7.2h22v1.6H0zM7.2 0h1.6v16H7.2z" />
    </svg>
  );
}

function AtFlag() {
  return (
    <svg viewBox="0 0 21 15" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#ED2939" d="M0 0h21v15H0z" />
      <path fill="#fff" d="M0 5h21v5H0z" />
    </svg>
  );
}

function FrFlag() {
  return (
    <svg viewBox="0 0 9 6" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <path fill="#002654" d="M0 0h3v6H0z" />
      <path fill="#fff" d="M3 0h3v6H3z" />
      <path fill="#ED2939" d="M6 0h3v6H6z" />
    </svg>
  );
}

const FLAG: Record<string, ReactNode> = {
  gb: <GbFlag />,
  ch: <ChFlag />,
  pt: <PtFlag />,
  no: <NoFlag />,
  at: <AtFlag />,
  fr: <FrFlag />,
};

export function FlagAvatar({
  iso,
  label,
  documentId,
  path,
}: {
  iso: string;
  label: string;
  documentId?: string;
  path?: string;
}) {
  const code = vercelStegaClean(iso || "").toLowerCase();
  const edit =
    documentId && path ? cmsEdit(documentId, "pageContent", path) : undefined;

  return (
    <span
      className="relative mb-3 inline-flex h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-neutral-100"
      title={label}
      {...edit}
    >
      {FLAG[code] || FLAG.gb}
    </span>
  );
}
