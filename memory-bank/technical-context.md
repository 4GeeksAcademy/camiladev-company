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

Desde 2026-11-03, `backoffice/services/database.py` conserva el cliente TinyDB
para la persistencia existente e inicializa un motor PostgreSQL para Supabase
con SQLModel y `psycopg2`. `get_db()` proporciona una sesión por petición y la
cierra al terminar; no se mantiene una sesión global. `DATABASE_URL` se lee del
entorno o del `.env` local, que no se versiona. La conexión se verifico con una
consulta de solo lectura `SELECT 1`; esto no implica que existan tablas ni
endpoints de inventario.

El 2026-11-04 se crearon las tablas SQLModel `asset`, `assetentry` y `assetexit`
segun [BRIEFING.md](../BRIEFING.md). El lifespan de FastAPI ejecuta
`SQLModel.metadata.create_all(engine)` al arrancar. Se verificaron en Supabase
los campos, FK de ambas ordenes hacia `asset.id`, unicidad de `sku` y fechas
con zona horaria, sin insertar filas. No hay columna `current_stock` ni tabla
SQLModel de usuarios; `user_uuid` es una cadena sin FK.
`create_all` inicializa tablas ausentes, no migra las ya
existentes. Fuentes: `backoffice/services/models.py`, `main.py` y comprobacion
del catalogo PostgreSQL ejecutada en esta entrega.

El 2026-11-04 se crearon en `backoffice/services/schemas.py` los schemas
Pydantic `AssetCreate`/`AssetRead`, `AssetEntryCreate`/`AssetEntryRead` y
`AssetExitCreate`/`AssetExitRead`, sin importar el ORM. `current_stock` solo
existe en `AssetRead`; su calculo corresponde a las rutas. Los
requests rechazan campos extra y no aceptan ID, fechas ni `user_uuid`
generados por el servidor. Se validan oficinas, categorias, cantidades enteras
positivas y `assigned_to` obligatorio en allocation y nulo en consumption.
Evidencia: comprobacion en memoria de los seis schemas y 14 casos invalidos
rechazados, sin acceder a bases de datos.

El 2026-11-04 se registro `routers/inventory.py` en FastAPI con las seis rutas
del briefing bajo `/inventory`. Las lecturas son publicas y las escrituras
requieren usuario activo autenticado en TinyDB; `user_uuid` se toma de su ID.
El stock se calcula con subconsultas agregadas para evitar multiplicar sumas
al combinar entradas y salidas. Ambas escrituras de orden bloquean el activo
con `SELECT FOR UPDATE`; el sobregiro devuelve el `400` exacto del briefing.
El listado de ordenes usa dos consultas con joins y devuelve `asset` anidado,
`order_type` y auditoria mediante schemas Pydantic. Fuente: router y README.
Por solicitud del usuario del 2026-11-04, el bloqueo compartido tambien valida
que `order.office` coincida con `asset.office` antes de insertar; entradas y
salidas de otra oficina devuelven `400`. La comprobacion HTTP temporal verifico
ambos sentidos Valencia/Miami, stock sin cambios y ausencia de ordenes rechazadas.
Evidencia: comprobacion HTTP con SQLite/TinyDB aislados y PostgreSQL 17 temporal
en Docker; salidas simultaneas dieron `201`/`400`, FK rechazada con `23503` y
13 ordenes listadas en dos consultas. Se elimino el contenedor y no se escribio
en Supabase durante esas pruebas del router.

El 2026-11-04 se ejecuto `seed_inventory.py` en Supabase de desarrollo con
autorizacion del usuario: seis activos del briefing, cuatro entradas y tres
salidas, trazables al usuario activo de TinyDB. El script exige tablas vacias,
las bloquea y confirma la semilla atomicamente tras validar stock; no borra
inventario, proveedores ni usuarios. Stock por SKU: IT-001=12, IT-002=6,
PER-001=0, PER-002=0, OFF-001=16, TRN-001=0 (todos con prefijo NXV-).
Evidencia: ejecucion desde `backoffice/services/`, verificacion de registros,
oficinas y UUID sin revelar su valor; GET de productos y ordenes correctos.
Segunda ejecucion rechazada y conteos intactos. Fuente: script y README.

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