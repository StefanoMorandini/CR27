"use client";

import { useEffect, useRef, useState } from "react";

const TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX = 5 * 1024 * 1024;

/**
 * Campo di upload del logo: trascina o scegli il file, anteprima immediata
 * e anteprima di come apparirà la card sul sito.
 */
export function LogoUpload({ current, name }: { current?: string | null; name: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remove, setRemove] = useState(false);
  const [drag, setDrag] = useState(false);
  const [sponsorName, setSponsorName] = useState(name);

  // Segue il campo "Nome" del form per l'anteprima della card
  useEffect(() => {
    const el = input.current?.form?.elements.namedItem("name");
    if (!(el instanceof HTMLInputElement)) return;
    const on = () => setSponsorName(el.value);
    el.addEventListener("input", on);
    return () => el.removeEventListener("input", on);
  }, []);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function accept(f: File | undefined) {
    if (!f) return;
    if (!TYPES.includes(f.type)) return setError("Formato non supportato: usa PNG, JPG, WEBP o SVG.");
    if (f.size > MAX) return setError("Il file supera i 5 MB.");
    setError(null);
    setRemove(false);
    setFile({ name: f.name, size: f.size });
    setPreview(URL.createObjectURL(f));
    // Il file selezionato (anche se trascinato) va nell'input del form
    if (input.current) {
      const dt = new DataTransfer();
      dt.items.add(f);
      input.current.files = dt.files;
    }
  }

  function clear() {
    if (input.current) input.current.value = "";
    setFile(null);
    setPreview(null);
    setError(null);
  }

  const shown = preview ?? (remove ? null : current) ?? null;

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
          drag ? "border-red bg-red-soft" : "border-line bg-stone/50 hover:border-ink/25"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-7 text-muted" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-semibold">{file ? file.name : "Trascina qui il logo o clicca per sceglierlo"}</span>
        <span className="text-xs text-muted">
          {file ? `${(file.size / 1024).toFixed(0)} KB · pronto per il caricamento` : "PNG, JPG, WEBP o SVG · max 5 MB · meglio con sfondo trasparente"}
        </span>
        <input
          ref={input}
          type="file"
          name="logo"
          accept={TYPES.join(",")}
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>
      {error && <p className="rounded-xl bg-red-soft px-3 py-2 text-xs text-red-dark">{error}</p>}

      {/* Anteprima della card come sul sito */}
      <div>
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Anteprima sul sito</span>
        <div className="grid h-28 place-items-center rounded-2xl border border-line bg-white p-4">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="max-h-16 max-w-[80%] object-contain" />
          ) : (
            <span className="font-display text-xl font-black uppercase text-ink">{sponsorName || "Nome sponsor"}</span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {file && (
          <button type="button" onClick={clear} className="font-semibold text-muted hover:text-ink">
            Annulla file selezionato
          </button>
        )}
        {current && !file && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remove_logo"
              checked={remove}
              onChange={(e) => setRemove(e.target.checked)}
              className="size-4 accent-[var(--red)]"
            />
            Rimuovi il logo attuale (verrà mostrato il nome)
          </label>
        )}
      </div>
    </div>
  );
}
