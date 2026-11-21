import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Archivo, Inter } from "next/font/google";
import { LogoMark } from "@/components/brand/LogoMark";
import { AdminNav } from "./AdminNav";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  title: { default: "Admin · Regionali 2027", template: "%s · Admin Regionali 2027" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="it" className={`${inter.variable} ${archivo.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone font-sans">
        <div className="ticino-stripe h-1" />
        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/admin" className="flex items-center gap-3">
              <LogoMark className="h-8 w-auto text-red" />
              <span className="font-display text-sm font-black uppercase leading-tight">
                Admin
                <span className="block text-[10px] font-semibold tracking-[0.25em] text-muted">Regionali 2027</span>
              </span>
            </Link>
            <Suspense>
              <AdminNav />
            </Suspense>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
