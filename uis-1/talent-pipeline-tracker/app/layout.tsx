import type { Metadata } from "next";
import Link from "next/link";
import { Manrope, Sora } from "next/font/google";
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
  title: "Candidaturas | Nexova",
  description: "Gestión interna del proceso de selección de Nexova.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
        <a className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-slate-950" href="#main-content">Saltar al contenido</a>
        <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-7 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="brand text-xl font-bold text-white" aria-label="Nexova, candidaturas">Nexova Solutions</Link>
          <nav aria-label="Navegación principal"><Link href="/" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">Candidaturas</Link></nav>
          <span className="ml-auto hidden text-xs text-slate-400 sm:block">People / Valencia</span>
        </div></header>
        <main id="main-content" className="mx-auto min-h-[calc(100vh-136px)] max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-10 lg:pb-16">{children}</main>
        <footer className="border-t border-slate-800/70"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 px-4 py-5 text-xs text-slate-400 sm:px-6 lg:px-8"><span>Nexova Solutions</span><span>Uso interno · People</span></div></footer>
      </body>
    </html>
  );
}
