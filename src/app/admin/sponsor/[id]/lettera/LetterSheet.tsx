import type { Sponsor, SponsorContact, SponsorTier } from "@/lib/types";

const chf = (n: number) =>
  new Intl.NumberFormat("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n).replace(/’/g, "'");
const longDate = (d: Date) => new Intl.DateTimeFormat("it-CH", { day: "numeric", month: "long", year: "numeric" }).format(d);

/** Conferma di sponsorizzazione su foglio A4 (stampabile). */
export function LetterSheet({
  sponsor: s,
  contact: c,
  tier,
  set,
  amount,
  date,
}: {
  sponsor: Sponsor;
  contact: SponsorContact | null;
  tier: SponsorTier | null;
  set: Record<string, string>;
  amount: number | null;
  date: Date;
}) {
  const company = c?.legal_name || s.name;
  const greeting =
    c?.salutation === "Spettabili" || !c?.contact_name ? "Spettabili signore e signori," : `${c.salutation ?? "Gentile Signora"} ${c.contact_name},`;
  return (
      <article className="letter mx-auto w-full max-w-[210mm] bg-white px-[18mm] py-[16mm] text-[10.5pt] leading-[1.45] text-ink shadow-xl print:max-w-none print:p-0 print:shadow-none">
        <header className="flex items-start justify-between gap-6">
          <div className="whitespace-pre-line text-[9.5pt]">
            <strong className="block">{set.sender_name}</strong>
            {set.sender_address}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-cr27.jpg" alt="Campionati Regionali Bellinzona 2027" className="h-[26mm] w-auto" />
        </header>

        <div className="mt-[14mm] ml-auto w-[80mm] whitespace-pre-line">
          {"Spettabile\n"}
          <strong>{company}</strong>
          {c?.contact_name ? `\na.c.a. ${c.contact_name}` : ""}
          {c?.street ? `\n${c.street}` : ""}
          {c?.postal_code || c?.city ? `\n${[c?.postal_code, c?.city].filter(Boolean).join(" ")}` : ""}
          {c?.country && c.country !== "Svizzera" ? `\n${c.country}` : ""}
          {c?.email ? (
            <>
              {"\n"}
              <strong>Via e-mail:</strong>
              {`\n${c.email}`}
            </>
          ) : null}
        </div>

        <p className="mt-[10mm] ml-auto w-[80mm]">
          {set.letter_place || "Bellinzona"}, {longDate(date)}
        </p>

        <h2 className="mt-[10mm] font-bold">Conferma di sponsorizzazione – Campionati Regionali di atletica leggera 2027</h2>

        <div className="mt-5 space-y-3">
          <p>{greeting}</p>
          <p>
            Con la presente abbiamo il piacere di confermare la sponsorizzazione di <strong>{company}</strong> per i Campionati Regionali di atletica leggera
            che si svolgeranno il 19 e 20 giugno 2027 allo Stadio Comunale di Bellinzona.
          </p>
          <p>
            Pacchetto concordato: <strong>{tier?.name ?? "—"}</strong>
            {amount != null && (
              <>
                , per un importo di <strong>CHF {chf(amount)}</strong>
              </>
            )}
            .
          </p>
          {(tier?.benefits.length ?? 0) > 0 && (
            <div>
              <p>Il pacchetto comprende:</p>
              <ul className="mt-1 list-disc pl-6">
                {tier!.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          )}
          {c?.notes && <p className="whitespace-pre-line">{c.notes}</p>}
          <p>
            Per la realizzazione dei materiali vi preghiamo di inviarci il vostro logo in alta risoluzione, preferibilmente in formato vettoriale
            {set.contact_email ? ` (${set.contact_email})` : ""}.
          </p>
          {amount != null &&
            (set.iban ? (
              <p>
                Vi preghiamo di versare l&apos;importo entro {set.payment_days || 30} giorni sul conto <strong>{set.iban}</strong>, intestato a{" "}
                {(set.account_holder || set.sender_name).replace(/\n/g, ", ")}, indicando come riferimento «Sponsoring CR 2027 – {s.name}».
              </p>
            ) : (
              <p>Le coordinate per il versamento seguiranno con la fattura.</p>
            ))}
          {set.contact_name && (
            <p>
              In caso di domande {set.contact_name} è volentieri a vostra disposizione
              {[set.contact_email, set.contact_phone].filter(Boolean).length > 0 && ` (${[set.contact_email, set.contact_phone].filter(Boolean).join(" / ")})`}.
            </p>
          )}
          <p>Ringraziandovi per il vostro prezioso sostegno, porgiamo sportivi saluti.</p>
        </div>

        <div className="mt-[12mm] grid grid-cols-2 gap-[10mm] break-inside-avoid">
          <div>
            <p className="font-semibold">Per l&apos;accettazione – {company}</p>
            <p className="mt-[14mm] border-t border-ink/60 pt-1 text-[9pt] text-muted">Luogo, data e firma</p>
          </div>
          <div>
            <p>{set.sender_name}</p>
            <p className="mt-[14mm] border-t border-ink/60 pt-1">
              {set.signer_name}
              <span className="block text-[9pt] text-muted">{set.signer_role}</span>
            </p>
          </div>
        </div>
      </article>
  );
}
