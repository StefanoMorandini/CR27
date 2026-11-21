import type { Sponsor, SponsorTier } from "@/lib/types";
import { saveSponsor } from "../actions";
import { Check, Field, Submit, inputCls } from "../ui";

export function SponsorForm({ sponsor, tiers }: { sponsor?: Sponsor; tiers: SponsorTier[] }) {
  return (
    <form action={saveSponsor} className="grid gap-4 sm:grid-cols-2">
      {sponsor && <input type="hidden" name="id" value={sponsor.id} />}
      <Field label="Nome *">
        <input name="name" required defaultValue={sponsor?.name} className={inputCls} />
      </Field>
      <Field label="Tier *">
        <select name="tier_id" required defaultValue={sponsor?.tier_id} className={inputCls}>
          {tiers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Sito web">
        <input name="website_url" defaultValue={sponsor?.website_url ?? ""} placeholder="https://…" className={inputCls} />
      </Field>
      <Field label="Ordine" hint="Numero più basso = mostrato prima.">
        <input name="sort_order" type="number" defaultValue={sponsor?.sort_order ?? 0} className={inputCls} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Logo" hint="PNG, JPG, WEBP o SVG, max 5 MB. Meglio con sfondo trasparente. Senza logo viene mostrato il nome.">
          <div className="flex flex-wrap items-center gap-4">
            {sponsor?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sponsor.logo_url} alt="" className="h-14 w-auto rounded-lg border border-line bg-white p-2" />
            )}
            <input name="logo" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="text-sm" />
          </div>
        </Field>
        {sponsor?.logo_url && (
          <div className="mt-2">
            <Check name="remove_logo" label="Rimuovi il logo attuale" />
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <Field label="Nota interna" hint="Non visibile sul sito.">
          <input name="description" defaultValue={sponsor?.description ?? ""} className={inputCls} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2">
        <Check name="published" label="Pubblicato sul sito" defaultChecked={sponsor ? sponsor.published : true} />
        <Submit>{sponsor ? "Salva modifiche" : "Aggiungi sponsor"}</Submit>
      </div>
    </form>
  );
}
