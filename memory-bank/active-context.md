# Estado activo y decisiones

Ultima actualizacion: 2026-11-02.

## Estado conocido

- El 2026-11-06, con autorizacion del usuario, se instalo `uv@0.13.7`
  mediante `pip install --user uv`. Desde `backoffice/services/`,
  `python3 -m uv sync --python 3.12 --no-dev` preparo el entorno compartido
  de la raiz `.venv` sin cambios versionados. Se arranco la API con
  `python3 -m uv run --no-sync uvicorn main:app --host 127.0.0.1 --port 8000`.
  Evidencia: startup completo; GET `/` correcto, GET `/inventory/products`
  devolvio 6 productos con stock entero y GET `/inventory/orders` 7 ordenes.
  Solo se hicieron lecturas; no se ejecutaron semillas ni se modifico
  `JWT_SECRET`. El 2026-11-07 se detuvo el backend por peticion del usuario;
  se confirmo que el puerto 8000 dejo de responder. En la siguiente sesion,
  el usuario confirmo que la API estaba activa y se verifico `GET /` correcto.
  Se mantiene activa para el desarrollo actual; comprobarla al reanudar despues.
- El 2026-11-06 el usuario confirmo la edicion manual de
  `backoffice/uis/.env.local` para configurar
  `NEXT_PUBLIC_INVENTORY_API_URL=http://localhost:8000`. Fuente: confirmacion
  del usuario; no se leyo el archivo ni se verifico aun desde el frontend.
- El 2026-11-06 se implemento la capa de integracion de inventario en
  `backoffice/uis/src/lib/inventory.ts`: seis endpoints tipados, token desde
  `getToken()` de localStorage, Bearer en cada solicitud y errores explicitos
  mediante `InventoryApiError` con estado HTTP. Un 401 borra el token local.
  El proxy `src/app/api/inventory/[...path]/route.ts` limita rutas y metodos
  al contrato, verifica la sesion contra `/auth/me` y usa
  `NEXT_PUBLIC_INVENTORY_API_URL` desde el servidor, evitando llamadas a
  localhost desde el navegador. Conserva mensajes de error de inventario,
  incluyendo validaciones 422, sin serializar objetos como texto de error.
  Evidencia: `npx next typegen`, `npx tsc --noEmit` y ESLint enfocado pasaron;
  typegen resolvio el helper LayoutProps ausente sin cambiar el layout.
  Comprobacion temporal en memoria correcta para seis llamadas con Bearer,
  errores 400/422/500, proxy sin sesion o token invalido, conservacion del
  detalle 400 y limpieza de sesion 401. No se crearon archivos de pruebas,
  no se hicieron peticiones de escritura al backend.
- El 2026-11-07 se implemento solamente la pagina autenticada
  `/inventory/products`, con tabla de `Asset` (id, name, sku, category, office,
  current_stock), filtro por oficina, estados de carga/vacio/error/reintento,
  y enlaces de entrada/salida preseleccionados por `asset_id`. La leyenda
  explicita el criterio visual local de stock bajo (1-5), agotado (0) y
  disponible (>5), ya que el briefing no define umbral. El badge de stock usa
  ancho minimo, padding mayor y `whitespace-nowrap` para numeros de varios
  digitos. El 2026-11-07 el ajuste paso `npx tsc --noEmit`, ESLint enfocado y
  `npm run build`; no se pudo validar con captura responsive porque no hay
  browser Playwright instalado. Se agrego Inventario
  a la navegacion del backoffice y el enlace visible "Ver historial de órdenes"
  al encabezado del stock. `npx tsc --noEmit` y ESLint enfocado pasaron;
  `curl http://127.0.0.1:3000/inventory/products` confirmo la ruta y el estado
  SSR de comprobacion de sesion. No se pudo hacer prueba en navegador porque
  Playwright no tiene browser instalado. El backend respondio en el puerto
  8000 durante esta sesion.
