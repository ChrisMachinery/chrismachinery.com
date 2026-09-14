"use client";

import { useEffect } from "react";

function isProtected(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("img, picture, [data-protect-image]"));
}

export function ProtectSiteImages() {
  useEffect(() => {
    const block = (event: Event) => {
      if (isProtected(event.target)) event.preventDefault();
    };
    document.addEventListener("contextmenu", block, true);
    document.addEventListener("dragstart", block, true);
    return () => {
      document.removeEventListener("contextmenu", block, true);
      document.removeEventListener("dragstart", block, true);
    };
  }, []);
  return null;
}
