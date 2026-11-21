"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark">
      Stampa / Salva PDF
    </button>
  );
}
