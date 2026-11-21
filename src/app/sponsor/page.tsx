import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getSponsors } from "@/lib/data";
import type { SponsorTier } from "@/lib/types";

export const metadata: Metadata = { title: "Sponsor e partner" };

const tiers: { tier: SponsorTier; label: string; size: string }[] = [
  { tier: "main", label: "Main sponsor", size: "md:col-span-2 h-40" },
  { tier: "gold", label: "Gold", size: "h-32" },
  { tier: "silver", label: "Silver", size: "h-28" },
  { tier: "supporter", label: "Sostenitori", size: "h-24" },
  { tier: "institutional", label: "Partner istituzionali", size: "h-24" },
  { tier: "media", label: "Media partner", size: "h-24" },
];

export default async function SponsorPage() {
  const sponsors = await getSponsors();
  return (
    <>
      <PageHeader eyebrow="Grazie" title="Sponsor e partner" intro="Le aziende e le istituzioni che sostengono i Campionati Regionali 2027." />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {tiers.map(({ tier, label, size }) => {
          const list = sponsors.filter((s) => s.tier === tier);
          if (list.length === 0) return null;
          return (
            <section key={tier} aria-labelledby={`t-${tier}`}>
              <h2 id={`t-${tier}`} className="text-sm font-semibold uppercase tracking-widest text-muted">{label}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {list.map((s) => {
                  const inner = s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="font-display text-xl font-bold">{s.name}</span>
                  );
                  return (
                    <li key={s.id} className={size}>
                      {s.website_url ? (
                        <a href={s.website_url} target="_blank" rel="noopener sponsored" className="grid h-full place-items-center rounded-2xl border border-line p-4 hover:border-brand">
                          {inner}
                        </a>
                      ) : (
                        <div className="grid h-full place-items-center rounded-2xl border border-line p-4">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {sponsors.length === 0 && <EmptyState>Gli sponsor saranno presentati prossimamente.</EmptyState>}

        <section className="rounded-2xl bg-sand p-8">
          <h2 className="font-display text-3xl font-bold uppercase">Diventa sponsor</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Vuoi associare il tuo marchio a due giorni di atletica a Bellinzona? Contatta il comitato per ricevere il dossier sponsor.
          </p>
          <a href="/comitato#contatti" className="mt-4 inline-block rounded-full bg-navy px-5 py-3 font-semibold text-white hover:bg-ink">
            Contattaci
          </a>
        </section>
      </div>
    </>
  );
}
