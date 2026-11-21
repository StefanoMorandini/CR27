/**
 * Lingue del sito. Per attivarne una nuova:
 *  1. aggiungerla a `locales`
 *  2. creare `src/i18n/dictionaries/<codice>.ts` (stesso tipo di `it.ts`)
 *  3. registrarla in `src/i18n/dictionaries/index.ts`
 */
export const locales = ["it"] as const;
// Previste in futuro: "de", "fr", "en"

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const localeNames: Record<string, string> = {
  it: "Italiano",
  de: "Deutsch",
  fr: "Français",
  en: "English",
};

/** Locale BCP 47 per date e numeri. */
export const intlLocale: Record<Locale, string> = {
  it: "it-CH",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Costruisce un percorso con il prefisso della lingua: localePath("it", "/programma") → "/it/programma" */
export function localePath(lang: string, path = "/") {
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
