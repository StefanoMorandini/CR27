import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, hasLocale } from "@/i18n/config";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/password"];

/** Area admin: rinnova la sessione Supabase e protegge le pagine. */
async function adminProxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (!user && !PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/**
 * - /admin/*: sessione e protezione dell'area riservata.
 * - Ogni altro URL senza prefisso di lingua viene reindirizzato alla lingua
 *   predefinita (/programma → /it/programma).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminProxy(request);

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
