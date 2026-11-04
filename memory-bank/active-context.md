# Estado activo y decisiones

Ultima actualizacion: 2026-11-02.

## Estado conocido

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