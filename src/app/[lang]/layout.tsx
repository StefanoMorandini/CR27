import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import { event } from "@/lib/event";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
// Archivo con asse "larghezza": titoli estesi come nel logo
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [dict, lang] = await Promise.all([getDictionary(), getLocale()]);
  return {
    metadataBase: new URL(event.siteUrl),
    title: { default: dict.meta.title, template: `%s · ${dict.meta.shortTitle}` },
    description: dict.meta.description,
    openGraph: {
      type: "website",
      locale: lang === "it" ? "it_CH" : lang,
      siteName: dict.meta.title,
      images: [{ url: "/logo-cr27.jpg", width: 1536, height: 1024, alt: dict.meta.title }],
    },
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [dict, lang] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <html lang={lang} className={`${inter.variable} ${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans pb-tabbar">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
        >
          {dict.common.skipToContent}
        </a>
        <Header lang={lang} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} dict={dict} />
        <MobileTabBar
          items={[
            { href: `/${lang}`, label: dict.nav.home, icon: "home" },
            { href: `/${lang}/programma`, label: dict.nav.programma, icon: "clock" },
            { href: `/${lang}/risultati`, label: dict.nav.risultati, icon: "trophy" },
            { href: `/${lang}/info`, label: dict.nav.infoShort, icon: "pin" },
            { href: `/${lang}/food`, label: dict.nav.foodShort, icon: "food" },
          ]}
        />
      </body>
    </html>
  );
}
