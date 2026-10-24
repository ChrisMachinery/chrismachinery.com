/** Shared title vs inline-bold rules for Solutions and Blog articles. */
export function looksLikeArticleHeading(text: string) {
  const value = text.trim();
  if (!value || value.length > 140) return false;
  if (/^\d+\.\s+\S/.test(value)) return true;
  return !/[.!?]$/.test(value);
}

export function unwrapMarkdownBoldLine(text: string) {
  const match = text.trim().match(/^\*\*(.+)\*\*$/);
  return match ? match[1].trim() : null;
}
