import ContactForm from "@/components/contact-form";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.nexovasolutions.com/#organization",
  "name": "Nexova Solutions",
  "url": "https://www.nexovasolutions.com",
  "description": "Consultora HR-Tech especializada en adquisición de talento, headhunting, outsourcing y operaciones de selección impulsadas por IA.",
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

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\u003c") }} />
<div>
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-slate-950">Saltar al contenido principal</a>
  <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
      <a href="#inicio" className="text-xl font-bold tracking-tight text-white [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Nexova Solutions</a>
      <ul className="hidden items-center gap-7 text-sm font-semibold lg:flex">
        <li><a href="#inicio" className="transition hover:text-cyan-300">Inicio</a></li>
        <li><a href="#evolucion" className="transition hover:text-cyan-300">Evolución</a></li>
        <li><a href="#servicios" className="transition hover:text-cyan-300">Servicios</a></li>
        <li><a href="#tecnologia" className="transition hover:text-cyan-300">Tecnología</a></li>
        <li><a href="#proceso" className="transition hover:text-cyan-300">Proceso</a></li>
        <li><a href="/formulario" className="transition hover:text-cyan-300">Formulario</a></li>
        <li><a href="/vacantes" className="transition hover:text-cyan-300">Vacantes</a></li>
        <li><a href="#contacto" className="rounded-full bg-cyan-300 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-200">Solicitar consulta</a></li>
      </ul>
      <details className="relative lg:hidden">
        <summary className="inline-flex cursor-pointer list-none items-center rounded-lg border border-slate-700 px-3 py-2 text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300" aria-label="Abrir menú principal">
          <span className="sr-only">Abrir menú principal</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </summary>
        <div className="absolute right-0 top-14 z-50 w-72 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl shadow-slate-950/70">
          <ul className="space-y-2 text-sm font-semibold">
            <li><a href="#inicio" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Inicio</a></li>
            <li><a href="#evolucion" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Evolución</a></li>
            <li><a href="#servicios" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Servicios</a></li>
            <li><a href="#tecnologia" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Tecnología</a></li>
            <li><a href="#proceso" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Proceso</a></li>
            <li><a href="/formulario" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Formulario</a></li>
            <li><a href="/vacantes" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Vacantes</a></li>
            <li><a href="#contacto" className="block rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Solicitar consulta</a></li>
            <li><a href="/vacantes" className="block rounded-full bg-cyan-300 px-4 py-2 text-center font-bold text-slate-950">Postularme ahora</a></li>
          </ul>
        </div>
      </details>
    </nav>
  </header>
  <main id="main-content">
    <section id="inicio" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.25),transparent_35%),radial-gradient(circle_at_85%_5%,rgba(16,185,129,0.17),transparent_38%),linear-gradient(160deg,#020617_8%,#071225_45%,#040b17_100%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 md:pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20">
        <article>
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">Operaciones de talento impulsadas por IA</span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Consultoría de talento con criterio humano, potenciada por IA operativa.</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">NEXOVA SOLUTIONS nació como consultora de reclutamiento y evolucionó a una operación HR-Tech enterprise: la IA acelera y ordena el proceso, mientras nuestros especialistas validan cada decisión crítica.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contacto" className="rounded-full bg-cyan-300 px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Solicitar consulta</a>
            <a href="#servicios" className="rounded-full border border-slate-500 px-7 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-300 hover:text-cyan-200">Ver Servicios</a>
            <a href="/vacantes" className="rounded-full border border-cyan-300/60 px-7 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10">Postularme ahora</a>
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Tiempo de cobertura</dt>
              <dd className="mt-1 text-lg font-bold text-cyan-300">-35%</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Precisión de ajuste</dt>
              <dd className="mt-1 text-lg font-bold text-cyan-300">94%</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Cobertura automatizada</dt>
              <dd className="mt-1 text-lg font-bold text-cyan-300">68%</dd>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">SLA operativo</dt>
              <dd className="mt-1 text-lg font-bold text-cyan-300">99.2%</dd>
            </div>
          </dl>
        </article>
        <aside className="rounded-3xl border border-cyan-300/30 bg-slate-900/70 p-5 shadow-xl shadow-cyan-500/10">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Panel operativo</p>
            <p className="mt-2 text-sm font-semibold text-white">Flujo de candidatos en vivo</p>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"><span>Búsqueda activa</span><span className="font-semibold text-cyan-300">214</span></li>
              <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"><span>Cribado con IA completado</span><span className="font-semibold text-cyan-300">176</span></li>
              <li className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"><span>Entrevistas agendadas</span><span className="font-semibold text-cyan-300">58</span></li>
            </ul>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs text-slate-400">Puntuación IA</p>
              <p className="mt-1 text-xl font-bold text-white">92.7</p>
              <p className="text-xs text-emerald-300">Shortlist priorizada lista</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs text-slate-400">Automatización de flujo</p>
              <p className="mt-1 text-xl font-bold text-white">41 reglas</p>
              <p className="text-xs text-cyan-300">Seguimientos activos</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
    <section id="evolucion" className="py-16 sm:py-20" aria-labelledby="evolucion-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Nuestra evolución</p>
          <h2 id="evolucion-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">De consultora tradicional a operación de talento enterprise con IA interna</h2>
          <p className="mt-4 text-slate-300">No reemplazamos la experiencia humana con tecnología: la amplificamos. Nuestra ventaja está en combinar método consultivo, cercanía con el cliente y una capa de inteligencia operativa construida para ejecutar mejor.</p>
        </header>
        <div className="grid gap-5 md:grid-cols-3" role="list">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6" role="listitem">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Antes</p>
            <h3 className="mt-2 text-lg font-bold text-white">Consultoría experta</h3>
            <p className="mt-3 text-sm text-slate-300">Base sólida en reclutamiento, headhunting y acompañamiento estratégico a equipos de RRHH.</p>
          </article>
          <article className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-6" role="listitem">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">Ahora</p>
            <h3 className="mt-2 text-lg font-bold text-white">Operación aumentada por IA</h3>
            <p className="mt-3 text-sm text-slate-200">Automatizamos cribado, seguimiento y priorización para liberar tiempo de nuestros reclutadores y enfocarlo en evaluación de calidad.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6" role="listitem">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Resultado</p>
            <h3 className="mt-2 text-lg font-bold text-white">Más velocidad, mejor criterio</h3>
            <p className="mt-3 text-sm text-slate-300">Procesos medibles, decisiones más consistentes y mejor experiencia para cliente, candidato y equipo interno.</p>
          </article>
        </div>
      </div>
    </section>
    <section id="servicios" className="border-y border-slate-800/80 bg-slate-900/40 py-16 sm:py-20" aria-labelledby="servicios-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Servicios</p>
          <h2 id="servicios-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Soluciones de talento diseñadas para escalar operaciones con calidad</h2>
          <p className="mt-4 text-slate-300">Combinamos metodología consultiva, automatización y analítica para resolver necesidades críticas de selección y dotación sin perder el trato humano.</p>
        </header>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-bold text-white">Adquisición de talento</h3>
            <p className="mt-3 text-sm text-slate-300"><strong className="text-slate-100">Problema:</strong> Vacantes críticas con baja velocidad de cobertura.</p>
            <p className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Solución:</strong> Búsqueda especializada + cribado asistido por IA.</p>
            <p className="mt-2 text-sm text-cyan-300"><strong className="text-cyan-200">Beneficio:</strong> Mejor ajuste y menor tiempo de cobertura.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-bold text-white">Búsqueda ejecutiva</h3>
            <p className="mt-3 text-sm text-slate-300"><strong className="text-slate-100">Problema:</strong> Perfiles de liderazgo de difícil acceso.</p>
            <p className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Solución:</strong> Headhunting consultivo con validación por competencias.</p>
            <p className="mt-2 text-sm text-cyan-300"><strong className="text-cyan-200">Beneficio:</strong> Contrataciones estratégicas y sostenibles.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-bold text-white">Externalización del reclutamiento (RPO)</h3>
            <p className="mt-3 text-sm text-slate-300"><strong className="text-slate-100">Problema:</strong> Equipos internos saturados y procesos dispersos.</p>
            <p className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Solución:</strong> Operación de punta a punta con SLA y reportes continuos.</p>
            <p className="mt-2 text-sm text-cyan-300"><strong className="text-cyan-200">Beneficio:</strong> Escalabilidad sin perder control operativo.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-bold text-white">Dotación de soporte al cliente</h3>
            <p className="mt-3 text-sm text-slate-300"><strong className="text-slate-100">Problema:</strong> SLA de atención con picos de demanda.</p>
            <p className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Solución:</strong> Selección y habilitación de equipos de soporte.</p>
            <p className="mt-2 text-sm text-cyan-300"><strong className="text-cyan-200">Beneficio:</strong> Continuidad operativa y experiencia del cliente.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-lg font-bold text-white">Consultoría de RRHH</h3>
            <p className="mt-3 text-sm text-slate-300"><strong className="text-slate-100">Problema:</strong> Falta de estandarización y visibilidad en RRHH.</p>
            <p className="mt-2 text-sm text-slate-300"><strong className="text-slate-100">Solución:</strong> Diseño de procesos, gobernanza y analítica de talento.</p>
            <p className="mt-2 text-sm text-cyan-300"><strong className="text-cyan-200">Beneficio:</strong> Operaciones de talento más predecibles y humanas.</p>
          </article>
        </div>
      </div>
    </section>
    <section id="tecnologia" className="py-16 sm:py-20 lg:py-24" aria-labelledby="tecnologia-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Tecnología que impulsa nuestros procesos</p>
          <h2 id="tecnologia-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Nexova TalentFlow AI: plataforma interna para operar reclutamiento de forma inteligente</h2>
          <p className="mt-4 text-slate-300">No comercializamos software. Utilizamos esta tecnología internamente para acelerar decisiones, automatizar tareas repetitivas y mejorar la experiencia de candidatos y clientes.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Puntuación IA de CV</h3><p className="mt-2 text-sm text-slate-300">Priorización automatizada por habilidades, seniority y contexto del rol.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Ajuste semántico</h3><p className="mt-2 text-sm text-slate-300">Búsqueda semántica para identificar candidatos con mejor ajuste real.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Seguimiento de candidatos</h3><p className="mt-2 text-sm text-slate-300">Trazabilidad de cada etapa con visibilidad para cliente y reclutadores.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Automatización de flujo</h3><p className="mt-2 text-sm text-slate-300">Automatización de seguimientos, alertas y transferencias entre equipos.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Copiloto para reclutadores</h3><p className="mt-2 text-sm text-slate-300">Asistencia para resúmenes, recomendaciones y toma de decisiones.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><h3 className="font-semibold text-cyan-300">Analítica ejecutiva</h3><p className="mt-2 text-sm text-slate-300">Paneles con KPI, SLA y rendimiento operativo en tiempo real.</p></article>
        </div>
      </div>
    </section>
    <section id="proceso" className="border-y border-slate-800/80 bg-slate-900/35 py-16 sm:py-20" aria-labelledby="proceso-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Cómo funciona</p>
          <h2 id="proceso-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Flujo de selección con IA supervisada por especialistas</h2>
        </header>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="list">
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">01</p><p className="mt-2 font-semibold text-white">Atracción de candidatos</p><p className="mt-2 text-sm text-slate-300">Atracción multicanal por perfil y mercado objetivo.</p></li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">02</p><p className="mt-2 font-semibold text-white">Cribado con IA</p><p className="mt-2 text-sm text-slate-300">Análisis de CV, puntuación y recomendaciones de priorización.</p></li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">03</p><p className="mt-2 font-semibold text-white">Revisión de reclutador</p><p className="mt-2 text-sm text-slate-300">Validación humana, calibración y shortlist final con criterio consultivo.</p></li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">04</p><p className="mt-2 font-semibold text-white">Proceso de entrevistas</p><p className="mt-2 text-sm text-slate-300">Coordinación, seguimiento y retroalimentación estructurada.</p></li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">05</p><p className="mt-2 font-semibold text-white">Validación con cliente</p><p className="mt-2 text-sm text-slate-300">Decisión colaborativa con visibilidad de datos y SLA.</p></li>
          <li className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"><p className="text-xs text-slate-400">06</p><p className="mt-2 font-semibold text-white">Contratación e incorporación</p><p className="mt-2 text-sm text-slate-300">Cierre, incorporación y transferencia operativa sin fricción.</p></li>
        </ol>
        <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm text-cyan-100">Automatizaciones activas en el flujo: automatización de correos, seguimiento en vivo, recomendaciones IA y alertas operativas. Decisión final: siempre humana.</div>
      </div>
    </section>
    <section className="py-16 sm:py-20" aria-labelledby="beneficios-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Beneficios</p>
          <h2 id="beneficios-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Resultados medibles para equipos de talento y liderazgo</h2>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">35%</p><p className="mt-2 text-sm text-slate-200">Reducción promedio de tiempos de selección.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">94%</p><p className="mt-2 text-sm text-slate-200">Precisión de ajuste en shortlist priorizada.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">68%</p><p className="mt-2 text-sm text-slate-200">Automatización operativa en tareas repetitivas.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">24/7</p><p className="mt-2 text-sm text-slate-200">Seguimiento centralizado de candidatos y procesos.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">Tiempo real</p><p className="mt-2 text-sm text-slate-200">Paneles ejecutivos con lectura de SLA y rendimiento.</p></article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-3xl font-bold text-cyan-300">De punta a punta</p><p className="mt-2 text-sm text-slate-200">Flujos conectados desde búsqueda hasta incorporación.</p></article>
        </div>
      </div>
    </section>
    <section id="contacto" className="border-y border-slate-800/80 bg-slate-900/40 py-16 sm:py-20" aria-labelledby="contacto-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Contacto</p>
            <h2 id="contacto-title" className="mt-3 text-3xl font-bold text-white sm:text-4xl [font-family:'Sora',ui-sans-serif,system-ui,sans-serif]">Ayudamos a empresas a profesionalizar y escalar su operación de RRHH.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">Comparte los desafíos de tu organización y te proponemos un plan de consultoría de RRHH con tecnología interna, métricas claras y acompañamiento experto de principio a fin.</p>
            <p className="mt-3 max-w-2xl text-sm text-cyan-200">Este canal está pensado para empresas que desean conversar su necesidad con nuestro equipo consultivo. Si ya cuentas con requerimientos definidos y quieres enviar una solicitud estructurada, utiliza el <a href="/formulario" className="font-semibold underline decoration-cyan-300/60 underline-offset-2 hover:text-cyan-100">Formulario de solicitud</a>.</p>
          </article>
          <ContactForm />
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

    </>
  );
}
