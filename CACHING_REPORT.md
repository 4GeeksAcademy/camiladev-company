# Informe técnico: optimización frontend (lazy loading y memoización)

## Alcance y criterio

Se revisaron las rutas y componentes de `uis/website/` y `uis/backoffice/`. El encargo concreto de implementación cubre dos cargas diferidas y una memoización en el frontend; no se añadió caché HTTP, de datos ni de backend. La división de código no requiere TTL: no conserva una copia de datos, sino que aplaza la descarga/ejecución del módulo hasta que la UI lo necesita.

Las decisiones priorizan UI condicional y flujos secundarios. En ambos casos la carga inicial evita el código de un componente que un usuario puede no abrir durante la visita. La reducción exacta del bundle debe confirmarse con un análisis de build; no se dispone de mediciones de producción ni de una sesión de React Profiler en este cambio.

## Lazy loading

| Aplicación / componente | Implementación | Justificación y coste de diferir |
| --- | --- | --- |
| `uis/website/src/components/vacancy-application-form.tsx` en `/vacantes` | `next/dynamic` en `lazy-vacancy-application-form.tsx`; el formulario solo se monta al abrir el popover `#apply-modal`. | Es un formulario largo (múltiples campos y opciones internacionales), con lógica de validación/sanitización en cliente. Se incluye una sola vez en un modal y no es necesario para leer el listado de vacantes. Quien no inicia una postulación evita la transferencia/parseo de ese módulo. Al abrir el popover hay una indicación accesible de carga mientras llega el chunk. El componente necesita hidratación cliente por su interacción con el formulario. |
| `uis/backoffice/componentes/candidate-form.tsx` desde `CandidateDetail` | `next/dynamic`; se solicita cuando `editing` es `true`. | El formulario solo aparece tras elegir “Editar candidatura” y no forma parte de la vista de lectura habitual del detalle. Aplazarlo evita cargar y evaluar el módulo de formulario/API en cada visita de lectura. La espera de un chunk al activar edición es una latencia pequeña y localizada, mostrada con un estado `role="status"`. |

Los imports son dinámicos y de ruta estática para que Next pueda generar chunks. No se fuerza SSR para los formularios dinámicos (ambos son UI de cliente). El formulario público se retrasa hasta abrir el popover, no solo hasta la hidratación de la página.

## Memoización con `useMemo`

Se memoizó el filtrado de candidaturas en `uis/backoffice/componentes/candidate-list.tsx`. Para cada candidatura se comprueban los filtros de estado y etapa, y cuando existe búsqueda se construye y normaliza el texto `nombre + email`. El cálculo es O(n) sobre el listado y puede repetirse por cambios de estado UI que no alteran ni el listado ni los criterios.

Dependencias explícitas: `[candidates, query, validStage, validStatus]`. `candidates` conserva la referencia del resultado de `useResource` mientras el estado de datos no cambia; `query` es el valor normalizado/deferred; los filtros provienen de la URL. Cualquier cambio en datos o criterios recalcula el resultado. No se aplica memoización a transformaciones triviales.

## Evidencia y medición

- No se recogieron trazas de red/build comparables antes y después ni perfiles de React DevTools; por tanto, no se presentan como hechos tiempos de carga, porcentajes de reducción o reducción de renders.
- No se ejecutó un seeder ni se cambió el volumen de la base de datos: este encargo limitado a frontend no altera consultas ni justifica inventar mediciones de endpoints o filas.
- Estimación cualitativa: el código del formulario de postulación deja de ser necesario en la carga inicial de `/vacantes` y el formulario de edición deja de ser necesario en la vista de lectura del detalle. En esas rutas se suma únicamente un pequeño wrapper para resolver la carga condicional. El tiempo de primera apertura del formulario puede aumentar por la solicitud del chunk.
- Para cuantificar el impacto, comparar en build de producción (con el mismo commit/datos) el chunk inicial y los chunks dinámicos, registrar red fría de `/vacantes` antes y después, y comprobar que el chunk del formulario solo se solicita al abrir `#apply-modal`. Para `CandidateDetail`, perfilar renderizados con una lista representativa, cambiar búsqueda/filtros y confirmar que `filter` no se vuelve a ejecutar en renders sin cambios de listado ni criterios.
- Validación ejecutada en este cambio: `npm test` pasa (8/8); `npm run typecheck` y `git diff --check` pasan. Tras instalar dependencias faltantes e iniciar el servidor Next.js, `npm run check:routes` pasó: `/`, `/formulario` y `/vacantes` respondieron HTTP 200. El servidor de desarrollo se detuvo después de la comprobación.

## Frescura y riesgos

No se cachean resultados del API en esta entrega, así que no se introduce riesgo de datos obsoletos ni se requiere TTL/invalidez. Los formularios conservan sus validaciones y operaciones actuales; la nueva espera está limitada a la primera apertura/entrada en modo edición. La memoización es solo de cálculo derivado y se invalida al cambiar cualquiera de sus entradas.
