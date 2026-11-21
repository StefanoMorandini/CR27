"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/lib/nav";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

/** Voce del menu desktop: link diretto o tendina con le pagine del gruppo. */
export function NavDropdown({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointer = useRef<string>("");
  const active = group.items.some((i) => isActive(pathname, i.href));
  const linkCls =
    "link-underline inline-flex items-center gap-1 whitespace-nowrap py-1 text-[15px] font-medium text-ink/80 hover:text-ink aria-[current=page]:text-red";

  // chiude al cambio pagina
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (group.items.length === 1) {
    const item = group.items[0];
    return (
      <li>
        <Link href={item.href} aria-current={active ? "page" : undefined} className={linkCls}>
          {group.label}
        </Link>
      </li>
    );
  }

  // con il mouse la tendina si apre al passaggio; tocco e tastiera la aprono/chiudono al clic
  const enter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const leave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <li ref={ref} className="relative" onPointerEnter={enter} onPointerLeave={leave}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        onPointerDown={(e) => (pointer.current = e.pointerType)}
        onClick={() => setOpen((o) => (pointer.current === "mouse" ? true : !o))}
        className={linkCls}
      >
        {group.label}
        <svg viewBox="0 0 12 12" className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="menu-panel absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3">
          <ul className="min-w-56 overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-xl">
            {group.items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex items-center justify-between gap-6 rounded-xl px-4 py-2.5 text-[15px] font-medium text-ink/80 hover:bg-stone hover:text-ink aria-[current=page]:bg-red-soft aria-[current=page]:text-red"
                >
                  {item.label}
                  <span aria-hidden className="text-muted">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
