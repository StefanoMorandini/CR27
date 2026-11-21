import type { Sponsor, SponsorTier } from "@/lib/types";

type TierLabels = Record<SponsorTier, string>;

const order: SponsorTier[] = ["main", "gold", "silver", "supporter", "institutional", "media"];

/** Contenuto della card: logo se presente, altrimenti il nome come scritta. */
function Mark({ s, size }: { s: Sponsor; size: "xl" | "lg" | "md" }) {
  if (s.logo_url) {
    const h = { xl: "max-h-24", lg: "max-h-14", md: "max-h-10" }[size];
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={s.logo_url} alt={s.name} className={`${h} w-auto max-w-[80%] object-contain`} />;
  }
  const t = { xl: "text-4xl sm:text-6xl", lg: "text-2xl sm:text-3xl", md: "text-lg sm:text-xl" }[size];
  return <span className={`font-display font-black uppercase leading-none text-ink ${t}`}>{s.name}</span>;
}

function Card({ s, size, label, className = "" }: { s: Sponsor; size: "xl" | "lg" | "md"; label?: string; className?: string }) {
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

/**
 * Sponsor raggruppati per livello: main sponsor in evidenza (fascia rossa),
 * gold su due colonne, gli altri livelli in griglie più compatte.
 */
export function SponsorWall({ sponsors, labels }: { sponsors: Sponsor[]; labels: TierLabels }) {
  const byTier = (t: SponsorTier) => sponsors.filter((s) => s.tier === t);
  return (
    <div className="space-y-4">
      {order.map((tier) => {
        const list = byTier(tier);
        if (list.length === 0) return null;
        if (tier === "main") {
          return (
            <div key={tier} className="grid gap-4">
              {list.map((s) => (
                <Card
                  key={s.id}
                  s={s}
                  size="xl"
                  label={labels.main}
                  className="reveal min-h-52 overflow-hidden border-t-[6px] border-t-red bg-gradient-to-b from-red-soft/60 to-white sm:min-h-64"
                />
              ))}
            </div>
          );
        }
        const big = tier === "gold";
        return (
          <div key={tier} className="reveal pt-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-muted">{labels[tier]}</h3>
            <div className={`grid gap-4 ${big ? "sm:grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
              {list.map((s) => (
                <Card key={s.id} s={s} size={big ? "lg" : "md"} className={big ? "min-h-36" : "min-h-24"} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
