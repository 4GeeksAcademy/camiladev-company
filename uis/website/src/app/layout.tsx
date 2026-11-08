import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexovasolutions.com"),
  title: "Nexova Solutions | Consultora HR-Tech con Reclutamiento Inteligente Impulsado por IA",
  description: "Nexova Solutions es una consultora HR-Tech moderna que optimiza procesos de selección con inteligencia artificial, automatización y analítica para contratar más rápido y con mayor precisión.",
  keywords: "Nexova Solutions, consultora HR-Tech, adquisición de talento, reclutamiento inteligente, reclutamiento con IA, automatización RRHH, outsourcing de reclutamiento, headhunting, operaciones de RRHH",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  authors: [{ name: "Nexova Solutions" }],
  openGraph: {
    type: "website",
    siteName: "Nexova Solutions",
    title: "Nexova Solutions | Consultora HR-Tech potenciada por IA",
    description: "Transformamos procesos de selección con automatización, analítica y operaciones inteligentes para equipos de talento modernos.",
    url: "/",
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexova Solutions | Consultora HR-Tech potenciada por IA",
    description: "Reclutamiento inteligente, automatización y analítica avanzada para procesos de talento más rápidos y precisos.",
    images: ["https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"],
  },
};

export const viewport = { themeColor: "#020617" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950 [font-family:'Manrope',ui-sans-serif,system-ui,sans-serif]">{children}</body>
    </html>
  );
}
