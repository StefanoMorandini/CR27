import Link from "next/link";
import { localeNames, locales } from "@/i18n/config";

/** Selettore lingua: compare automaticamente quando è attiva più di una lingua. */
export function LanguageSwitcher({ current, label }: { current: string; label: string }) {
  if (locales.length < 2) return null;
  return (
    <nav aria-label={label} className="flex items-center gap-1 text-xs font-semibold uppercase">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}`}
          hrefLang={l}
          lang={l}
          title={localeNames[l]}
          aria-current={l === current ? "true" : undefined}
          className="rounded px-1.5 py-1 text-muted hover:text-ink aria-[current=true]:text-red"
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}