- El 2026-11-07 el usuario compartio una captura de `/inventory/orders` donde
  aparecia una segunda barra de sesion. La fuente actual solo monta
  `SessionBar` en `layout.tsx`; se reinicio Next.js para descartar un modulo
  antiguo en desarrollo. Tras reiniciar, `/inventory/orders` y su GET al proxy
  respondieron 200; un primer GET de productos recibio 401 y los siguientes,
  tras un login 200, respondieron 200. Inspeccion visual en navegador pendiente.
- El 2026-11-07 se implemento `/inventory/orders/inbound`, protegido por
  `PrivateRoute`. Carga activos con `getInventoryProducts`, preselecciona
  `asset_id` de la URL, ofrece nombre/SKU/oficina en el selector y deriva la
  oficina del activo. Valida cantidad entera positiva y proveedor, evita doble
  envio, llama `createInventoryEntry`, limpia activo/cantidad/proveedor al
  exito y muestra confirmacion o el error de API en `role=alert`. Evidencia:
  `npx tsc --noEmit`, ESLint enfocado y `npm run build` correctos; la ruta
  aparece estatica en el build. POST simulado verifico payload, Bearer y
  mensajes 400/500. GET del frontend respondio con el estado SSR
  "Verificando sesion". No habia browser Playwright instalado; no se enviaron
  ordenes reales.
- El 2026-11-07 se implemento `/inventory/orders/outbound`, protegido por
  `PrivateRoute`. Lista activos por nombre/SKU/oficina; al cambiar la seleccion
  consulta `GET /inventory/products/{id}` y muestra `current_stock` antes de
  habilitar cantidad. Descarta respuestas de stock obsoletas al cambiar activo,
  advierte y bloquea el envio si la cantidad supera el stock, permite
  `allocation`/`consumption` con `assigned_to` acorde al schema, y deriva la
  oficina del activo. El `400` de la API se muestra junto a cantidad; el exito
  se confirma en pantalla. Evidencia: `npx tsc --noEmit`, ESLint enfocado y
  `npm run build` correctos; GET real de detalle devolvio stock entero. Prueba
  fetch simulada verifico payloads de ambos tipos, Bearer y mensaje 400 exacto,
  sin escrituras. No se pudo hacer prueba visual porque no hay browser
  Playwright instalado.
- El 2026-11-07 se implemento `/inventory/orders` como historial autenticado y
  de solo lectura. Muestra entrada/salida con distintivo de color, producto,
  cantidad, fecha local y `user_uuid`, e incluye carga, vacio, error y reintento.
  Evidencia: el GET real confirmo 7 ordenes con los campos requeridos (UUIDs no
  impresos); `npx tsc --noEmit`, ESLint enfocado y `npm run build` pasaron; la
  ruta respondio con el estado SSR de comprobacion de sesion. No hay edicion ni
  borrado. No se pudo hacer prueba visual porque no hay browser Playwright
  instalado.
- El 2026-11-07 se unifico la navegacion del backoffice en el header global:
  Proveedores permanece como un unico enlace del menu; `SessionBar` ahora
  muestra Mi perfil, BackOffice · People y Cerrar sesion en ese orden solo
  cuando hay token. Se retiraron las barras por pagina y se anadio el acceso
  Cambiar contraseña dentro del perfil. Evidencia: busqueda de referencias,
  `npx tsc --noEmit`, ESLint enfocado y `npm run build` correctos.
- El 2026-11-07 se sustituyo el favicon predeterminado `src/app/favicon.ico`
  por `src/app/icon.svg`, un monograma `Nx` de Nexova con colores del backoffice;
  no habia un logo oficial entre los assets del repositorio. `npm run build`
  paso, `/icon.svg` devuelve 200 `image/svg+xml` y `/favicon.ico` devuelve 404.
- El 2026-11-07 se sustituyo tambien `public-website/src/app/favicon.ico` por
  el mismo `src/app/icon.svg` de Nexova. El build publico paso con
  `node node_modules/next/dist/bin/next build` porque existe el paquete Next
  pero falta el enlace `node_modules/.bin/next`; el manifiesto de rutas solo
  incluye `/icon.svg`. El build advierte que detecta varios lockfiles y elige
  la raiz del workspace; no se modificaron lockfiles ni dependencias.
