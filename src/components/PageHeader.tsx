export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: string }) {
  return (
    <section className="lanes bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">{eyebrow}</p>
        )}
        <h1 className="mt-1 font-display text-4xl font-extrabold uppercase md:text-5xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-white/80">{intro}</p>}
      </div>
    </section>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-sand/60 p-8 text-center text-muted">
      {children}
    </div>
  );
}
