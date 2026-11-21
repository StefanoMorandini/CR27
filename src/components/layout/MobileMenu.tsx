"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import type { NavGroup } from "@/lib/nav";
import { NavLink } from "./NavLink";

type Labels = { menu: string; close: string; dates: string; venue: string };

/** Menu a schermo intero per mobile: ogni voce è una "corsia" numerata. */
export function MobileMenu({ groups, home, labels }: { groups: NavGroup[]; home: { href: string; label: string }; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Chiude il menu quando cambia pagina
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);


  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="relative z-50 grid size-11 place-items-center rounded-full text-ink hover:bg-stone"
      >
        <span className="sr-only">{open ? labels.close : labels.menu}</span>
        <span aria-hidden className="relative block h-3.5 w-5">
          <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      {open &&
        createPortal(
        <div id="mobile-menu" className="menu-panel fixed inset-x-0 bottom-0 top-[68px] z-30 overflow-y-auto bg-white pb-24">
          <nav aria-label={labels.menu} className="px-4 py-4">
            <NavLink
              href={home.href}
              exact
              onClick={() => setOpen(false)}
              className="mb-4 flex items-center justify-between rounded-2xl bg-stone px-5 py-3 font-display text-lg font-extrabold uppercase aria-[current=page]:text-red"
            >
              {home.label} <span aria-hidden>→</span>
            </NavLink>
            <div className="space-y-5">
              {groups.map((g) => (
                <section key={g.key}>
                  {g.items.length > 1 && <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.25em] text-muted">{g.label}</h2>}
                  <ul className="track overflow-hidden rounded-2xl bg-red py-1.5">
                    {g.items.map((item, i) => (
                      <li key={item.key} className="border-t-[3px] border-white last:border-b-[3px]">
                        <NavLink
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="lane-row flex items-center gap-4 px-5 py-3.5 text-white aria-[current=page]:bg-red-dark"
                        >
                          {g.items.length > 1 && <span className="font-display w-6 text-xl font-black text-white">{i + 1}</span>}
                          <span className="font-display flex-1 text-lg font-extrabold uppercase">{item.label}</span>
                          <span aria-hidden className="lane-arrow text-xl">→</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted">
              {labels.dates} · {labels.venue}
            </p>
          </nav>
        </div>,
          document.body,
        )}
    </div>
  );
}
