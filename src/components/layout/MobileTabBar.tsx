"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icons = {
  home: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  food: "M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2 0-3.5 2.5-3.5 6S15 13 17 13",
} as const;

export type TabItem = { href: string; label: string; icon: keyof typeof icons };

/** Barra fissa in basso, solo su mobile: accesso rapido nei giorni di gara. */
export function MobileTabBar({ items }: { items: TabItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigazione rapida"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map((t, i) => {
          const active = i === 0 ? pathname === t.href : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                  active ? "text-red" : "text-muted"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute top-0 h-[3px] w-8 rounded-b-full bg-red transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`}
                />
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={active ? 2.2 : 1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={icons[t.icon]} />
                </svg>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
