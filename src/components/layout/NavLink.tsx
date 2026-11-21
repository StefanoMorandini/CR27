"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Link che si marca come attivo (aria-current) quando il percorso corrisponde. */
export function NavLink({
  href,
  exact = false,
  className,
  children,
  onClick,
}: {
  href: string;
  exact?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
