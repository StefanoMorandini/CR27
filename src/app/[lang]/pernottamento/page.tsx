import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getAccommodations } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.pernottamento.title };
}

export default async function PernottamentoPage() {
  const [dict, list] = await Promise.all([getDictionary(), getAccommodations()]);
  const t = dict.pages.pernottamento;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        {list.length === 0 ? (
          <EmptyState>{t.empty}</EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {list.map((a) => (
              <li key={a.id} className="reveal flex flex-col rounded-3xl border border-line p-7">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-black uppercase">{a.name}</h2>
                  {a.is_partner && <span className="shrink-0 rounded-full bg-red px-2.5 py-1 text-xs font-semibold text-white">{t.partner}</span>}
                </div>
                <p className="text-sm text-muted">
                  {[a.locality, a.distance_km != null && `${a.distance_km} ${t.fromStadium}`, a.price_range].filter(Boolean).join(" · ")}
                </p>
                {a.notes && <p className="mt-3">{a.notes}</p>}
                {a.booking_code && (
                  <p className="mt-3 text-sm">
                    {t.bookingCode}: <strong className="font-mono">{a.booking_code}</strong>
                  </p>
                )}
                <div className="mt-auto flex gap-4 pt-4 text-sm font-semibold">
                  {a.website_url && (
                    <a href={a.website_url} target="_blank" rel="noopener" className="text-blue underline underline-offset-4">
                      {t.book} ↗
                    </a>
                  )}
                  {a.phone && (
                    <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="text-blue underline underline-offset-4">
                      {a.phone}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
