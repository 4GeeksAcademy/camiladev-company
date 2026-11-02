# API, autenticacion y datos

Alcance: `backoffice/services/**` y cambios de autenticacion, persistencia o
datos personales en cualquier modulo. Carga: mediante el AGENTS.md raiz.

- Trabaja desde `backoffice/services/` usando uv y Python 3.12+ segun su README.
  No arranques el backend anterior en el mismo puerto.
- Conserva contratos FastAPI/Pydantic y errores genericos de autenticacion.
  No reveles si existe una cuenta en login o recuperacion.
- Conserva normalizacion y validacion de emails del backend; no introduzcas una
  variante en otro endpoint. No fusiones cuentas antiguas silenciosamente.
- No registres passwords, JWT, tokens de recuperacion, credenciales de Resend
  ni datos personales. Un 200 de recuperacion no demuestra envio del correo.
- Los tokens de recuperacion deben caducar, ser de un solo uso e invalidar
  enlaces previos tras una nueva solicitud. Verifica la propiedad afectada
  mediante pruebas existentes cuando cambies ese flujo.
- `data/db.json` depende del directorio de trabajo. No borres, copies ni
  sobrescribas bases al iniciar. TinyDB no implica permisos para migraciones.
- `seed.py` reemplaza proveedores: exige autorizacion, API detenida y respaldo
  sin sobrescritura antes de ejecutarlo; los respaldos tampoco se versionan.
- Ejecuta pruebas con datos aislados, no con la base real ni enviando correos
  reales. Consulta los fixtures existentes antes de elegir la comprobacion.
- Usa `--no-cov` solo en pruebas parciales; no afirmes cumplir el gate global
  de cobertura basandote en ellas. Respeta los gates vigentes del modulo.