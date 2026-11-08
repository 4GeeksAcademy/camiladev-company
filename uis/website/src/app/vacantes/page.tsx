import type { Metadata } from "next";
import VacancyApplicationForm from "@/components/vacancy-application-form";

export const metadata: Metadata = {
  "title": "Vacantes abiertas | Nexova Solutions",
  "description": "Explora vacantes abiertas en Nexova Solutions y empresas asociadas con procesos de reclutamiento inteligente, automatización y enfoque enterprise.",
  "keywords": "vacantes, empleo, reclutamiento IA, ATS, talento, Nexova Solutions, oportunidades laborales",
  "alternates": {
    "canonical": "/vacantes"
  },
  "openGraph": {
    "type": "website",
    "title": "Vacantes abiertas | Nexova Solutions",
    "description": "Oportunidades laborales en tecnología, datos, producto y operaciones con procesos de selección asistidos por IA.",
    "url": "/vacantes",
    "images": [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Vacantes abiertas | Nexova Solutions",
    "description": "Oportunidades laborales en tecnología, datos, producto y operaciones con procesos de selección asistidos por IA.",
    "images": [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
    ]
  }
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.nexovasolutions.com/#organization",
  "name": "Nexova Solutions",
  "url": "https://www.nexovasolutions.com",
  "description": "Consultora HR-Tech especializada en adquisición de talento, outsourcing y operaciones de selección impulsadas por IA interna.",
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
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-slate-950">Saltar al contenido principal</a>
  <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
      <a href="/" className="text-xl font-bold tracking-tight text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Nexova Solutions</a>
      <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
        <li><a href="/#inicio" className="transition hover:text-cyan-300">Inicio</a></li>
        <li><a href="/#evolucion" className="transition hover:text-cyan-300">Evolución</a></li>
        <li><a href="/#servicios" className="transition hover:text-cyan-300">Servicios</a></li>
        <li><a href="/#tecnologia" className="transition hover:text-cyan-300">Tecnología</a></li>
        <li><a href="/#proceso" className="transition hover:text-cyan-300">Proceso</a></li>
        <li><a href="/formulario" className="rounded-full border border-cyan-300 px-4 py-2 text-cyan-300 transition hover:bg-cyan-300 hover:text-slate-950">Formulario</a></li>
        <li><a href="/vacantes" className="transition hover:text-cyan-300">Vacantes</a></li>
        <li><a href="/#contacto" className="transition hover:text-cyan-300">Solicitar consulta</a></li>
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
            <li><a href="/formulario" className="block rounded-full bg-cyan-300 px-4 py-2 text-center font-bold text-slate-950">Formulario</a></li>
            <li><a href="/vacantes" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Vacantes</a></li>
            <li><a href="/#contacto" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Solicitar consulta</a></li>
          </ul>
        </div>
      </details>
    </nav>
  </header>
  <main id="main-content" className="bg-slate-950 text-slate-100 [font-family:'Manrope',ui-sans-serif,system-ui,sans-serif]">
    <section className="relative overflow-hidden border-y border-slate-800/80 py-16 sm:py-20 lg:py-24" aria-labelledby="vacancies-title">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_15%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_88%_0%,rgba(16,185,129,0.14),transparent_38%),linear-gradient(160deg,#020617_10%,#071225_50%,#040b17_100%)]"/>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 max-w-3xl text-left sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Nexova Talent Marketplace</p>
          <h1 id="vacancies-title" className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Vacantes abiertas para equipos que construyen el futuro del trabajo</h1>
          <h2 className="mt-5 text-lg font-semibold text-cyan-200 sm:text-xl">Oportunidades curadas con reclutamiento asistido por IA y evaluación humana experta</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">Explora posiciones activas en tecnología, operaciones, producto y retail. Cada vacante incluye contexto real de negocio, modalidad flexible y rangos salariales competitivos para entornos enterprise.</p>
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Tecnología</p>
              <h3 className="mt-2 text-xl font-bold text-white">Frontend Engineer</h3>
              <p className="mt-1 text-sm text-slate-300">Asterion Cloud</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Híbrido</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Semi Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Madrid, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 38.000 - 48.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Desarrollar interfaces para plataforma ATS con foco en performance, accesibilidad y experiencia de reclutadores enterprise.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: HTML, Tailwind CSS, TypeScript, APIs REST</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">ATS Platform</span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-emerald-200">AI Assisted</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Datos e IA</p>
              <h3 className="mt-2 text-xl font-bold text-white">Data and AI Analyst</h3>
              <p className="mt-1 text-sm text-slate-300">Nexora Intelligence</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Remoto</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Valencia, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 45.000 - 60.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Diseñar métricas de reclutamiento, scoring de candidatos y tableros ejecutivos para optimizar el funnel de talento en tiempo real.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: SQL, Python, Power BI, Prompt Engineering</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Predictive Hiring</span>
              <span className="rounded-full border border-indigo-300/40 bg-indigo-300/10 px-2.5 py-1 text-indigo-200">Analytics</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-data-ai" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Producto</p>
              <h3 className="mt-2 text-xl font-bold text-white">Product Manager ATS</h3>
              <p className="mt-1 text-sm text-slate-300">Vertex People Systems</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Híbrido</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Barcelona, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 55.000 - 72.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Liderar roadmap de automatización de selección, priorizar funcionalidades y coordinar squads de datos, UX y ingeniería.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: Product Discovery, Roadmapping, KPI Design</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">B2B SaaS</span>
              <span className="rounded-full border border-sky-300/40 bg-sky-300/10 px-2.5 py-1 text-sky-200">Enterprise</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-product" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Marketing</p>
              <h3 className="mt-2 text-xl font-bold text-white">Growth Marketing Specialist</h3>
              <p className="mt-1 text-sm text-slate-300">Helix Talent Studio</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Remoto</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Semi Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Miami, US</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> USD 52.000 - 68.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Escalar adquisición de leads B2B para servicios de reclutamiento y optimizar conversiones en embudos multicanal.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: SEO, Paid Media, CRO, HubSpot</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Lead Gen</span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-emerald-200">Performance</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-growth" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Soporte al cliente</p>
              <h3 className="mt-2 text-xl font-bold text-white">Customer Support Lead</h3>
              <p className="mt-1 text-sm text-slate-300">Pulse ServiceOps</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Presencial</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Sevilla, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 32.000 - 40.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Coordinar equipos de atención omnicanal con métricas SLA, automatización de tickets y mejora continua de experiencia.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: Zendesk, QA Service, SLA Monitoring</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Service Desk</span>
              <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-amber-200">24/7 Ops</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-support" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Ventas</p>
              <h3 className="mt-2 text-xl font-bold text-white">Account Executive B2B</h3>
              <p className="mt-1 text-sm text-slate-300">Orbit People Partners</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Híbrido</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Miami, US</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> USD 42.000 + variable</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Gestionar ciclo comercial completo para soluciones de staffing y consultoría HR-Tech en cuentas medianas y enterprise.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: CRM, Sales Pipeline, Consultative Selling</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Enterprise Sales</span>
              <span className="rounded-full border border-lime-300/40 bg-lime-300/10 px-2.5 py-1 text-lime-200">High Impact</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-sales" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Logistica y distribucion</p>
              <h3 className="mt-2 text-xl font-bold text-white">Logistics Operations Supervisor</h3>
              <p className="mt-1 text-sm text-slate-300">Nova Supply Chain</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Presencial</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Semi Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Miami, US</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> USD 24.000 - 31.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Supervisar turnos de distribución, indicadores de inventario y cumplimiento de entregas con soporte de tableros automatizados.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: WMS, KPI Ops, Inventory Control</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Ops Excellence</span>
              <span className="rounded-full border border-orange-300/40 bg-orange-300/10 px-2.5 py-1 text-orange-200">Distribution</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-logistics" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Recursos humanos</p>
              <h3 className="mt-2 text-xl font-bold text-white">HR Operations Partner</h3>
              <p className="mt-1 text-sm text-slate-300">Catalyst People Ops</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Híbrido</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Miami, US</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> USD 30.000 - 39.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Estandarizar procesos de atracción, onboarding y reporting de talento para organizaciones en expansión regional.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: People Analytics, Process Design, ATS Workflow</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">People Ops</span>
              <span className="rounded-full border border-violet-300/40 bg-violet-300/10 px-2.5 py-1 text-violet-200">Scale Up</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-hr" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Retail</p>
              <h3 className="mt-2 text-xl font-bold text-white">Repositor de Supermercado</h3>
              <p className="mt-1 text-sm text-slate-300">MercaPlus Centro</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Presencial</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Junior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Valencia, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 18.000 - 22.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Reposición de góndolas, control de fechas de vencimiento y apoyo en inventarios diarios para asegurar disponibilidad de productos.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: Reposición, Inventario, Atención en piso</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Turnos Rotativos</span>
              <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-emerald-200">Ingreso Inmediato</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-restock" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Operaciones</p>
              <h3 className="mt-2 text-xl font-bold text-white">Auxiliar de Almacén</h3>
              <p className="mt-1 text-sm text-slate-300">LogiHub Distribution</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Presencial</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Semi Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Zaragoza, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 21.000 - 27.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Recepción y clasificación de mercancía, preparación de pedidos y seguimiento de rutas internas con foco en seguridad operativa.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: Picking, Packing, Control de stock</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Centro Logístico</span>
              <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-amber-200">Seguridad Industrial</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-warehouse" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Administración</p>
              <h3 className="mt-2 text-xl font-bold text-white">Administrativo de Empresas</h3>
              <p className="mt-1 text-sm text-slate-300">Grupo Nova Gestión</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Híbrido</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Barcelona, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 30.000 - 38.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Gestión administrativa integral: facturación, control documental, coordinación contable y soporte a operaciones internas de la empresa.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: ERP, Facturación, Gestión documental</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Back Office</span>
              <span className="rounded-full border border-sky-300/40 bg-sky-300/10 px-2.5 py-1 text-sky-200">Finanzas Operativas</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-admin" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
          <article className="group rounded-2xl border border-white/10 bg-slate-900/55 p-6 shadow-lg shadow-slate-950/35 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:shadow-cyan-500/20">
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Asistencia ejecutiva</p>
              <h3 className="mt-2 text-xl font-bold text-white">Secretaria Administrativa</h3>
              <p className="mt-1 text-sm text-slate-300">Vector Corporate Services</p>
            </header>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
              <li><span className="font-semibold text-slate-100">Modalidad:</span> Presencial</li>
              <li><span className="font-semibold text-slate-100">Seniority:</span> Semi Senior</li>
              <li><span className="font-semibold text-slate-100">Ubicación:</span> Madrid, ES</li>
              <li><span className="font-semibold text-slate-100">Salario:</span> EUR 24.000 - 30.000</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Organización de agenda directiva, atención a clientes, manejo de correspondencia y coordinación de reuniones con equipos internos y externos.</p>
            <p className="mt-4 text-xs text-slate-400">Stack: Gestión de agenda, Office Suite, Atención telefónica</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-1 text-cyan-200">Office Support</span>
              <span className="rounded-full border border-violet-300/40 bg-violet-300/10 px-2.5 py-1 text-violet-200">Coordinación Ejecutiva</span>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" popoverTarget="apply-modal" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar</button>
              <button type="button" popoverTarget="details-modal-secretary" className="rounded-full border border-slate-500 px-4 py-2 text-sm font-bold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-lg hover:shadow-slate-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Ver detalles</button>
            </div>
          </article>
        </div>
        <section className="mt-10 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-slate-900/80 via-slate-900/70 to-cyan-950/40 p-6 shadow-lg shadow-slate-950/35">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Búsqueda personalizada</p>
          <h2 className="mt-2 text-xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">¿No encontraste una vacante alineada a tu perfil actual?</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">Comparte tu experiencia, expectativas y tipo de oportunidad deseada en nuestro formulario de contacto profesional. Nuestro equipo revisará tu perfil para conectarte con procesos activos y próximos openings que sí se ajusten a tu trayectoria.</p>
          <div className="mt-5">
            <a href="/formulario" className="inline-flex items-center justify-center rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Completar formulario de perfil profesional</a>
          </div>
        </section>
      </div>
    </section>
  </main>
  <div id="details-modal" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-title" aria-describedby="details-modal-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Frontend Engineer - Asterion Cloud</h2>
          <p id="details-modal-description" className="mt-2 text-sm text-slate-300">Vista ampliada de puesto con alcance, requisitos y proceso ATS para evaluación.</p>
        </div>
        <button type="button" popoverTarget="details-modal" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Híbrido</li>
            <li><span className="font-semibold text-white">Seniority:</span> Semi Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 38.000 - 48.000</li>
            <li><span className="font-semibold text-white">Ubicación:</span> Madrid, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">HTML, Tailwind CSS, TypeScript, APIs REST, control de versiones y colaboración con equipos de producto y datos.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Construir interfaces de alto rendimiento para flujos ATS.</li>
            <li>Traducir requerimientos de negocio en experiencias claras y escalables.</li>
            <li>Colaborar con reclutadores, producto y QA en iteraciones agiles.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en frontend moderno y accesibilidad.</li>
            <li>Ingles profesional para trabajo cross-team.</li>
            <li>Seguro de salud, plan de formacion y horario flexible.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Atraccion de candidatos: atraccion multicanal por perfil y mercado objetivo.</li>
          <li>Cribado con IA: analisis de CV, puntuacion y recomendaciones de priorizacion.</li>
          <li>Revision de reclutador: validacion humana y shortlist final.</li>
          <li>Proceso de entrevistas: coordinacion, seguimiento y feedback estructurado.</li>
          <li>Contratacion e incorporacion: cierre e integracion operativa.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-data-ai" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-data-ai-title" aria-describedby="details-modal-data-ai-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-data-ai-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Data and AI Analyst - Nexora Intelligence</h2>
          <p id="details-modal-data-ai-description" className="mt-2 text-sm text-slate-300">Analitica aplicada a reclutamiento para optimizar decisiones de talento.</p>
        </div>
        <button type="button" popoverTarget="details-modal-data-ai" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Remoto</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 45.000 - 60.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Valencia, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">SQL, Python, Power BI, modelado de datos y prompt engineering.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Disenar KPIs de reclutamiento y tableros ejecutivos.</li>
            <li>Desarrollar scoring de candidatos y modelos de priorizacion.</li>
            <li>Presentar insights accionables a equipos de negocio.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia comprobada en analitica avanzada.</li>
            <li>Comunicacion clara para stakeholders no tecnicos.</li>
            <li>Bono por performance y plan de capacitacion continua.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Screening inicial de perfil y fit tecnico.</li>
          <li>Challenge analitico sobre caso real de reclutamiento.</li>
          <li>Entrevista con equipo de datos y liderazgo de producto.</li>
          <li>Reunion final con cliente interno y plan de incorporacion.</li>
          <li>Oferta formal y onboarding guiado.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-data-ai" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-product" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-product-title" aria-describedby="details-modal-product-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-product-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Product Manager ATS - Vertex People Systems</h2>
          <p id="details-modal-product-description" className="mt-2 text-sm text-slate-300">Direccion de producto para soluciones ATS enterprise.</p>
        </div>
        <button type="button" popoverTarget="details-modal-product" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Hibrido</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 55.000 - 72.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Barcelona, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">Product discovery, roadmapping, definicion de KPI y gestion de backlog.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Liderar roadmap de automatizacion de seleccion.</li>
            <li>Priorizar funcionalidades de alto impacto de negocio.</li>
            <li>Coordinar squads de datos, UX e ingenieria.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en productos SaaS B2B.</li>
            <li>Capacidad de liderar decisiones basadas en datos.</li>
            <li>Plan de carrera, bonus y flexibilidad horaria.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Entrevista inicial con Talent Partner.</li>
          <li>Caso practico de priorizacion y estrategia de producto.</li>
          <li>Panel con stakeholders de tecnologia y negocio.</li>
          <li>Evaluacion cultural y de liderazgo.</li>
          <li>Oferta y plan de onboarding.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-product" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-growth" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-growth-title" aria-describedby="details-modal-growth-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-growth-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Growth Marketing Specialist - Helix Talent Studio</h2>
          <p id="details-modal-growth-description" className="mt-2 text-sm text-slate-300">Estrategia de crecimiento y performance para captacion B2B.</p>
        </div>
        <button type="button" popoverTarget="details-modal-growth" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Remoto</li>
            <li><span className="font-semibold text-white">Seniority:</span> Semi Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> USD 52.000 - 68.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Miami, US</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">SEO, paid media, CRO, HubSpot y analitica de embudos multicanal.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Escalar adquisicion de leads B2B calificados.</li>
            <li>Optimizar conversiones por etapa del funnel.</li>
            <li>Coordinar experimentos de crecimiento con ventas.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia previa en growth B2B.</li>
            <li>Manejo de dashboards y atribucion multicanal.</li>
            <li>Esquema de bonos por resultados.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Entrevista de contexto con reclutamiento.</li>
          <li>Revision de portafolio y casos de crecimiento.</li>
          <li>Entrevista tecnica con Head of Marketing.</li>
          <li>Sesion de alineacion con direccion comercial.</li>
          <li>Oferta final y fechas de inicio.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-growth" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-support" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-support-title" aria-describedby="details-modal-support-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-support-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Customer Support Lead - Pulse ServiceOps</h2>
          <p id="details-modal-support-description" className="mt-2 text-sm text-slate-300">Liderazgo de operacion de soporte con enfoque en SLA y experiencia cliente.</p>
        </div>
        <button type="button" popoverTarget="details-modal-support" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Presencial</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 32.000 - 40.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Sevilla, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">Zendesk, QA de servicio, monitoreo de SLA y gestion de equipos de atencion.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Coordinar equipos de atencion omnicanal.</li>
            <li>Supervisar KPI de calidad y tiempos de respuesta.</li>
            <li>Implementar mejoras continuas en procesos de soporte.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia liderando equipos de soporte.</li>
            <li>Conocimiento en plataformas de tickets y QA.</li>
            <li>Seguro medico y plan de carrera interno.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Screening con Talent Acquisition.</li>
          <li>Entrevista de liderazgo operativo.</li>
          <li>Caso de gestion de SLA y calidad.</li>
          <li>Entrevista final con direccion de operaciones.</li>
          <li>Oferta formal e incorporacion.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-support" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-sales" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-sales-title" aria-describedby="details-modal-sales-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-sales-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Account Executive B2B - Orbit People Partners</h2>
          <p id="details-modal-sales-description" className="mt-2 text-sm text-slate-300">Gestion comercial integral para cuentas medianas y enterprise.</p>
        </div>
        <button type="button" popoverTarget="details-modal-sales" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Hibrido</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> USD 42.000 + variable</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Miami, US</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">CRM, gestion de pipeline, ventas consultivas y forecast comercial.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Gestionar ciclo comercial completo de cuentas B2B.</li>
            <li>Construir relaciones con decisores de compra.</li>
            <li>Cerrar oportunidades de alto impacto.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en ventas consultivas enterprise.</li>
            <li>Historial de cumplimiento de cuota.</li>
            <li>Esquema variable y beneficios corporativos.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Entrevista inicial con reclutador.</li>
          <li>Role play comercial y evaluacion de discovery.</li>
          <li>Entrevista con Sales Manager regional.</li>
          <li>Sesion final con direccion comercial.</li>
          <li>Oferta y plan de objetivos trimestrales.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-sales" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-logistics" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-logistics-title" aria-describedby="details-modal-logistics-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-logistics-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Logistics Operations Supervisor - Nova Supply Chain</h2>
          <p id="details-modal-logistics-description" className="mt-2 text-sm text-slate-300">Supervision de distribucion y control operativo en entorno presencial.</p>
        </div>
        <button type="button" popoverTarget="details-modal-logistics" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Presencial</li>
            <li><span className="font-semibold text-white">Seniority:</span> Semi Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> USD 24.000 - 31.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Miami, US</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">WMS, KPI operativos, inventario y control de flujo de distribucion.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Supervisar turnos de distribucion e inventario.</li>
            <li>Garantizar cumplimiento de entregas y SLA.</li>
            <li>Coordinar acciones de mejora operativa.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en centros logísticos o distribucion.</li>
            <li>Conocimiento de indicadores operativos.</li>
            <li>Plan de beneficios y estabilidad laboral.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Evaluacion inicial de experiencia operativa.</li>
          <li>Entrevista con lider de centro logistico.</li>
          <li>Caso practico de resolucion de incidencias.</li>
          <li>Entrevista final con operaciones regionales.</li>
          <li>Oferta formal y capacitacion inicial.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-logistics" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-hr" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-hr-title" aria-describedby="details-modal-hr-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-hr-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">HR Operations Partner - Catalyst People Ops</h2>
          <p id="details-modal-hr-description" className="mt-2 text-sm text-slate-300">Operacion de RRHH con enfoque en estandarizacion y escalabilidad.</p>
        </div>
        <button type="button" popoverTarget="details-modal-hr" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Hibrido</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> USD 30.000 - 39.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Miami, US</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">People analytics, diseño de procesos y flujos ATS de onboarding.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Estandarizar procesos de atraccion y onboarding.</li>
            <li>Disenar reportes de talento para toma de decision.</li>
            <li>Alinear operaciones de RRHH con objetivos regionales.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en operaciones de RRHH en entornos dinamicos.</li>
            <li>Capacidad analitica y enfoque en mejora continua.</li>
            <li>Programa de bienestar y crecimiento profesional.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Entrevista inicial de compatibilidad.</li>
          <li>Evaluacion de caso de procesos de talento.</li>
          <li>Entrevista con lider de People Operations.</li>
          <li>Validacion con direccion y equipo regional.</li>
          <li>Oferta y plan de entrada.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-hr" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-restock" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-restock-title" aria-describedby="details-modal-restock-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-restock-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Repositor de Supermercado - MercaPlus Centro</h2>
          <p id="details-modal-restock-description" className="mt-2 text-sm text-slate-300">Operacion de reposicion y control de producto en piso de tienda.</p>
        </div>
        <button type="button" popoverTarget="details-modal-restock" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Presencial</li>
            <li><span className="font-semibold text-white">Seniority:</span> Junior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 18.000 - 22.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Valencia, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">Reposicion de gondolas, inventario en piso y control de fechas de vencimiento.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Reposicion de productos y orden de lineales.</li>
            <li>Control de stock y alertas de quiebre.</li>
            <li>Apoyo en inventarios y auditoria de pasillos.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Organizacion y atencion al detalle.</li>
            <li>Disponibilidad para turnos rotativos.</li>
            <li>Ingreso inmediato y capacitacion inicial.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Filtro inicial de experiencia en retail.</li>
          <li>Entrevista breve con encargado de tienda.</li>
          <li>Prueba practica de organizacion de gondola.</li>
          <li>Validacion de disponibilidad horaria.</li>
          <li>Alta e induccion en tienda.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-restock" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-warehouse" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-warehouse-title" aria-describedby="details-modal-warehouse-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-warehouse-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Auxiliar de Almacen - LogiHub Distribution</h2>
          <p id="details-modal-warehouse-description" className="mt-2 text-sm text-slate-300">Ejecucion operativa de almacen, recepcion y despacho.</p>
        </div>
        <button type="button" popoverTarget="details-modal-warehouse" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Presencial</li>
            <li><span className="font-semibold text-white">Seniority:</span> Semi Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 21.000 - 27.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Zaragoza, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">Picking, packing, control de stock y rutinas operativas de centro logistico.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Recepcion y clasificacion de mercancia.</li>
            <li>Preparacion de pedidos y control de despacho.</li>
            <li>Cumplimiento de protocolos de seguridad.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia previa en almacen o distribucion.</li>
            <li>Orden, ritmo operativo y trabajo en equipo.</li>
            <li>Beneficios de transporte y turnos estables.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Validacion de experiencia operativa.</li>
          <li>Entrevista con supervisor de almacen.</li>
          <li>Prueba practica de preparacion de pedidos.</li>
          <li>Chequeo de referencias laborales.</li>
          <li>Ingreso con capacitacion en seguridad.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-warehouse" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-admin" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-admin-title" aria-describedby="details-modal-admin-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-admin-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Administrativo de Empresas - Grupo Nova Gestion</h2>
          <p id="details-modal-admin-description" className="mt-2 text-sm text-slate-300">Gestion administrativa integral para soporte financiero y operativo.</p>
        </div>
        <button type="button" popoverTarget="details-modal-admin" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Hibrido</li>
            <li><span className="font-semibold text-white">Seniority:</span> Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 30.000 - 38.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Barcelona, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">ERP, facturacion, conciliaciones y gestion documental administrativa.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Gestionar procesos de facturacion y cobros.</li>
            <li>Coordinar flujo documental con contabilidad.</li>
            <li>Dar soporte operativo a areas de negocio.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Experiencia en administracion y finanzas operativas.</li>
            <li>Dominio de herramientas ERP.</li>
            <li>Seguro medico y capacitacion continua.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Screening curricular y validacion de experiencia.</li>
          <li>Prueba tecnica administrativa breve.</li>
          <li>Entrevista con lider de administracion.</li>
          <li>Entrevista final con direccion.</li>
          <li>Oferta e incorporacion planificada.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-admin" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="details-modal-secretary" popover="auto" role="dialog" aria-modal="true" aria-labelledby="details-modal-secretary-title" aria-describedby="details-modal-secretary-description" className="fixed inset-0 z-[120] m-0 h-screen w-screen overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/15 bg-slate-900/85 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Detalle de vacante</p>
          <h2 id="details-modal-secretary-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Secretaria Administrativa - Vector Corporate Services</h2>
          <p id="details-modal-secretary-description" className="mt-2 text-sm text-slate-300">Asistencia ejecutiva y coordinacion administrativa diaria.</p>
        </div>
        <button type="button" popoverTarget="details-modal-secretary" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Resumen del puesto</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-200">
            <li><span className="font-semibold text-white">Modalidad:</span> Presencial</li>
            <li><span className="font-semibold text-white">Seniority:</span> Semi Senior</li>
            <li><span className="font-semibold text-white">Rango salarial:</span> EUR 24.000 - 30.000</li>
            <li><span className="font-semibold text-white">Ubicacion:</span> Madrid, ES</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Stack y herramientas</h3>
          <p className="mt-3 text-sm text-slate-300">Gestion de agenda, ofimatica, atencion telefonica y coordinacion de reuniones.</p>
        </section>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Responsabilidades</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Organizar agenda y comunicaciones de direccion.</li>
            <li>Coordinar reuniones internas y externas.</li>
            <li>Gestionar documentacion administrativa diaria.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Requisitos y beneficios</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Excelente organizacion y comunicacion escrita.</li>
            <li>Manejo profesional de herramientas office.</li>
            <li>Beneficios corporativos y estabilidad.</li>
          </ul>
        </section>
      </div>
      <section className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-cyan-300">Proceso de seleccion</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
          <li>Filtro de perfil administrativo.</li>
          <li>Entrevista con responsable de oficina.</li>
          <li>Prueba practica de organizacion y redaccion.</li>
          <li>Validacion final con direccion.</li>
          <li>Oferta e incorporacion.</li>
        </ol>
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="show" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-lg hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Aplicar ahora</button>
        <button type="button" popoverTarget="details-modal-secretary" popoverTargetAction="hide" className="rounded-full border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Volver a vacantes</button>
      </div>
    </div>
  </div>
  <div id="apply-modal" popover="auto" role="dialog" aria-modal="true" aria-labelledby="apply-modal-title" aria-describedby="apply-modal-description" className="fixed inset-0 z-[130] m-0 h-screen w-screen overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md sm:p-6 lg:p-10">
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-slate-900/90 p-5 shadow-2xl shadow-cyan-500/15 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Postulación rápida</p>
          <h2 id="apply-modal-title" className="mt-2 text-2xl font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Aplicar a vacante</h2>
          <p id="apply-modal-description" className="mt-2 text-sm text-slate-300">Completa los datos para iniciar tu proceso de aplicación en la plataforma ATS.</p>
        </div>
        <button type="button" popoverTarget="apply-modal" popoverTargetAction="hide" className="inline-flex rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">Cerrar</button>
      </div>
      <VacancyApplicationForm />
    </div>
  </div>
  <footer className="border-t border-slate-800 bg-slate-950 py-10">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
      <div>
        <p className="text-lg font-bold text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">NEXOVA SOLUTIONS</p>
        <p className="mt-3 text-sm text-slate-400">Consultora HR-Tech moderna para procesos de reclutamiento inteligentes, escalables y orientados a resultados.</p>
      </div>
      <nav aria-label="Navegación footer">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Navegación</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          <li><a href="/" className="hover:text-cyan-300">Inicio</a></li>
          <li><a href="/#evolucion" className="hover:text-cyan-300">Evolución</a></li>
          <li><a href="/#servicios" className="hover:text-cyan-300">Servicios</a></li>
          <li><a href="/#tecnologia" className="hover:text-cyan-300">Tecnología</a></li>
          <li><a href="/#proceso" className="hover:text-cyan-300">Proceso</a></li>
          <li><a href="/formulario" className="hover:text-cyan-300">Formulario</a></li>
          <li><a href="/vacantes" className="hover:text-cyan-300">Vacantes</a></li>
          <li><a href="/#contacto" className="hover:text-cyan-300">Solicitar consulta</a></li>
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
