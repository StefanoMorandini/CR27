import Link from "next/link";
import { LogoMark } from "@/components/brand/LogoMark";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function NotFound() {
  const [dict, lang] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <LogoMark animated id="nf" className="w-64 text-red" />
      <p className="font-display mt-6 text-6xl font-black text-red">404</p>
      <h1 className="font-display mt-2 text-3xl font-black uppercase">{dict.notFound.title}</h1>
      <p className="mt-2 text-muted">{dict.notFound.text}</p>
      <Link href={`/${lang}`} className="mt-6 inline-block rounded-full bg-red px-6 py-3 font-semibold text-white">
        {dict.notFound.back}
      </Link>
    </div>
  );
}
