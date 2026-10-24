/** Lead title is large; later section titles are smaller; inline bold keeps body size. */
export function looksLikeArticleHeading(text: string, allStrong = false) {
  const value = text.trim();
  if (!value || value.length > 140) return false;
  if (/^\d+\.\s+\S/.test(value)) return true;
  return allStrong;
}

export function unwrapMarkdownBoldLine(text: string) {
  const match = text.trim().match(/^\*\*(.+)\*\*$/);
  return match ? match[1].trim() : null;
}

export function articleHeadingClass(isLead: boolean) {
  return isLead ? "type-section mt-2" : "type-h3 mt-6 mb-1.5";
}
