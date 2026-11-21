import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { getAnnouncements, getSponsors } from "@/lib/data";
import { site } from "@/lib/site";

const quick = [
  { href: "/programma", title: "Programma", text: "Orari di tutte le gare, giorno per giorno." },
  { href: "/risultati", title: "Risultati", text: "Risultati live, liste di partenza e classifiche." },
  { href: "/info", title: "Come arrivare", text: "Stadio, trasporti, parcheggi e FAQ." },
  { href: "/food", title: "Food & Drink", text: "Punti di ristoro, menu e prezzi." },
  { href: "/pernottamento", title: "Pernottamento", text: "Hotel e alloggi convenzionati." },
  { href: "/sponsor", title: "Sponsor", text: "Chi rende possibile l'evento." },
];

const levelStyle = {
  info: "border-sky/30 bg-sky/5",
  important: "border-warn/40 bg-warn/5",
  urgent: "border-brand/50 bg-brand/5",
} as const;

export default async function Home() {
  const [announcements, sponsors] = await Promise.all([getAnnouncements(), getSponsors()]);

  return (
    <>
      <section className="lanes relative overflow-hidden bg-navy text-white">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/30 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-24">
          <p className="font-semibold uppercase tracking-widest text-white/70">
            19–20 giugno 2027 · {site.city}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl font-extrabold uppercase leading-[0.95] md:text-7xl">
            Campionati Regionali <span className="text-brand">di Atletica</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Due giorni di gare allo {site.venue}, ai piedi dei castelli.
          </p>
          <div className="mt-8">
            <Countdown startsAt={site.startsAt} endsAt={site.endsAt} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/programma"
              className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              Vedi il programma
            </Link>
            <Link
              href="/info"
              className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/30 hover:bg-white/20"
            >
              Info pratiche
            </Link>
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10" aria-labelledby="news">
          <h2 id="news" className="font-display text-2xl font-bold uppercase">
            Comunicazioni
          </h2>
          <ul className="mt-4 space-y-3">
            {announcements.slice(0, 4).map((a) => (
              <li key={a.id} className={`rounded-xl border p-4 ${levelStyle[a.level]}`}>
                <p className="font-semibold">{a.title}</p>
                {a.body && <p className="mt-1 text-sm text-muted">{a.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="quick">
        <h2 id="quick" className="sr-only">
          Accesso rapido
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quick.map((q) => (
            <li key={q.href}>
              <Link
                href={q.href}
                className="group flex h-full flex-col rounded-2xl border border-line p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
              >
                <span className="font-display text-2xl font-bold uppercase group-hover:text-brand">
                  {q.title} <span aria-hidden>→</span>
                </span>
                <span className="mt-2 text-muted">{q.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {sponsors.length > 0 && (
        <section className="border-t border-line bg-sand/50" aria-labelledby="sponsor-strip">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 id="sponsor-strip" className="text-center text-sm font-semibold uppercase tracking-widest text-muted">
              Con il sostegno di
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {sponsors.map((s) => (
                <li key={s.id} className="font-display text-xl font-bold text-ink/70">
                  {s.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.logo_url} alt={s.name} className="h-10 w-auto object-contain" />
                  ) : (
                    s.name
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
