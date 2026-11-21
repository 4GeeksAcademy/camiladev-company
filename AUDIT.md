# Auditoría frontend: sitio público y backoffice

**Estado:** análisis estático inicial; puntuaciones generales de Lighthouse transcritas según lo reportado por el usuario.  
**Alcance:** `uis/website/` y `uis/backoffice/`.  
**Criterio:** priorizar los KPI de rendimiento solicitados (TTFB, LCP, CLS, INP y puntuación Performance); refactorizar en pasos pequeños, sin reestructurar arquitecturas ni atribuir mejoras sin medición.

## Línea base de rendimiento

El usuario confirmó que tomó las capturas iniciales antes de los cambios y reportó las puntuaciones por aplicación/dispositivo. Después aportó para website y backoffice los porcentajes TBT 29%, CLS 25% y LCP 23%, pero no especificó si representan ponderación, contribución u otra visualización de Lighthouse; no deben interpretarse como valores de las métricas. Tampoco indicó rutas medidas ni valores directos de Web Vitals.

Capturas iniciales en `audit/before/`:

- `audit-website-desktop.png`
- `audit-website-mobil.png`
- `audit-backoffice-desktop.png`
- `audit-backoffice-mobil.png`

El visor de esta sesión no expuso el contenido de las imágenes. Las puntuaciones que siguen provienen de la transcripción del usuario; rutas y diagnósticos de oportunidades todavía están pendientes. No se infiere a qué ruta concreta corresponde el backoffice.

| Aplicación/ruta | Dispositivo | Performance | Accesibilidad | Recomendaciones | SEO | TTFB | LCP | CLS | INP | Evidencia |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Website (ruta pendiente) | Escritorio | 96 | 97 | 100 | 63 | Pendiente | Pendiente | Pendiente | Pendiente | `audit/before/audit-website-desktop.png`; scores reportados por usuario |
| Website (ruta pendiente) | Móvil | 96 | 97 | 100 | 63 | Pendiente | Pendiente | Pendiente | Pendiente | `audit/before/audit-website-mobil.png`; scores reportados por usuario |
| Backoffice (ruta pendiente) | Escritorio | 97 | 100 | 100 | 60 | Pendiente | Pendiente | Pendiente | Pendiente | `audit/before/audit-backoffice-desktop.png`; scores reportados por usuario |
| Backoffice (ruta pendiente) | Móvil | 97 | 100 | 100 | 60 | Pendiente | Pendiente | Pendiente | Pendiente | `audit/before/audit-backoffice-mobil.png`; scores reportados por usuario |

**Decisión del primer arreglo:** no cambiar código de rendimiento todavía. Performance está en 96 (website) y 97 (backoffice) en ambos dispositivos; son puntuaciones altas, pero no revelan por sí solas TTFB, LCP, CLS o INP. Para respetar la prioridad de KPI, el primer paso es obtener esos cuatro valores y los diagnósticos asociados antes de seleccionar un arreglo de rendimiento. No hay evidencia para priorizar ahora el cambio de fuentes ni otra optimización concreta.

**Detalle adicional reportado para website y backoffice:** TBT 29%, CLS 25% y LCP 23% en ambas aplicaciones (significado de esos porcentajes no confirmado). No se consideran valores métricos ni evidencia suficiente para priorizar un cambio hasta conocer la etiqueta/contexto exacto mostrado por el informe y los valores de las métricas.

En “Recomendaciones: Confianza y seguridad” para website y backoffice se reportaron estos puntos: eficacia de CSP frente a XSS; política HSTS sólida; aislamiento de origen mediante COOP; mitigación de clickjacking mediante XFO o CSP; y mitigación de XSS basado en DOM mediante Trusted Types. Son recomendaciones transcritas, no fallos confirmados ni evidencia de que falten esos encabezados/políticas. Antes de cambiar configuración, comprobar en el informe el estado/impacto de cada auditoría y verificar los encabezados reales de las respuestas de ambos sitios.

