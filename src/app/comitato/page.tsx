import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getCommittee, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Comitato d'organizzazione" };

export default async function ComitatoPage() {
  const [members, settings] = await Promise.all([getCommittee(), getSettings()]);
  return (
    <>
      <PageHeader eyebrow="Chi siamo" title="Comitato" intro="Il comitato d'organizzazione dei Campionati Regionali di Atletica 2027 a Bellinzona." />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {members.length === 0 ? (
          <EmptyState>La composizione del comitato sarà pubblicata prossimamente.</EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <li key={m.id} className="flex items-center gap-4 rounded-2xl border border-line p-5">
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo_url} alt="" className="size-16 rounded-full object-cover" />
                ) : (
                  <span className="grid size-16 shrink-0 place-items-center rounded-full bg-sand font-display text-xl font-bold text-muted">
                    {m.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                )}
                <span>
                  <span className="block font-semibold">{m.full_name}</span>
                  <span className="block text-sm text-muted">{m.role}</span>
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="text-sm text-sky underline underline-offset-4">
                      {m.email}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        <section id="contatti" className="scroll-mt-24 rounded-2xl bg-navy p-8 text-white">
          <h2 className="font-display text-3xl font-bold uppercase">Contatti</h2>
          {settings.contact_email ? (
            <p className="mt-2">
              Scrivici a{" "}
              <a href={`mailto:${settings.contact_email}`} className="font-semibold underline underline-offset-4">
                {settings.contact_email}
              </a>
            </p>
          ) : (
            <p className="mt-2 text-white/70">L&apos;indirizzo di contatto sarà pubblicato a breve.</p>
          )}
        </section>
      </div>
    </>
  );
}
