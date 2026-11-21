"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./actions";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/sponsor", label: "Sponsor" },
  { href: "/admin/tier", label: "Tier" },
  { href: "/admin/link", label: "Link e risultati" },
];

export function AdminNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/password")) return null;
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      {items.map((i) => {
        const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`rounded-full px-3 py-1.5 font-medium ${active ? "bg-red text-white" : "text-ink/75 hover:bg-stone"}`}
          >
            {i.label}
          </Link>
        );
      })}
      <Link href="/admin/password" className="rounded-full px-3 py-1.5 font-medium text-ink/75 hover:bg-stone">
        Password
      </Link>
      <form action={logout}>
        <button className="rounded-full px-3 py-1.5 font-medium text-muted hover:text-red">Esci</button>
      </form>
    </nav>
  );
}
