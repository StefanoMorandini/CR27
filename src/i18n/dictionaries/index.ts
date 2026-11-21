import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "../config";
import type { Dictionary } from "./it";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("./it").then((m) => m.default),
};

/** Lingua corrente (dal segmento /[lang]) — solo lato server. */
export async function getLocale(): Promise<Locale> {
  const l = await lang();
  if (!l || !hasLocale(l)) notFound();
  return l;
}

/** Dizionario della lingua corrente — solo lato server. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}

export type { Dictionary };
