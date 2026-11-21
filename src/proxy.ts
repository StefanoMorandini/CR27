import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";

/**
 * Ogni URL senza prefisso di lingua viene reindirizzato alla lingua predefinita
 * (/programma → /it/programma). Quando ci saranno più lingue, qui si potrà
 * scegliere la lingua in base all'header Accept-Language.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (hasLocale(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Esclude asset, API e file statici (con estensione)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
