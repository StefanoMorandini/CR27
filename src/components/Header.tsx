import Link from "next/link";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
        <Logo />
        <nav aria-label="Navigazione principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-ink/80 hover:bg-sand hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/risultati"
          className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark sm:inline-flex lg:hidden xl:inline-flex"
        >
          Risultati live
        </Link>
        <Link href="/menu" className="rounded-md px-3 py-2 text-sm font-medium lg:hidden">
          Menu
        </Link>
      </div>
    </header>
  );
}
