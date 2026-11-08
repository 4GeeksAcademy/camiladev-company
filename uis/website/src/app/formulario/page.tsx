import type { Metadata } from "next";
import ApplicationForm from "@/components/application-form";

export const metadata: Metadata = {
  "title": "Solicitud de consulta y captación de talento | Nexova Solutions",
  "description": "Formulario de consulta y captación de talento de Nexova Solutions, consultora HR-Tech que optimiza reclutamiento con IA interna, automatización y analítica.",
  "keywords": "Nexova Solutions, consultora HR-Tech, formulario de consulta, adquisición de talento, automatización de reclutamiento, headhunting, outsourcing, operaciones de selección",
  "alternates": {
    "canonical": "/formulario"
  },
  "openGraph": {
    "type": "website",
    "title": "Solicitud de consulta y captación de talento | Nexova Solutions",
    "description": "Inicia tu proceso con una consultora HR-Tech moderna impulsada por IA interna para seleccionar talento con mayor velocidad y precisión.",
    "url": "/formulario",
    "images": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Solicitud de consulta y captación de talento | Nexova Solutions",
    "description": "Inicia tu proceso con una consultora HR-Tech moderna impulsada por IA interna para seleccionar talento con mayor velocidad y precisión.",
    "images": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
    ]
  }
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.nexovasolutions.com/#organization",
  "name": "Nexova Solutions",
  "description": "Consultora HR-Tech especializada en adquisición de talento, outsourcing y operaciones de selección impulsadas por IA interna.",
  "url": "https://www.nexovasolutions.com",
  "email": "contact@nexovasolutions.com",
  "telephone": "+34 960 450 210",
  "address": [
    {
      "@type": "PostalAddress",
      "addressLocality": "Valencia",
      "addressRegion": "Valencia",
      "addressCountry": "ES"
    },
    {
      "@type": "PostalAddress",
      "addressLocality": "Miami",
      "addressRegion": "Florida",
      "addressCountry": "US"
    }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "telephone": "+34 960 450 210",
      "email": "contact@nexovasolutions.com",
      "areaServed": "ES",
      "availableLanguage": [
        "es"
      ]
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "telephone": "+1 305 555 0198",
      "email": "contact@nexovasolutions.com",
      "areaServed": "US",
      "availableLanguage": [
        "en",
        "es"
      ]
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/nexova-solutions",
    "https://x.com/nexovasolutions"
  ]
};

