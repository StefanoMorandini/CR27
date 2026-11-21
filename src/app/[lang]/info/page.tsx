import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { getFaqs, getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";
import { event } from "@/lib/event";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.info.title };
}

export default async function InfoPage() {
  const [dict, faqs, settings] = await Promise.all([getDictionary(), getFaqs(), getSettings()]);
  const t = dict.pages.info;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-wrap gap-3">
          <a href={event.mapsUrl} target="_blank" rel="noopener" className="rounded-full bg-blue px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5">
            {dict.common.openInMaps} ↗
          </a>
          {settings.registration_url && (
            <a href={settings.registration_url} target="_blank" rel="noopener" className="rounded-full bg-red px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-dark">
              {t.registration} ↗
            </a>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {t.blocks.map((b, i) => (
            <section key={b.title} className="reveal relative overflow-hidden rounded-3xl border border-line p-7">
              <span className="font-display absolute right-5 top-3 text-6xl font-black text-red-soft" aria-hidden>
                {i + 1}
              </span>
              <h2 className="font-display relative text-2xl font-black uppercase">{b.title}</h2>
              <p className="relative mt-2 text-muted">{b.text}</p>
            </section>
          ))}
        </div>

        {faqs.length > 0 && (
          <section className="mt-14" aria-labelledby="faq">
            <h2 id="faq" className="font-display text-3xl font-black uppercase">
              {t.faqTitle}
            </h2>
            <div className="mt-5 divide-y divide-line rounded-3xl border border-line">
              {faqs.map((f) => (
                <details key={f.id} className="group p-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex justify-between gap-4">
                      {f.question}
                      <span className="text-red transition group-open:rotate-45">+</span>
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
