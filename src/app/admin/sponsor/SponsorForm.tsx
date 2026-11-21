import Link from "next/link";
import type { Sponsor, SponsorContact, SponsorTier } from "@/lib/types";
import { deleteSponsor, saveSponsor } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Check, Field, Submit, inputCls } from "../ui";
import { LogoUpload } from "./LogoUpload";

/** Form della sidebar: nuovo sponsor o modifica di quello selezionato. */
export const statusLabels: Record<string, string> = {
  contatto: "Primo contatto",
  proposta: "Proposta inviata",
  confermato: "Confermato",
  fatturato: "Fatturato",
  pagato: "Pagato",
  annullato: "Annullato",
};

export function SponsorForm({ sponsor, tiers, contact }: { sponsor?: Sponsor; tiers: SponsorTier[]; contact?: SponsorContact }) {
  const c = contact;
  return (
    <div className="space-y-4">
      {/* key: ricrea il form quando cambia lo sponsor selezionato */}
      <form key={sponsor?.id ?? "new"} action={saveSponsor} className="space-y-4">
        {sponsor && <input type="hidden" name="id" value={sponsor.id} />}
        <Field label="Nome *">
          <input name="name" required defaultValue={sponsor?.name} className={inputCls} />
        </Field>
        <Field label="Logo">
          <LogoUpload current={sponsor?.logo_url} name={sponsor?.name ?? ""} />
        </Field>
        <div className="grid grid-cols-[2fr_1fr] gap-3">
          <Field label="Tier *">
            <select name="tier_id" required defaultValue={sponsor?.tier_id} className={inputCls}>
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ordine">
            <input name="sort_order" type="number" defaultValue={sponsor?.sort_order ?? 0} className={inputCls} />
          </Field>
        </div>
        <Field label="Sito web">
          <input name="website_url" defaultValue={sponsor?.website_url ?? ""} placeholder="https://…" className={inputCls} />
        </Field>
        <details className="group rounded-2xl border border-line" open={!sponsor || !c?.street}>
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-bold">
            Contatti e accordo <span className="text-xs font-semibold text-muted">riservato · non pubblicato</span>
          </summary>
          <div className="space-y-3 border-t border-line p-4">
            <Field label="Ragione sociale" hint="Per la lettera, se diversa dal nome sul sito.">
              <input name="legal_name" defaultValue={c?.legal_name ?? ""} className={inputCls} />
            </Field>
            <div className="grid grid-cols-[1fr_1.4fr] gap-3">
              <Field label="Saluto">
                <select name="salutation" defaultValue={c?.salutation ?? "Gentile Signora"} className={inputCls}>
                  <option>Gentile Signora</option>
                  <option>Gentile Signore</option>
                  <option>Spettabili</option>
                </select>
              </Field>
              <Field label="Persona di contatto">
                <input name="contact_name" defaultValue={c?.contact_name ?? ""} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input name="contact_email" type="email" defaultValue={c?.email ?? ""} className={inputCls} />
              </Field>
              <Field label="Telefono">
                <input name="contact_phone" defaultValue={c?.phone ?? ""} className={inputCls} />
              </Field>
            </div>
            <Field label="Via e numero">
              <input name="street" defaultValue={c?.street ?? ""} className={inputCls} />
            </Field>
            <div className="grid grid-cols-[0.8fr_1.6fr_1.2fr] gap-3">
              <Field label="NPA">
                <input name="postal_code" defaultValue={c?.postal_code ?? ""} className={inputCls} />
              </Field>
              <Field label="Località">
                <input name="city" defaultValue={c?.city ?? ""} className={inputCls} />
              </Field>
              <Field label="Paese">
                <input name="country" defaultValue={c?.country ?? "Svizzera"} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Importo CHF" hint="Vuoto = prezzo del tier">
                <input name="amount_chf" inputMode="decimal" defaultValue={c?.amount_chf ?? ""} className={inputCls} />
              </Field>
              <Field label="Data accordo">
                <input name="agreement_date" type="date" defaultValue={c?.agreement_date ?? ""} className={inputCls} />
              </Field>
              <Field label="Stato">
                <select name="status" defaultValue={c?.status ?? "contatto"} className={inputCls}>
                  {Object.entries(statusLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Note sull'accordo" hint="Es. prestazioni concordate fuori pacchetto. Compaiono nella lettera.">
              <textarea name="notes" rows={2} defaultValue={c?.notes ?? ""} className={inputCls} />
            </Field>
          </div>
        </details>
        <Field label="Nota interna" hint="Non visibile sul sito.">
          <input name="description" defaultValue={sponsor?.description ?? ""} className={inputCls} />
        </Field>
        <Check name="published" label="Pubblicato sul sito" defaultChecked={sponsor ? sponsor.published : true} />
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Submit>{sponsor ? "Salva modifiche" : "Aggiungi sponsor"}</Submit>
          {sponsor && (
            <Link href="/admin/sponsor" className="text-sm font-semibold text-muted hover:text-ink">
              Annulla
            </Link>
          )}
        </div>
      </form>
      {sponsor && (
        <Link
          href={`/admin/sponsor/${sponsor.id}/lettera`}
          className="flex items-center justify-between rounded-2xl bg-blue-soft px-4 py-3 text-sm font-semibold text-blue hover:bg-blue/10"
        >
          Genera la conferma di sponsorizzazione <span aria-hidden>→</span>
        </Link>
      )}
      {sponsor && (
        <form action={deleteSponsor} className="border-t border-line pt-4">
          <input type="hidden" name="id" value={sponsor.id} />
          <ConfirmButton message={`Eliminare "${sponsor.name}"?`}>Elimina sponsor</ConfirmButton>
        </form>
      )}
    </div>
  );
}
