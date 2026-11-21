import type { Sponsor, SponsorTier, TierDisplay } from "@/lib/types";

type Size = "xl" | "lg" | "md" | "sm";
const sizeOf: Record<TierDisplay, Size> = { featured: "xl", large: "lg", medium: "md", small: "sm" };

/** Contenuto della card: logo se presente, altrimenti il nome come scritta. */
function Mark({ s, size }: { s: Sponsor; size: Size }) {
  if (s.logo_url) {
    const h = { xl: "max-h-24 sm:max-h-28", lg: "max-h-16", md: "max-h-12", sm: "max-h-10" }[size];
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={s.logo_url} alt={s.name} className={`${h} w-auto max-w-[80%] object-contain`} />;
  }
  const t = { xl: "text-4xl sm:text-6xl", lg: "text-2xl sm:text-3xl", md: "text-xl sm:text-2xl", sm: "text-base sm:text-lg" }[size];
  return <span className={`font-display font-black uppercase leading-none text-ink ${t}`}>{s.name}</span>;
}

function Card({ s, size, label, className = "" }: { s: Sponsor; size: Size; label?: string; className?: string }) {
  const inner = (
    <>
      {label && (
        <span className="absolute left-5 top-4 text-[10px] font-bold uppercase tracking-[0.25em] text-red sm:text-xs">{label}</span>
      )}
      <Mark s={s} size={size} />
      {s.website_url && (
        <span aria-hidden className="absolute bottom-3 right-4 text-sm text-muted opacity-0 transition group-hover:opacity-100">
          ↗
        </span>
      )}
    </>
  );
  const cls = `group relative grid place-items-center rounded-3xl border border-line bg-white p-6 text-center transition ${className}`;
  return s.website_url ? (
    <a
      href={s.website_url}
      target="_blank"
      rel="noopener sponsored"
      aria-label={s.name}
      className={`${cls} hover:-translate-y-1 hover:border-red hover:shadow-xl`}
    >
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

const grid: Record<Size, string> = {
  xl: "grid gap-4",
  lg: "grid gap-4 sm:grid-cols-2",
  md: "grid grid-cols-2 gap-4 md:grid-cols-3",
  sm: "grid grid-cols-2 gap-3 md:grid-cols-4",
};
const minH: Record<Size, string> = { xl: "", lg: "min-h-36", md: "min-h-28", sm: "min-h-20 p-4" };

/**
 * Sponsor raggruppati per livello (i livelli e la loro resa grafica si
 * gestiscono dall'area admin): "featured" = card grande in evidenza.
 */
export function SponsorWall({ sponsors, tiers }: { sponsors: Sponsor[]; tiers: SponsorTier[] }) {
  return (
    <div className="space-y-4">
      {tiers.map((tier) => {
        const list = sponsors.filter((s) => s.tier_id === tier.id);
        if (list.length === 0) return null;
        const size = sizeOf[tier.display];
        if (size === "xl") {
          return (
            <div key={tier.id} className={grid.xl}>
              {list.map((s) => (
                <Card
                  key={s.id}
                  s={s}
                  size="xl"
                  label={tier.name}
                  className="reveal min-h-52 overflow-hidden border-t-[6px] border-t-red bg-gradient-to-b from-red-soft/60 to-white sm:min-h-64"
                />
              ))}
            </div>
          );
        }
        return (
          <div key={tier.id} className="reveal pt-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">{tier.name}</h3>
            <div className={grid[size]}>
              {list.map((s) => (
                <Card key={s.id} s={s} size={size} className={minH[size]} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
