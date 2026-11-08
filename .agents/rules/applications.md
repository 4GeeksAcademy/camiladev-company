# Aplicaciones de la plantilla

Alcance: `uis/**`, `services/**` y toda creacion o traslado de apps.
Carga: mediante la tabla del AGENTS.md raiz.

- Sitio publico en `uis/website/`, app interna en `uis/backoffice/` y API en
  `services/`. No crear `apps/`, `frontend/` ni otra raiz alternativa.
- `uis/legacy/` y `services/legacy-api/` conservan aplicaciones anteriores;
  no son destinos para nuevas funcionalidades ni sustituyen las aplicaciones
  vigentes.
- Antes de escribir lee el README de la aplicacion o servicio afectado.
- Respeta los AGENTS.md locales de Next.js; no sustituyas sus bloques generados.
- Conserva los estilos, componentes, contratos y sistema de navegacion del
  modulo. Comprueba estados vacios, errores y carga de la superficie modificada.
- Comprueba responsive y accesibilidad cuando cambie UI: etiquetas, teclado,
  foco, contraste y ausencia de solapamientos. Documenta evidencia y viewport.
- Mantiene las llamadas internas a la API en la configuracion existente:
  `AUTH_API_BASE_URL` y `SUPPLIERS_API_BASE_URL`. No incluyas secretos en variables
  `NEXT_PUBLIC_*` ni en codigo enviado al navegador.
- No asumas que candidatos usan TinyDB; comprueba la integracion externa antes
  de cambiar ese flujo. No pruebes escrituras sobre servicios reales sin permiso.
- Usa scripts de la aplicacion afectada; un build de raiz del sitio publico
  no verifica el backoffice. No hagas instalaciones ni despliegues innecesarios.