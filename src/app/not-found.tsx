import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase">Falsa partenza</h1>
      <p className="mt-2 text-muted">La pagina che cerchi non esiste.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-navy px-6 py-3 font-semibold text-white">
        Torna alla home
      </Link>
    </div>
  );
}
