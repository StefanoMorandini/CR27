import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo inverted />
          <p className="text-sm text-white/70">
            19–20 giugno 2027
            <br />
            {site.venue}
          </p>
        </div>
        <nav aria-label="Navigazione nel footer">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm text-white/70">
          <p>Organizzato dal Comitato d&apos;organizzazione Regionali 2027 Bellinzona.</p>
          <p className="mt-2">
            <Link href="/comitato#contatti" className="underline underline-offset-4 hover:text-white">
              Contatti
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
