import type { Metadata } from "next";
import Link from "next/link";
import { nav } from "@/lib/site";

export const metadata: Metadata = { title: "Menu" };

/** Menu completo per mobile (raggiungibile dal pulsante "Menu" nell'header). */
export default function MenuPage() {
  return (
    <nav aria-label="Tutte le sezioni" className="mx-auto max-w-md px-4 py-8">
      <ul className="divide-y divide-line rounded-2xl border border-line">
        <li>
          <Link href="/" className="flex justify-between p-5 font-display text-2xl font-bold uppercase">
            Home <span aria-hidden>→</span>
          </Link>
        </li>
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="flex justify-between p-5 font-display text-2xl font-bold uppercase">
              {item.label} <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
