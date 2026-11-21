import { LogoMark } from "@/components/brand/LogoMark";

/** Intestazione delle pagine interne: titolo grande + marchio animato sullo sfondo. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-stone">
      <LogoMark
        animated
        id="ph"
        className="pointer-events-none absolute -bottom-4 -right-20 h-32 w-auto text-red/10 sm:h-56 sm:text-red/15 md:-right-8 md:h-72"
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 md:pb-16 md:pt-16">
        {eyebrow && (
          <p className="fade-up flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-red sm:text-sm">
            <span className="h-0.5 w-8 bg-blue" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h1
          className="fade-up font-display mt-3 text-4xl font-black uppercase leading-[0.95] text-ink sm:text-6xl md:text-7xl"
          style={{ "--d": "0.08s" } as React.CSSProperties}
        >
          {title}
        </h1>
        {intro && (
          <p className="fade-up mt-4 max-w-2xl text-base text-muted sm:text-lg" style={{ "--d": "0.16s" } as React.CSSProperties}>
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-stone/60 p-10 text-center text-muted">
      <LogoMark className="h-10 w-auto text-red/30" />
      <p className="max-w-md">{children}</p>
    </div>
  );
}
