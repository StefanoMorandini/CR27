import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { Skyline } from "@/components/brand/Skyline";
import { Countdown } from "@/components/home/Countdown";
import { getAnnouncements, getSponsors } from "@/lib/data";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { event } from "@/lib/event";

const d = (s: string) => ({ "--d": s }) as React.CSSProperties;

const levelStyle = {
  info: "border-l-blue",
  important: "border-l-amber-500",
  urgent: "border-l-red",
} as const;

export default async function Home() {
  const [dict, lang, announcements, sponsors] = await Promise.all([
    getDictionary(),
    getLocale(),
    getAnnouncements(),
    getSponsors(),
  ]);
  const h = dict.home;
  const lanes = (["programma", "risultati", "info", "food", "pernottamento", "sponsor"] as const).map((key) => ({
    key,
    href: `/${lang}/${key}`,
    title: dict.nav[key],
    text: h.lanes[key],
  }));

  return (
    <>
      {/* ------------------------------------------------------------ HERO */}
      <section className="relative overflow-hidden bg-white">
        <Skyline className="pointer-events-none absolute bottom-0 left-1/2 h-auto w-[200%] max-w-none -translate-x-[54%] sm:w-[150%] sm:-translate-x-1/2 lg:w-full" />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-40 pt-6 text-center sm:pb-44 sm:pt-10 lg:pb-48">
          <p className="fade-up flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-blue sm:text-xs" style={d("1.2s")}>
            <span className="h-0.5 w-6 bg-red" aria-hidden />
            {h.eyebrow}
            <span className="h-0.5 w-6 bg-red" aria-hidden />
          </p>

          <LogoMark
            animated
            runners
            id="hero"
            title={dict.meta.title}
            className="mt-4 w-[min(86vw,500px)] text-red"
          />

          <h1 className="mt-5 sm:mt-6">
            <span className="fade-up font-display block text-[clamp(1.9rem,7vw,3.9rem)] font-black uppercase leading-[0.95] text-ink" style={d("1.25s")}>
              {h.titleTop} {h.titleBottom}
            </span>
            <span className="fade-up mt-2 block text-[clamp(0.85rem,3vw,1.4rem)] font-bold uppercase tracking-[0.42em] text-ink/80" style={d("1.4s")}>
              {h.place} 2027
            </span>
          </h1>

          <p className="fade-up mt-5 max-w-md text-base text-muted sm:text-lg" style={d("1.55s")}>
            <strong className="font-semibold text-ink">{dict.common.dates}</strong> · {h.lead}
          </p>

          <div className="fade-up mt-7" style={d("1.7s")}>
            <Countdown
              startsAt={event.startsAt}
              endsAt={event.endsAt}
              units={h.countdownUnits}
              liveLabel={h.live}
              finishedLabel={h.finished}
              label={h.countdownLabel}
            />
          </div>

          <div className="fade-up mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={d("1.85s")}>
            <Link
              href={`/${lang}/programma`}
              className="rounded-full bg-red px-7 py-3.5 font-semibold text-white shadow-lg shadow-red/25 transition hover:-translate-y-0.5 hover:bg-red-dark"
            >
              {h.ctaProgram}
            </Link>
            <Link
              href={`/${lang}/info`}
              className="rounded-full border-2 border-ink/10 bg-white px-7 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:border-blue hover:text-blue"
            >
              {h.ctaInfo}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- COMUNICAZIONI */}
      {announcements.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pt-14" aria-labelledby="news">
          <h2 id="news" className="font-display text-2xl font-black uppercase">
            {h.newsTitle}
          </h2>
          <ul className="mt-5 space-y-3">
            {announcements.slice(0, 4).map((a) => (
              <li key={a.id} className={`reveal rounded-xl border border-line border-l-4 bg-white p-5 ${levelStyle[a.level]}`}>
                <p className="font-semibold">{a.title}</p>
                {a.body && <p className="mt-1 text-sm text-muted">{a.body}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------------------------------------------------- CORSIE */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:pt-24" aria-labelledby="lanes-title">
        <h2 id="lanes-title" className="reveal font-display text-3xl font-black uppercase sm:text-5xl">
          {h.lanesTitle}
        </h2>
        <ul className="reveal mt-8 overflow-hidden rounded-3xl bg-red shadow-xl shadow-red/20">
          {lanes.map((l, i) => (
            <li key={l.key} className="border-b-2 border-dashed border-white/35 last:border-0">
              <Link href={l.href} className="lane-row flex items-center gap-4 px-5 py-5 text-white sm:gap-8 sm:px-8 sm:py-6">
                <span className="font-display w-8 shrink-0 text-4xl font-black text-white/45 sm:w-12 sm:text-6xl">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-xl font-black uppercase sm:text-3xl">{l.title}</span>
                  <span className="block text-sm text-white/80 sm:text-base">{l.text}</span>
                </span>
                <span aria-hidden className="lane-arrow text-2xl sm:text-3xl">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------- DUE GIORNI */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:pt-24" aria-labelledby="days-title">
        <h2 id="days-title" className="reveal font-display text-3xl font-black uppercase sm:text-5xl">
          {h.daysTitle}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { ...h.day1, n: "19" },
            { ...h.day2, n: "20" },
          ].map((day) => (
            <Link
              key={day.n}
              href={`/${lang}/programma`}
              className="reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition hover:-translate-y-1 hover:border-red hover:shadow-xl"
            >
              <span className="font-display absolute -right-3 -top-8 text-[9rem] font-black leading-none text-red-soft transition-colors group-hover:text-red/15">
                {day.n}
              </span>
              <span className="relative block text-sm font-bold uppercase tracking-[0.25em] text-blue">{day.name}</span>
              <span className="font-display relative mt-1 block text-3xl font-black uppercase">{day.date}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------- BELLINZONA */}
      <section className="mt-16 bg-blue-soft sm:mt-24" aria-labelledby="city-title">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:py-20 md:grid-cols-2">
          <div className="reveal">
            <LogoMark className="w-full max-w-md text-red" />
            <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold uppercase tracking-wider text-blue sm:text-xs">
              {h.castles.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h2 id="city-title" className="font-display text-3xl font-black uppercase sm:text-4xl">
              {h.cityTitle}
            </h2>
            <p className="mt-4 text-lg text-ink/80">{h.cityText}</p>
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-blue underline-offset-4 hover:underline"
            >
              {dict.common.openInMaps} ↗
            </a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- SPONSOR */}
      {sponsors.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pt-16" aria-labelledby="sponsor-strip">
          <h2 id="sponsor-strip" className="text-center text-xs font-bold uppercase tracking-[0.3em] text-muted">
            {h.sponsorsTitle}
          </h2>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {sponsors.map((s) => (
              <li key={s.id} className="font-display text-xl font-bold text-ink/70">
                {s.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logo_url} alt={s.name} className="h-10 w-auto object-contain grayscale transition hover:grayscale-0" />
                ) : (
                  s.name
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
