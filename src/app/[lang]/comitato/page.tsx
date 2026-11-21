import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";
import { getCommittee, getSettings } from "@/lib/data";
import { getDictionary } from "@/i18n/dictionaries";
import type { CommitteeMember } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDictionary()).pages.comitato.title };
}

function Avatar({ m, size }: { m: CommitteeMember; size: string }) {
  return m.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.photo_url} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <span className={`font-display grid ${size} shrink-0 place-items-center rounded-full bg-red-soft font-black text-red`}>
      {m.full_name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export default async function ComitatoPage() {
  const [dict, members, settings] = await Promise.all([getDictionary(), getCommittee(), getSettings()]);
  const t = dict.pages.comitato;
  const committee = members.filter((m) => m.is_committee);
  const team = members.filter((m) => !m.is_committee);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <div className="mx-auto max-w-5xl space-y-14 px-4 py-10">
        {members.length === 0 && <EmptyState>{t.empty}</EmptyState>}

        {committee.length > 0 && (
          <section aria-labelledby="co">
            <h2 id="co" className="reveal font-display text-xl font-black uppercase leading-tight sm:text-3xl">
              {t.committeeTitle}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {committee.map((m) => (
                <li key={m.id} className="reveal flex gap-3 rounded-2xl border border-line bg-white p-4 sm:gap-4 sm:rounded-3xl sm:p-5">
                  <Avatar m={m} size="size-12 text-base sm:size-16 sm:text-xl" />
                  <span className="min-w-0">
                    <span className="block break-words font-display text-base font-black uppercase leading-tight sm:text-lg">{m.full_name}</span>
                    <span className="block text-sm font-semibold text-red">{m.role}</span>
                    {m.responsibilities.length > 0 && (
                      <span className="mt-1.5 block text-[13px] leading-snug text-muted sm:mt-2 sm:text-sm">{m.responsibilities.join(" · ")}</span>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="mt-1 block text-sm text-blue underline underline-offset-4">
                        {m.email}
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {team.length > 0 && (
          <section aria-labelledby="team">
            <h2 id="team" className="reveal font-display text-3xl font-black uppercase">
              {t.teamTitle}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <li key={m.id} className="reveal flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
                  <Avatar m={m} size="size-11 text-sm" />
                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight">{m.full_name}</span>
                    <span className="block text-sm text-muted">{(m.responsibilities.length ? m.responsibilities : [m.role]).join(" · ")}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="contatti" className="reveal scroll-mt-28 rounded-3xl bg-blue p-6 text-white sm:p-10">
          <h2 className="font-display text-2xl font-black uppercase sm:text-3xl">{t.contactTitle}</h2>
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