**Corrección incremental 1 — clickjacking:** se configuró `X-Frame-Options: DENY` para todas las rutas de website y backoffice mediante `headers()` de Next.js. Los sitios son aplicaciones independientes y no hay un requerimiento documentado de que deban mostrarse dentro de un `iframe`; si existe ese caso de uso, reevaluar la política antes de desplegar. CSP, HSTS, COOP y Trusted Types quedan como problemas separados, pendientes de diagnóstico y cambios independientes. La comprobación HTTP posterior al cambio queda pendiente de reiniciar/levantar los servidores con la configuración nueva.

Como hallazgo secundario de auditoría, SEO tiene las puntuaciones más bajas (63 website y 60 backoffice). Puede ser el siguiente frente si el objetivo incluye elevar SEO, pero una puntuación agregada no identifica el fallo concreto. Revisar los diagnósticos SEO de Lighthouse antes de proponer un arreglo; no desplazar todavía los KPI principales de rendimiento.

Para que la comparación posterior sea útil, registrar la ruta exacta, conservar el mismo dispositivo/perfil, modo y condiciones de servidor. Revisar especialmente el elemento LCP, recursos que bloquean renderizado, trabajo JavaScript y cambios de layout antes de elegir el primer cambio.

TTFB dependerá principalmente de la respuesta del servidor y su entorno; LCP, del contenido/recursos que forman el elemento principal; CLS, de cambios de geometría; e INP, de la respuesta a interacciones. La puntuación Performance es una métrica agregada, no un reemplazo de esos diagnósticos.

## Hallazgos de duplicación

Los rangos son aproximados y corresponden a la inspección del código actual; verificar antes de editar porque pueden desplazarse.

### 1. Cabecera y navegación pública repetidas

**Ubicaciones:**

- `uis/website/src/app/page.tsx` (aprox. líneas 60–95).
- `uis/website/src/app/formulario/page.tsx` (aprox. líneas 86–121).
- `uis/website/src/app/vacantes/page.tsx` (aprox. líneas 86–121).

Las tres rutas repiten el enlace de salto al contenido, el encabezado fijo, la navegación de escritorio y el menú móvil basado en `<details>`. Se repiten contenedores, enlaces, clases, etiquetas accesibles y listas para escritorio/móvil. Cambian los destinos con prefijo `/#`, el enlace destacado de cada página y algunas variaciones de icono/CTA.

**Propuesta acotada:** extraer `PublicSiteHeader` bajo `uis/website/src/components/`, alimentado por enlaces/destinos configurables y variantes explícitas para los elementos destacados. Mantener cada página responsable de su contenido y conservar navegación nativa por enlaces; no introducir una nueva capa de rutas ni una abstracción de diseño global.

**Impacto esperado:** reduce markup duplicado y facilita mantener accesibilidad y navegación coherentes. Es una mejora de mantenibilidad; no hay evidencia para afirmar que por sí sola mejore TTFB, LCP, CLS, INP o Performance.

### 2. Datos estructurados Organization repetidos

**Ubicaciones:**

- `uis/website/src/app/page.tsx` (aprox. líneas 3–52).
- `uis/website/src/app/formulario/page.tsx` (aprox. líneas 30–79).
- `uis/website/src/app/vacantes/page.tsx` (aprox. líneas 30–79).

Las rutas declaran y serializan datos `Organization` casi iguales: nombre, URL, correo, teléfono, direcciones, puntos de contacto y perfiles sociales. Hay diferencias de descripción y escapado/serialización (`replace(/</g, ...)`), lo que puede provocar divergencias al actualizar información común.

**Propuesta acotada:** centralizar el objeto común en un módulo del website y usar un único helper/componente servidor para emitir JSON-LD; permitir descripción por ruta solo si es intencional. Antes de unificar, confirmar cuál descripción y política de escapado son las correctas.

**Impacto esperado:** consistencia de contenido estructurado y menos mantenimiento duplicado. No se espera atribuir mejora de KPI de rendimiento sin medición.

### 3. Carga de activos repetida en pantallas de inventario

**Ubicaciones observadas:**

