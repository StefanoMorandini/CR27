import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import type { Dictionary } from "@/i18n/dictionaries/it";
import { buildNavGroups } from "@/lib/nav";
import { NavDropdown } from "./NavDropdown";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ lang, dict }: { lang: string; dict: Dictionary }) {
  const groups = buildNavGroups(lang, dict);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md">
      <div className="ticino-stripe h-1" />
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px]">
          <Logo href={`/${lang}`} label={`${dict.nav.home} — ${dict.meta.shortTitle}`} />
          <nav aria-label="Navigazione principale" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {groups.map((g) => (
                <NavDropdown key={g.key} group={g} />
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher current={lang} label={dict.common.language} />
            <Link
              href={`/${lang}/risultati`}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-dark sm:inline-flex"
            >
              <span className="size-2 rounded-full bg-white" aria-hidden />
              {dict.common.resultsLive}
            </Link>
            <MobileMenu
              groups={groups}
              home={{ href: `/${lang}`, label: dict.nav.home }}
              labels={{ menu: dict.common.menu, close: dict.common.close, dates: dict.common.dates, venue: dict.common.venue }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
