/** Prefer CMS on English. Other locales: full translation, or full CMS — never a short stub. */
export function uiText(locale: string, cms: string | undefined, translated: string) {
  const cmsValue = cms?.trim() || "";
  const translatedValue = translated?.trim() || "";
  if (locale === "en") return cmsValue || translatedValue;
  return translatedValue || cmsValue;
}