- El 2026-11-07 se investigo una captura donde Productos quedaba cargando. Los
  GET directos de la API respondieron en 0.08-0.10 s, pero logs de Next habian
  registrado GET autenticados del proxy de inventario entre 88 y 100 s. Se
  agrego `AbortSignal.timeout(15000)` al chequeo `/auth/me` y a la llamada
  upstream de inventario, para terminar la carga con error en vez de dejarla
  pendiente indefinidamente. Evidencia: TypeScript, ESLint enfocado y build
  pasaron; smoke test aislado comprobo ambas señales de 15 s y el flujo normal.
  Proxy sin token responde 401. No se pudo reproducir la peticion autenticada
  desde el navegador ni confirmar la vista visualmente; requiere recargar con
  sesion activa y comprobar que la tabla carga o que aparece el error de timeout.
- El 2026-11-06 se corrigio el aviso `glob@10.5.0` de la instalacion del
  backoffice UI con un override limitado a `babel-plugin-istanbul` para usar
  `test-exclude@8`. Posteriormente, con autorizacion del usuario, se anadieron
  overrides por rango vulnerable para `glob@14.0.4` y `minimatch@11.0.5`,
  sin modificar `minimatch@3` de ESLint ni Jest/Next.js; lockfile actualizado.
  Fuente: `backoffice/uis/package.json`, `npm install` y
  `npm ls glob minimatch --all` (salida 0). `npm run lint` paso sin avisos.
  La prueba existente `auth-storage.test.ts` paso sus 10 casos
  con instrumentacion y cobertura del 100 % en ese archivo, no global.
  La cobertura se genero fuera del repositorio en `/tmp`.
  ESLint 10 se descarto: aunque lint paso, los ultimos plugins import,
  jsx-a11y y react de Next.js no lo admiten en sus peers (`ELSPROBLEMS`).
  Se conserva ESLint 9 compatible; su aviso deprecated sigue pendiente de
  soporte upstream. `npm audit --json` confirmo la reduccion de 27 alertas a
  6 bajas, todas originadas por `deepmerge` en la cadena de Jest; ninguna
  moderada, alta o critica. `deepmerge@4.3.1`, ultima version consultada,
  sigue afectada. No se aplico audit fix, no se aprobaron los scripts de
  instalacion pendientes ni se cambio la API durante la tarea de dependencias.
- El repositorio ya contiene sitio publico, UI interna y API; no parte de cero.
- La API unificada del backoffice tiene autenticacion, usuarios, perfiles y
  proveedores segun [su README](../backoffice/services/README.md).
- El 2026-11-03 se inicializo y verifico la conexion SQLModel/psycopg2 hacia
  Supabase en `backoffice/services/database.py`; TinyDB sigue disponible y
  `get_db()` entrega sesiones por peticion. La verificacion fue `SELECT 1`.
  La conexion se conserva para el inventario.
- El 2026-11-04 se implementaron `Asset`, `AssetEntry` y `AssetExit` en SQLModel
  y la inicializacion del esquema desde el lifespan de FastAPI. La comprobacion
  del arranque en Supabase verifico campos, FK, `sku` unico y fechas UTC, sin
  insertar datos. Pasaron los cinco casos existentes de `test_register.py`
  con `--no-cov`; esto no acredita cobertura global.
- El 2026-11-04 se crearon los seis schemas de inventario en `schemas.py`,
  separados del ORM. Incluyen stock solo de respuesta y validacion de
  asignaciones, cantidades, oficinas y categorias. La comprobacion en memoria
  valido respuestas y rechazo 14 casos invalidos, sin escribir pruebas nuevas
  ni acceder a bases.
- El 2026-11-04 se implementaron y registraron las seis rutas `/inventory`,
  con schemas Pydantic, stock agregado y UUID del creador desde TinyDB.
  Escrituras autenticadas y lecturas publicas segun el alcance solicitado.
  Validacion HTTP aislada correcta; PostgreSQL 17 temporal confirmo bloqueo
  concurrente (`201`/`400`), FK aplicada y dos consultas para listar 13 ordenes.
  Se retiro el contenedor, sin escrituras en Supabase durante esa validacion.
