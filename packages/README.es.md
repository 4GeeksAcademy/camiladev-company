# Carpeta `packages`

Esta carpeta contiene **paquetes compartidos** del monorepo: librerías internas, utilidades, tipos, componentes comunes, SDKs, clientes y cualquier código reutilizable por varias aplicaciones/agentes/pipelines.

Cada subcarpeta dentro de `packages/` debería representar **un paquete versionable** (por ejemplo `shared-types`, `ui`, `analytics-sdk`) con su README propio.

- **Propósito principal**: fomentar reutilización y consistencia entre todos los desarrollos de la compañía.
- **Recomendación**: documenta los paquetes que vayas añadiendo, su API pública y cómo se consumen desde `apps/`, `agents/` y `workflows/`.

## Paquete `incidents_analysis`

La lógica reutilizable para validar y analizar tickets CSV de Nexova está en [`incidents_analysis/`](./incidents_analysis/). Consulta su [README en español](./incidents_analysis/README.es.md) o [README en inglés](./incidents_analysis/README.md) para conocer la API y ejemplos de ejecución.
