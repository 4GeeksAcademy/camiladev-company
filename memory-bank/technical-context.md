# Contexto tecnico

Revision: 2026-11-02. Fuentes: [README.md](../README.md),
[CONTEXT.md](../CONTEXT.md), [TESTING.md](../TESTING.md) y README de cada modulo.

## Mapa y limites

| Ruta | Responsabilidad |
| --- | --- |
| `public-website/` | Sitio publico Next.js; leer su README antes de escribir |
| `backoffice/uis/` | Aplicacion interna Next.js; seguir su README y AGENTS.md |
| `backoffice/services/` | API FastAPI del backoffice: usuarios, perfiles, autenticacion y proveedores |
| `packages/shared/` | Tipos compartidos existentes; reutilizar si corresponden |
| `agents/`, `skills/`, `mcps/` | Modulos de agentes, habilidades e integraciones de producto |
| `data/`, `infra/`, `internal/`, `scripts/`, `workflows/` | Datos, infraestructura y utilidades segun sus README |
| `.agents/`, `memory-bank/`, `AGENTS.md` | Configuracion y contexto persistente de herramientas de desarrollo |

Hay directorios anteriores o alternativos `uis/`, `uis-1/`, `services/` y
`services-1/`. Su existencia no autoriza nuevas apps alli, borrados ni
migraciones. Las apps nuevas y sus ampliaciones pertenecen a `public-website/`
y `backoffice/`. No crear un arbol paralelo ni copiar una base antigua.

## API interna y configuracion

La API usa Python 3.12+, uv, FastAPI, Pydantic, TinyDB, JWT, Passlib/bcrypt y
Resend. [Su README](../backoffice/services/README.md) define instalacion y entorno.
Desde `backoffice/services/`:

```sh
uv sync --python 3.12
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

`data/db.json` es relativo al directorio de esta API y contiene `users`,
`profiles`, `password_reset_tokens` y `suppliers`. No es la base de los backends
anteriores. `seed.py` reemplaza proveedores; no ejecutarlo sin permiso y respaldo.

Variables locales: `JWT_SECRET`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `FRONTEND_URL`,
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`. No guardar sus valores en la memoria.
En Codespaces `FRONTEND_URL` debe apuntar al HTTPS reenviado del frontend,
no al puerto de la API ni a localhost del destinatario del correo.

El frontend usa `AUTH_API_BASE_URL` y `SUPPLIERS_API_BASE_URL` para la API
interna (por defecto `http://127.0.0.1:8000`). El flujo de candidatos usa la
API externa definida por `NEXT_PUBLIC_API_URL`; no asumir almacenamiento local.

## Validacion por modulo

- Los comandos de raiz no sustituyen las comprobaciones de cada aplicacion.
  Consultar el `package.json` del modulo antes de seleccionar scripts.
- Para Python usar el entorno uv del backend, nunca el Python global.
  Ejemplo enfocado existente, desde `backoffice/services/`:
  `uv run --extra dev pytest tests/test_forgot_password.py --no-cov`.
  Instalar el extra dev solo si hace falta y con permiso para instalar.
- `--no-cov` sirve para una ejecucion parcial; no acredita el umbral global.
  [TESTING.md](../TESTING.md) documenta cobertura de autenticacion minima del
  70%; confirmar la configuracion vigente antes de una validacion global requerida.
- Para Next.js seguir los scripts del modulo y las advertencias locales de
  AGENTS.md. No presuponer una version o API a partir de conocimientos previos.
- Para documentacion comprobar referencias, estructura y `git diff --check`.
  No arrancar servidores ni correr suites de producto por un cambio solo documental.