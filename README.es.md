# Proyecto de Compañía - Ingeniería de IA — Plantilla para estudiantes

[![4Geeks Academy](https://img.shields.io/badge/4Geeks-Academy-blue)](https://4geeksacademy.com)
[![AI Engineering](https://img.shields.io/badge/track-AI%20Engineering-green)](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)

_Plantilla base para proyectos transversales del Programa de Carrera en Ingeniería de IA — 4Geeks Academy._

_Las instrucciones están [disponibles en inglés](./README.md)._

---

## Propósito

Este repositorio es la **plantilla de inicio** para los proyectos transversales. Trabajarás con escenarios de empresas reales (Brasaland, TrackFlow, Nexova) construyendo entregables que se corresponden con los hitos del curso (Web, Programación, Backend, Telemetría, RAG, Agentes, Workflows, Tiempo real).

- Crea una plantilla a partir de este repositorio.
- Reemplaza el `CONTEXT.md` placeholder por el contexto de tu empresa asignada.
- Usa `skills/` y los `README.md` por carpeta como guía de trabajo.

---

## Estado actual de la plantilla

Actualmente el repositorio ofrece una **estructura base de carpetas y documentación**, junto con una web estática funcional y scripts de desarrollo en la raíz.

- `CONTEXT.md` es un placeholder y debe sustituirse por el contexto de la empresa asignada.
- No existe todavía un `AGENTS.md` en la raíz.
- Existen scripts de desarrollo y verificación en la raíz (`dev`, `check:routes`, `typecheck`, `test`).
- La lógica de disponibilidad del formulario usa una fuente de verdad en TypeScript (`src/utils/collections.ts`) y es consumida por JavaScript (`validation.js`).
- Existe metadata del paquete compartido en `packages/shared/package.json` (`@repo/shared-types`).

---

## Estructura del repositorio

```text
ai-engineering-company-project-monorepo/
├── README.md
├── README.es.md
├── CONTEXT.md                # Placeholder a reemplazar con el contexto asignado
├── agents/                   # Patrones/plantillas de agentes y documentación de tools
├── data/                     # raw, process, pipelines, eval
├── docs/                     # Documentación de proyecto y arquitectura
├── infra/                    # Docker, Terraform, configuraciones de despliegue
├── internal/                 # CLIs, scripts de migración empaquetados, utilidades internas
├── mcps/                     # Servidores Model Context Protocol (MCP)
├── packages/
│   └── shared/               # Paquete compartido (@repo/shared-types)
├── scripts/                  # Convenciones/documentación de scripts
├── uis/
│   ├── backoffice/           # Frontend interno Next.js
│   ├── website/              # Sitio publico Next.js
│   └── legacy/               # Frontend anterior archivado
├── services/                 # API unificada FastAPI y TinyDB
│   └── legacy-api/           # API anterior archivada
├── shared/                   # Recursos/convenciones compartidas a nivel repo
├── skills/                   # Skills reutilizables para agentes
└── workflows/                # Documentación de automatizaciones/orquestación
```

---

## Cómo empezar

1. **Usa este repositorio como plantilla** y crea tu propio repo de proyecto.
2. **Clona** tu repositorio (o ábrelo en Codespaces).
3. **Reemplaza** `CONTEXT.md` con el contexto completo de tu empresa asignada.
4. **Revisa** las guias de [frontend](uis/backoffice/README.md) y [backend](services/README.md), y la documentacion de cada area.
5. **Empieza a implementar** entregables en `uis/backoffice/`, `uis/website/` y `services/`, reutilizando `packages/shared/` y `data/` según corresponda.

## Ejecutar la web

Comandos recomendados para este repositorio:

```bash
npm install
npm run dev
```

Esto levanta el sitio publico Next.js en `http://127.0.0.1:3001`, no el backoffice.

En Codespaces, abre el puerto `3001` desde la pestaña **Ports** y selecciona **Open in Browser**.

## Docker Compose

Desde la raíz, ejecuta el stack completo de desarrollo:

```bash
docker compose up
```

El `.env` raíz aporta `JWT_SECRET` y `DATABASE_URL`; ambas variables deben estar
configuradas. Compose inicia la API con Uvicorn `--reload` y las dos UIs con
recarga en caliente: website en `http://localhost:3000`, backoffice en
`http://localhost:3001` y API en `http://localhost:8000`. `BACKEND_INTERNAL_URL`
usa `http://api:8000` dentro de la red. Los datos TinyDB persisten en
`api-development-data`; `docker compose down` conserva el volumen. No uses
`docker compose down -v` si quieres conservarlos.

El stack de producción permanece separado:

```bash
docker compose -f compose.prod.yaml up --build
```

Ese modo publica el backoffice en `http://localhost:3000` y el website en
`http://localhost:3001`, y requiere configurar `FRONTEND_URL` con la dirección
pública correcta para los enlaces de recuperación.

## Nota sobre la ruta de Proveedores

Las pantallas `/suppliers` y `/candidates` pertenecen a la app Next.js dentro de `uis/backoffice/`.

- Ejecutar `npm run dev` desde la raíz levanta el sitio público directamente en el puerto `3001`; con Docker Compose de desarrollo usa el puerto `3000`.
- Para usar el directorio de Proveedores, levanta el frontend del backoffice:

```bash
cd uis/backoffice
npm install
npm run dev
```

Luego abre `http://127.0.0.1:3000/suppliers`.

Configura e inicia la API unificada siguiendo su
[README](services/README.md). La API externa de candidaturas se
configura por separado segun el [README del frontend](uis/backoffice/README.md).

## Verificación durante desarrollo

Además del servidor web, se recomienda validar tipado y tests de forma frecuente:

```bash
npm run typecheck
npm test
```

- `npm run typecheck`: ejecuta TypeScript en modo verificación (`tsc --noEmit`).
- `npm test`: ejecuta la suite de pruebas de validaciones.

## Chequeo rápido de rutas

Con el servidor arriba (`npm run dev`), ejecuta:

```bash
npm run check:routes
```

El script valida que carguen correctamente:

- `/`
- `/validation.js`
- `/pages/contact_form.html`
- `/pages/vacant.html`

## Fuente de verdad para disponibilidad

La disponibilidad del formulario se centraliza en TypeScript:

- `src/utils/collections.ts` define `AvailabilityOption` y `AVAILABILITY_MAP`.
- `validation.js` importa `AVAILABILITY_MAP`, inyecta dinámicamente las opciones del `<select id="availability">` y valida que el valor seleccionado exista en el mapa.

---

## Hitos (referencia)

| Hito | Enfoque       | Entregables típicos                              |
| ---- | ------------- | ------------------------------------------------ |
| 0    | Prework       | Configuración del entorno, primeros prompts      |
| 1    | Web           | Sitio corporativo, formularios, SEO              |
| 2    | Programación  | Lógica de negocio, puntuación, cálculos          |
| 3    | UI con IA     | Interfaces generadas con IA                      |
| 4    | Next.js       | Portales, app de fidelización, UI de operaciones |
| 5    | Backend       | API central (ubicaciones, menús, ventas, etc.)   |
| 6    | Telemetría    | Pipeline de datos, dashboards                    |
| 7    | RAG y memoria | Base de conocimiento semántica, búsqueda         |
| 8    | Agentes       | Agentes de soporte, onboarding, formación        |
| 9    | Workflows     | Automatizaciones con n8n                         |
| 10   | Tiempo real   | Dashboards en vivo, alertas, streaming           |

---

## Enlaces

- [4Geeks Academy — Ingeniería de IA](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)
- [Cómo empezar un proyecto de código](https://4geeks.com/lesson/how-to-start-a-project)

---

## Contribuidores

Esta plantilla fue creada como parte del Programa de Carrera de Ingeniería de IA de 4Geeks Academy por [@marcogonzalo](https://www.linkedin.com/in/marcogonzalo) y [@alezanchezr](https://x.com/alesanchezr), junto a otros muchos colaboradores. Descubre más sobre nuestro [Curso de Ingeniería de IA](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia) y sobre [otros cursos](https://4geeksacademy.com/es/comparar-programas).

Puedes encontrar otras plantillas y recursos similares en la [página de GitHub de 4Geeks Academy](https://github.com/4geeksacademy).

_Esta plantilla la mantiene 4Geeks Academy para el track de Ingeniería de IA. Uso exclusivo del programa._
