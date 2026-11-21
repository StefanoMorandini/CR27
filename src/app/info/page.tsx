import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getFaqs, getSettings } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Info pratiche" };

// Testi provvisori: da completare con i dettagli definitivi del comitato.
const blocks = [
  {
    title: "Lo stadio",
    text: `Le gare si svolgono allo ${site.venue}. Pista, pedane, camera d'appello e punti di ristoro sono indicati sulla mappa dell'impianto (disponibile a breve).`,
  },
  {
    title: "In treno",
    text: "La stazione FFS di Bellinzona è collegata direttamente con Lugano, Locarno e il Nord delle Alpi. Indicazioni a piedi dalla stazione allo stadio in arrivo.",
  },
  {
    title: "In auto e parcheggi",
    text: "Informazioni su accessi e parcheggi per atleti, accompagnatori e pubblico saranno pubblicate qui.",
  },
  {
    title: "Atleti e società",
    text: "Iscrizioni, ritiro pettorali, camera d'appello e regolamento: tutte le informazioni tecniche saranno raccolte in questa sezione.",
  },
];

export default async function InfoPage() {
  const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
  return (
    <>
      <PageHeader eyebrow={site.venue} title="Info pratiche" intro="Come arrivare, dove parcheggiare e cosa sapere prima delle gare." />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap gap-3">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-navy px-5 py-3 font-semibold text-white hover:bg-ink"
          >
            Apri in Google Maps ↗
          </a>
          {settings.registration_url && (
            <a
              href={settings.registration_url}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Iscrizioni ↗
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {blocks.map((b) => (
            <section key={b.title} className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl font-bold uppercase">{b.title}</h2>
              <p className="mt-2 text-muted">{b.text}</p>
            </section>
          ))}
        </div>

        {faqs.length > 0 && (
          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-3xl font-bold uppercase">
              Domande frequenti
            </h2>
            <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
              {faqs.map((f) => (
                <details key={f.id} className="group p-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex justify-between gap-4">
                      {f.question}
                      <span className="text-muted transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 whitespace-pre-line text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
