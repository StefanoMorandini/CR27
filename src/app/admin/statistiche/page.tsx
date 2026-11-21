import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { cantonNames, categoryLabels, edition2025 } from "@/lib/stats2025";
import { Loading, PageTitle, Panel } from "../ui";

export const metadata = { title: "Statistiche 2025" };

const cats = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];
const nf = new Intl.NumberFormat("de-CH");

/** Requisiti per il sito dalla convenzione Swiss Athletics 2025 (art. 11 e 13). */
const requirements = [
  { done: false, text: "Logo Swiss Athletics in home page, con link" },
  { done: false, text: "Logo delle società della lotteria (Swisslos), con link" },
  { done: true, text: "Elenco del comitato d'organizzazione" },
  { done: false, text: "Elenco dei funzionari ufficiali (giudici-arbitri, starter, NTO)" },
  { done: false, text: "Pubblicazione e orario provvisorio, al più tardi 2 mesi prima" },
  { done: false, text: "Orario definitivo e direttive dopo il termine d'iscrizione" },
  { done: false, text: "Liste di partenza aggiornate" },
  { done: true, text: "Risultati live nei giorni di gara (link TAF3 configurabile)" },
  { done: false, text: "PDF completo dei risultati subito dopo le gare" },
  { done: false, text: "Contenuti principali bilingui italiano / tedesco" },
];

async function Stats() {
  await requireAdmin();
  const d = edition2025;
  const days = d.registrationsByDay;
  const maxDay = Math.max(...days.map(([, n]) => n));
  const last4 = days.slice(-4).reduce((a, [, n]) => a + n, 0);
  const byCat = d.byCategory;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { v: nf.format(d.entries), l: "iscrizioni gara" },
          { v: String(d.clubs), l: "società" },
          { v: `CHF ${nf.format(d.entries * d.fee)}`, l: `tasse d'iscrizione lorde (CHF ${d.fee} per gara)` },
          { v: `${Math.round((100 * last4) / d.entries)}%`, l: "iscrizioni negli ultimi 4 giorni prima del termine" },
        ].map((k) => (
          <div key={k.l} className="rounded-3xl border border-line bg-white p-5">
            <span className="font-display block text-3xl font-black text-red">{k.v}</span>
            <span className="text-sm text-muted">{k.l}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Iscrizioni per categoria">
          <ul className="space-y-2 text-sm">
            {cats.map((c) => (
              <li key={c} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3">
                <span>{categoryLabels[c]}</span>
                <span className="h-3 overflow-hidden rounded-full bg-stone">
                  <span className={`block h-full ${c.endsWith("F") ? "bg-red" : "bg-blue"}`} style={{ width: `${(100 * byCat[c]) / 240}%` }} />
                </span>
                <span className="text-right tabular-nums">{byCat[c]}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Iscrizioni per cantone">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="py-1 text-left">Cantone</th>
                <th className="py-1 text-right">Iscrizioni</th>
                <th className="py-1 text-right">Società</th>
                <th className="py-1 text-right">Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {d.byCanton.map((c) => (
                <tr key={c.canton}>
                  <td className="py-1.5">{cantonNames[c.canton]}</td>
                  <td className="py-1.5 text-right tabular-nums">{c.entries}</td>
                  <td className="py-1.5 text-right tabular-nums">{c.clubs}</td>
                  <td className="py-1.5 text-right tabular-nums text-muted">{Math.round((100 * c.entries) / d.entries)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Andamento delle iscrizioni">
        <p className="-mt-2 mb-4 text-sm text-muted">
          Il {Math.round((100 * last4) / d.entries)}% delle iscrizioni arriva negli ultimi 4 giorni: orario definitivo, serie e pettorali vanno preparati in
          tempi stretti dopo la chiusura.
        </p>
        <div className="flex h-40 items-end gap-1">
          {days.map(([day, n]) => (
            <div key={day} className="group relative flex-1" title={`${day}: ${n}`}>
              <div className="rounded-t bg-blue/80 group-hover:bg-red" style={{ height: `${(140 * n) / maxDay}px` }} />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>{days[0][0]}</span>
          <span>{days.at(-1)![0]}</span>
        </div>
      </Panel>

      <Panel title="Iscrizioni per disciplina e categoria">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-stone/60 text-[11px] uppercase tracking-wider text-muted">
              <tr>
                <th className="px-3 py-2 text-left">Disciplina</th>
                {cats.map((c) => (
                  <th key={c} className="px-2 py-2 text-right">
                    {c}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Totale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {d.byDiscipline.map((r) => (
                <tr key={r.discipline}>
                  <td className="px-3 py-1.5 font-medium">{r.discipline}</td>
                  {cats.map((c) => (
                    <td key={c} className={`px-2 py-1.5 text-right tabular-nums ${r[c] === 0 ? "text-line" : ""}`}>
                      {r[c] || "·"}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-right font-bold tabular-nums">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">
          Nel 2025 alcune gare sono state annullate per poche iscrizioni (es. triplo U14/U16/U18 uomini, disco e asta U14 uomini, peso U16 uomini,
          3000 m e 400 m ostacoli U18) o accorpate tra categorie (disco, triplo, giavellotto 400 g, asta).
        </p>
      </Panel>

      <Panel title="Requisiti Swiss Athletics per il sito (convenzione 2025)">
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {requirements.map((r) => (
            <li key={r.text} className="flex gap-2">
              <span className={r.done ? "text-blue" : "text-muted"}>{r.done ? "✓" : "○"}</span>
              <span className={r.done ? "" : "text-ink/80"}>{r.text}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="text-xs text-muted">Fonte: iscrizioni Swiss Athletics al 5.6.2025 (dati anonimi aggregati), statistica iscrizioni e convenzione 2025.</p>
    </div>
  );
}

export default function StatsPage() {
  return (
    <>
      <PageTitle title="Edizione 2025: dati e promemoria" back={{ href: "/admin", label: "Dashboard" }} />
      <Suspense fallback={<Loading />}>
        <Stats />
      </Suspense>
    </>
  );
}