- El 2026-11-04 se rechazo la discrepancia de oficina entre orden y activo en
  entradas y salidas mediante la validacion compartida del router. Evidencia:
  HTTP `400` en ambos sentidos Valencia/Miami, sin cambiar stock ni insertar
  ordenes; movimientos coincidentes aceptados. Solo bases temporales usadas.
- El 2026-11-04 se sembraron en Supabase seis activos, cuatro entradas y tres
  salidas del briefing mediante `seed_inventory.py`, con permiso del usuario.
  Stocks verificados: NXV-IT-001=12, NXV-IT-002=6, NXV-PER-001=0,
  NXV-PER-002=0, NXV-OFF-001=16 y NXV-TRN-001=0. Oficinas y auditoria TinyDB
  verificadas; GET de productos y siete ordenes correctos. Segunda semilla
  rechazada sin alterar registros. El script no borra ni sobrescribe datos.
- El 2026-11-04 se completo la guia de inventario en el README del servicio:
  configuracion TinyDB/Supabase, arranque, schemas, rutas, errores y semillas.
  Se verificaron formato y enlaces locales, sin arrancar servidores ni repetir
  semillas por este cambio documental. No cambio el comportamiento de la API.
- El backoffice documenta candidatos conectados a una API externa. No se ha
  verificado aqui el funcionamiento en ejecucion de las aplicaciones.
- Los README del backoffice documentan operaciones de proveedores y
  autenticacion, gestion de usuarios/perfiles y health check; el README UI
  documenta candidaturas y comprobaciones seguras para su API compartida.
  Fuentes: [API](../backoffice/services/README.md#operaciones-disponibles)
  y [frontend](../backoffice/uis/README.md#operaciones-de-candidaturas).
- El usuario reporto el 2026-11-02 que pasaron `npx tsc --noEmit`,
  `npm run lint`, `npm test -- --runInBand`, `npm run build` en
  `backoffice/uis/` y `uv run pytest` desde la raiz. Estos resultados son
  reportados por el usuario y no se volvieron a ejecutar en esta actualizacion
  documental.
- Los resultados historicos de [TESTING.md](../TESTING.md) no equivalen a
  pruebas ejecutadas en esta sesion. Consultar evidencia vigente en cada entrega.

## Decisiones en vigor

| Decision | Motivo y fuente |
| --- | --- |
| Negocio y tecnica se leen antes de modificar | Evitar reiniciar sin contexto; solicitud del tech lead y AGENTS.md raiz |
| Apps en `public-website/` y `backoffice/` | Mapa de la plantilla y requisito explicito del tech lead |
| Configuracion en `.agents/`, no en `agents/` o `skills/` | Separar herramientas de desarrollo de modulos de producto |
| Reglas seleccionadas por rutas desde AGENTS.md | No depender del descubrimiento automatico de un editor |
| Entrega con evidencia antes de commit y permiso explicito | Proteger calidad, cambios ajenos y datos sensibles |
| Preservar instrucciones locales de Next.js | Respetar las convenciones de cada aplicacion |

## Pendientes

- Confirmar propietario de Ventas: el briefing menciona dos nombres.
- Los sistemas IA y dashboards del briefing son objetivos; su alcance y
  aceptacion deben definirse por tarea, no declararse completados por defecto.
- No se han implementado hooks ni CI para imponer el flujo: AGENTS.md y
  la skill son instrucciones de operacion, no controles tecnicos de bloqueo.

## Como mantener este archivo

Al terminar una tarea registra fecha, cambio completado, decisiones con motivo,
validaciones realmente ejecutadas y pendientes. Sustituye estado obsoleto;
no acumules un diario de conversaciones. Actualiza tambien negocio o tecnica
si cambian sus hechos y conserva la referencia a la fuente correspondiente.