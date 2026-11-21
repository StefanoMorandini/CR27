import type { Dictionary } from "@/i18n/dictionaries/it";

export type NavKey = "programma" | "risultati" | "info" | "food" | "pernottamento" | "sponsor" | "comitato";

/** Ordine delle sezioni nel menu. Le etichette arrivano dal dizionario. */
export const navKeys: NavKey[] = ["programma", "risultati", "info", "food", "pernottamento", "sponsor", "comitato"];

export type NavItem = { key: NavKey; href: string; label: string };

export function buildNav(lang: string, dict: Dictionary): NavItem[] {
  return navKeys.map((key) => ({ key, href: `/${lang}/${key}`, label: dict.nav[key] }));
}
