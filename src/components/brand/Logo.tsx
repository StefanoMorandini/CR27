import Link from "next/link";
import { LogoMark } from "./LogoMark";

/** Marchio + scritta, per header e footer. */
export function Logo({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3" aria-label={label}>
      <LogoMark className="h-9 w-auto text-red transition-transform duration-500 group-hover:-translate-y-0.5 sm:h-10" />
      <span className="leading-none">
        <span className="font-display block text-[13px] font-black uppercase tracking-tight text-ink sm:text-[15px]">
          Campionati Regionali
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.32em] text-ink/70 sm:text-[11px]">
          Bellinzona 2027
        </span>
      </span>
    </Link>
  );
}
