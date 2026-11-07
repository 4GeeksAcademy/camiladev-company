import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Sora } from "next/font/google";
import { SessionBar } from "@/components/auth/SessionBar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexova | BackOffice",
  description: "Gestión interna de Recursos Humanos de Nexova.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable} ${sora.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
        <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/suppliers" className="brand text-xl font-bold text-white">Nexova</Link>
            <nav aria-label="Navegación principal" className="flex items-center gap-5">
              <Link href="/suppliers" className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300">Proveedores</Link>
              <Link href="/inventory/products" className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300">Inventario</Link>
              <Link href="/candidates" className="text-sm font-semibold text-slate-300 transition hover:text-cyan-300">Candidaturas</Link>
            </nav>
            <SessionBar />
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-800/70">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-4 py-5 text-xs text-slate-400 sm:px-6 lg:px-8">
            <span>Nexova</span><span>Uso interno · Recursos Humanos</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
