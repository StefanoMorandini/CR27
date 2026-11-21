import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getCommittee, getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.comitato.title };
}

export default async function ComitatoPage() {
  const [dict, members, settings] = await Promise.all([getDictionary(), getCommittee(), getSettings()]);
  const t = dict.pages.comitato;
  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        {members.length === 0 ? (
          <EmptyState>{t.empty}</EmptyState>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m) => (
              <li key={m.id} className="reveal flex items-center gap-4 rounded-3xl border border-line p-5">
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo_url} alt="" className="size-16 rounded-full object-cover" />
                ) : (
                  <span className="font-display grid size-16 shrink-0 place-items-center rounded-full bg-red-soft text-xl font-black text-red">
                    {m.full_name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                )}
                <span>
                  <span className="block font-semibold">{m.full_name}</span>
                  <span className="block text-sm text-muted">{m.role}</span>
                  {m.email && (
                    <a href={`mailto:${m.email}`} className="text-sm text-blue underline underline-offset-4">
                      {m.email}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}

        <section id="contatti" className="reveal scroll-mt-28 rounded-3xl bg-blue p-8 text-white sm:p-10">
          <h2 className="font-display text-3xl font-black uppercase">{t.contactTitle}</h2>
          {settings.contact_email ? (
            <p className="mt-2 text-lg">
              {t.contactText}{" "}
              <a href={`mailto:${settings.contact_email}`} className="font-semibold underline underline-offset-4">
                {settings.contact_email}
              </a>
            </p>
          ) : (
            <p className="mt-2 text-white/80">{t.contactEmpty}</p>
          )}
        </section>
      </div>
    </>
  );
}
