import type { Dictionary } from "@/i18n/dictionaries/it";

export type NavKey = "programma" | "risultati" | "info" | "mappa" | "food" | "pernottamento" | "sponsor" | "chi-siamo" | "comitato";
export type GroupKey = "gara" | "info" | "ospitalita" | "about";

export type NavItem = { key: NavKey; href: string; label: string };
export type NavGroup = { key: GroupKey; label: string; items: NavItem[] };

/** Struttura del menu: gruppi e pagine. Un gruppo con una sola pagina è un link diretto. */
const structure: { key: GroupKey; items: NavKey[] }[] = [
  { key: "gara", items: ["programma", "risultati", "mappa"] },
  { key: "info", items: ["info"] },
  { key: "ospitalita", items: ["pernottamento", "food"] },
  { key: "about", items: ["chi-siamo", "comitato", "sponsor"] },
];

export function buildNavGroups(lang: string, dict: Dictionary): NavGroup[] {
  return structure.map((g) => ({
    key: g.key,
    label: dict.navGroups[g.key],
    items: g.items.map((key) => ({ key, href: `/${lang}/${key}`, label: dict.nav[key] })),
  }));
}

/** Elenco piatto delle pagine (nell'ordine del menu). */
export function buildNav(lang: string, dict: Dictionary): NavItem[] {
  return buildNavGroups(lang, dict).flatMap((g) => g.items);
}
