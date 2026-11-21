import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import type { Dictionary } from "@/i18n/dictionaries/it";
import { buildNavGroups } from "@/lib/nav";

export function Footer({ lang, dict }: { lang: string; dict: Dictionary }) {
  const groups = buildNavGroups(lang, dict);
  return (
    <footer className="mt-20 bg-stone">
      <div className="ticino-stripe h-1" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_2fr_1fr]">
        <div>
          <LogoMark className="h-16 w-auto text-red" />
          <p className="font-display mt-4 text-lg font-black uppercase leading-tight">
            Campionati Regionali
            <span className="block text-sm font-semibold tracking-[0.3em] text-ink/70">Bellinzona 2027</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            {dict.common.dates}
            <br />
            {dict.common.venue}
          </p>
        </div>
        <nav aria-label="Navigazione nel footer" className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {groups.map((g) => (
            <div key={g.key}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">{g.label}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {g.items.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className="link-underline text-ink/80 hover:text-ink">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="text-sm text-muted">
          <p>{dict.footer.organizer}</p>
          <p className="mt-3">
            <Link href={`/${lang}/comitato#contatti`} className="font-semibold text-blue underline-offset-4 hover:underline">
              {dict.nav.contatti} →
            </Link>
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted">
          <p>© 2027 {dict.footer.rights}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {(
              [
                ["privacy", dict.footer.legal.privacy],
                ["cookie", dict.footer.legal.cookie],
                ["note-legali", dict.footer.legal.notes],
              ] as const
            ).map(([path, label]) => (
              <li key={path}>
                <Link href={`/${lang}/${path}`} className="hover:text-ink hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