- `uis/backoffice/src/app/inventory/orders/inbound/page.tsx`: efecto de carga aprox. líneas 26–49 y reintento 91–107.
- `uis/backoffice/src/app/inventory/orders/outbound/page.tsx`: efecto aprox. líneas 35–58 y reintento 176–188.
- `uis/backoffice/src/app/inventory/products/page.tsx`: helper `loadAssets` aprox. líneas 49–63 y carga por oficina aprox. 65–88.

Las pantallas repiten la llamada a `getInventoryProducts`, el descarte de respuestas tras desmontaje, estados de carga/error y mensajes de fallo. El flujo outbound vuelve a dispararse mediante un contador de intentos; el inbound implementa por separado la carga de reintento.

**Propuesta acotada:** si se elige esta refactorización, extraer un hook específico `useInventoryAssets` que exponga activos, carga, error y recarga, y acepte oficina opcional. Mantener fuera del hook el stock por activo y la lógica de envío de entradas/salidas; no generalizar todos los endpoints a un cliente de datos nuevo.

**Impacto esperado:** consistencia de estados y menos lógica repetida. No implica automáticamente menos solicitudes ni una mejora de los KPI.

## Oportunidad de rendimiento por verificar

- `uis/website/src/app/layout.tsx` (aprox. líneas 34–37) enlaza una hoja CSS de Google Fonts para Manrope y Sora y ya declara `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- `uis/backoffice/src/app/layout.tsx` usa `next/font/google` para esas familias.

Es una diferencia observable en estrategia de carga, no prueba de que las fuentes sean un cuello de botella en producción. Revisar en el informe Lighthouse/network waterfall si hay recursos de fuentes bloqueantes, impacto en LCP/CLS y política de conexión/compilación antes de proponer cambiar el mecanismo. No cambiar fuentes únicamente por simetría con el backoffice.

La inspección no encontró imágenes de contenido servidas mediante `<img>` o `next/image` en los archivos revisados; URLs de Unsplash identificadas aparecen en metadatos sociales. No se atribuye una oportunidad de imagen en página sin verificar el resto del árbol y el informe de auditoría.

## Orden de trabajo propuesto

1. **Extracción de mantenibilidad completada:** `uis/website/src/components/public-site-header.tsx` centraliza el salto al contenido, el header y los menús de escritorio/móvil. Las tres páginas configuran sus destinos y enlaces destacados; los destinos internos usan `next/link` y las anclas de la página conservan enlaces hash. No se afirma mejora de KPI.
2. Registrar resultados Lighthouse iniciales reales y elegir el primer problema por oportunidad/diagnóstico ligado a KPI.
3. Corregir solo ese problema, validar la superficie afectada y volver a medir bajo las mismas condiciones antes de elegir otro.
4. Tratar futuras extracciones (por ejemplo, carga de activos o JSON-LD) como cambios acotados separados; no presentarlas como optimizaciones de rendimiento salvo evidencia antes/después.
5. Registrar resultados finales y limitaciones en `REPORT.md` cuando se complete la comparación. No crear puntuaciones ni capturas que no se hayan obtenido.

### Validación de la extracción inicial

- `npx tsc --noEmit` desde `uis/website/`: correcto.
- `npm run lint -- src/components/public-site-header.tsx`: correcto.
- ESLint enfocado en el componente y las tres páginas reporta 18 errores `@next/next/no-html-link-for-pages` en enlaces internos existentes fuera de la cabecera (líneas 118/182–186 de formulario, 282–289 de inicio y 1139–1146 de vacantes). El componente extraído ya usa `next/link` para rutas; esos avisos de contenido preexistente quedan fuera de este cambio y pendientes de un paso separado.

## Limitaciones y estado

- Los valores Lighthouse siguen pendientes de transcripción desde las capturas iniciales del usuario.
- Este documento registra duplicaciones observadas en una revisión estática; no es una afirmación de impacto medido.
- En la sesión previa, las rutas de ambos frontends respondieron HTTP 200 en servidores de producción locales. Los comandos de `next build` compilaron rutas pero terminaron con `SecurityFatalError` asociado a una advertencia de seguridad en Next.js 16.4.3; esto no cuenta como build exitoso. No se actualizó Next.js.
- Aún no se ha realizado medición posterior ni se ha generado `REPORT.md` o capturas finales.
