import Link from "next/link";
import type { Sponsor, SponsorTier } from "@/lib/types";
import { deleteSponsor, saveSponsor } from "../actions";
import { ConfirmButton } from "../ConfirmButton";
import { Check, Field, Submit, inputCls } from "../ui";
import { LogoUpload } from "./LogoUpload";

/** Form della sidebar: nuovo sponsor o modifica di quello selezionato. */
export function SponsorForm({ sponsor, tiers }: { sponsor?: Sponsor; tiers: SponsorTier[] }) {
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
        <form action={deleteSponsor} className="border-t border-line pt-4">
          <input type="hidden" name="id" value={sponsor.id} />
          <ConfirmButton message={`Eliminare "${sponsor.name}"?`}>Elimina sponsor</ConfirmButton>
        </form>
      )}
    </div>
  );
}