export default function Page() {
  return (<>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <div>
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-slate-950 focus:rounded-md">Saltar al contenido principal</a>
  <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
      <a href="/" className="text-xl font-bold tracking-tight text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Nexova Solutions</a>
      <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
        <li><a href="/#inicio" className="transition hover:text-cyan-300">Inicio</a></li>
        <li><a href="/#evolucion" className="transition hover:text-cyan-300">Evolución</a></li>
        <li><a href="/#servicios" className="transition hover:text-cyan-300">Servicios</a></li>
        <li><a href="/#tecnologia" className="transition hover:text-cyan-300">Tecnología</a></li>
        <li><a href="/#proceso" className="transition hover:text-cyan-300">Proceso</a></li>
        <li><a href="/formulario" className="transition hover:text-cyan-300">Formulario</a></li>
        <li><a href="/vacantes" className="transition hover:text-cyan-300">Vacantes</a></li>
        <li><a href="/#contacto" className="rounded-full border border-cyan-300 px-4 py-2 text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950">Solicitar consulta</a></li>
      </ul>
      <details className="relative lg:hidden">
        <summary className="inline-flex cursor-pointer list-none items-center rounded-lg border border-slate-700 px-3 py-2 text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300" aria-label="Abrir menú principal">
          <span className="sr-only">Abrir menú principal</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z" clipRule="evenodd"/>
          </svg>
        </summary>
        <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-slate-950/70">
          <ul className="space-y-2 text-sm font-semibold">
            <li><a href="/#inicio" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Inicio</a></li>
            <li><a href="/#evolucion" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Evolución</a></li>
            <li><a href="/#servicios" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Servicios</a></li>
            <li><a href="/#tecnologia" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Tecnología</a></li>
            <li><a href="/#proceso" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Proceso</a></li>
            <li><a href="/formulario" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Formulario</a></li>
            <li><a href="/vacantes" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Vacantes</a></li>
            <li><a href="/#contacto" className="block rounded-full bg-cyan-300 px-4 py-2 text-center font-bold text-slate-950">Solicitar consulta</a></li>
          </ul>
        </div>
      </details>
    </nav>
  </header>
  <main id="main-content">
    <section className="relative overflow-hidden border-b border-slate-800 py-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.3),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_40%),linear-gradient(to_bottom,rgba(15,23,42,1),rgba(2,6,23,1))]"/>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <article>
          <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Consultoría HR-Tech con IA interna</p>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Activa un proceso de selección más rápido, preciso y escalable</h1>
          <p className="mt-4 max-w-3xl text-slate-200">Este formulario inicia tu flujo de consulta con Nexova Solutions. Nuestro equipo combina experiencia humana en adquisición de talento con automatización y analítica para acelerar contrataciones sin perder calidad.</p>
          <p className="mt-3 max-w-3xl text-sm text-cyan-200">Este formulario está diseñado para empresas que desean enviar un brief de servicio y para candidatos que quieren postularse a vacantes de forma estructurada. Si prefieres una conversación inicial con nuestro equipo antes de completar todos los datos, visita la sección <a href="/#contacto" className="font-semibold underline decoration-cyan-300/60 underline-offset-2 hover:text-cyan-100">Contacto</a>.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="text-xs text-slate-400">Respuesta consultiva</p>
              <p className="mt-1 text-lg font-bold text-cyan-300">&lt; 24h</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="text-xs text-slate-400">Precisión de ajuste</p>
              <p className="mt-1 text-lg font-bold text-cyan-300">94%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="text-xs text-slate-400">Cobertura automatizada</p>
              <p className="mt-1 text-lg font-bold text-cyan-300">68%</p>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-cyan-300/30 bg-slate-900/70 p-4 shadow-xl shadow-cyan-500/10">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">Cómo operamos internamente</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">1. Solicitud validada y priorizada por servicio</li>
            <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">2. Cribado y ajuste semántico asistido por IA</li>
            <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">3. Revisión de reclutador y calibración con cliente</li>
            <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-slate-200">4. Seguimiento automatizado y visibilidad continua</li>
          </ul>
          <p className="mt-3 text-xs text-cyan-200">La IA asiste y prioriza; la decisión final siempre es humana.</p>
        </article>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        <aside className="order-2 lg:order-1 lg:sticky lg:top-24 space-y-4" aria-label="Panel de inteligencia de solicitud">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Señales de evaluación</h2>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Calidad de perfil y consistencia profesional</li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Ajuste experiencia-vacante por contexto real</li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Compatibilidad de idioma, ubicación y modalidad</li>
              <li className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Priorización operativa para reclutadores</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Actividad operativa</h2>
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              <p className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">CVs analizados hoy: 143</p>
              <p className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Actualizaciones de ranking IA: 29</p>
              <p className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">Seguimientos automatizados: 61</p>
            </div>
          </article>
        </aside>
        <div className="order-1 lg:order-2 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 lg:col-span-2">
          <ApplicationForm />
        </div>
      </div>
    </section>
  </main>
  <footer className="bg-slate-950 py-12" aria-label="Pie de página">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div>
        <p className="text-lg font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">NEXOVA SOLUTIONS</p>
        <p className="mt-3 text-sm text-slate-400">Consultora HR-Tech moderna para procesos de reclutamiento inteligentes, escalables y orientados a resultados.</p>
      </div>
      <nav aria-label="Navegación footer">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Navegación</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li><a href="/" className="hover:text-cyan-300">Inicio</a></li>
          <li><a href="/#servicios" className="hover:text-cyan-300">Servicios</a></li>
          <li><a href="/#tecnologia" className="hover:text-cyan-300">Tecnología</a></li>
          <li><a href="/#proceso" className="hover:text-cyan-300">Proceso</a></li>
          <li><a href="/#contacto" className="hover:text-cyan-300">Contacto</a></li>
          <li><a href="/formulario" className="hover:text-cyan-300">Formulario de solicitud</a></li>
          <li><a href="/vacantes" className="hover:text-cyan-300">Aplicar a vacantes</a></li>
        </ul>
      </nav>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Contacto</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>contact@nexovasolutions.com</li>
          <li>Valencia, España: +34 960 450 210</li>
          <li>Florida, Estados Unidos: +1 305 555 0198</li>
          <li>Valencia, España | Miami, Florida</li>
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Servicios</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li>Adquisición de talento</li>
          <li>Búsqueda ejecutiva</li>
          <li>RPO</li>
          <li>Consultoría de RRHH</li>
        </ul>
      </div>
    </div>
    <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-800 px-4 pt-6 text-xs text-slate-500 sm:px-6 lg:px-8">
      <p>© 2026 Nexova Solutions. Todos los derechos reservados.</p>
      <p>Consultoría HR-Tech con IA interna y decisiones humanas en cada contratación.</p>
    </div>
  </footer>
</div>
  </>);
}
