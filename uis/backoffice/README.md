# Frontend del backoffice

Aplicacion Next.js y React para acceder al backoffice. La autenticacion y la
gestion de datos se conectan con la API FastAPI de
[services](../../services/README.md).

## Docker Compose

Desde la raíz, `docker compose up` inicia website en `http://localhost:3000`,
backoffice en `http://localhost:3001` y FastAPI. Compose monta el código para
recarga en caliente y asigna `BACKEND_INTERNAL_URL` a `AUTH_API_BASE_URL` y
`SUPPLIERS_API_BASE_URL`, usando el DNS interno `http://api:8000`. El stack de
producción se inicia por separado con
`docker compose -f compose.prod.yaml up --build`.

## 1. Comprobar los requisitos

Necesitas Node.js 22 LTS y npm disponibles en el Codespace:

```sh
node --version
npm --version
```

## 2. Instalar las dependencias del frontend

Desde cualquier directorio del Codespace:

```sh
cd /workspaces/camiladev-company/uis/backoffice
npm install
```

Si ya instalaste las dependencias y no han cambiado, no necesitas reinstalarlas
cada vez que inicies el frontend.

## 3. Configurar la conexion con el backend

Crea `.env.local` en este directorio con:

```dotenv
AUTH_API_BASE_URL=http://127.0.0.1:8000
SUPPLIERS_API_BASE_URL=http://127.0.0.1:8000
```

- `AUTH_API_BASE_URL` apunta a la API de autenticacion.
- `SUPPLIERS_API_BASE_URL` apunta a la API de proveedores.
- Ambas usan la misma API unificada del backoffice.
- Usa solo la direccion base, sin `/auth`, `/suppliers` ni `/docs`.
- Si cambias el puerto del backend, actualiza ambas variables.
- Reinicia el frontend despues de modificar `.env.local`.

En el mismo Codespace, estas direcciones deben seguir siendo internas
(`127.0.0.1`): el servidor Next.js reenvia las solicitudes a FastAPI. El
navegador llama a las rutas `/api/...` del frontend, no directamente al
backend. No necesitas hacer publico el puerto 8000 para esta conexion.

No pongas `JWT_SECRET` ni `RESEND_API_KEY` en el frontend ni en variables
`NEXT_PUBLIC_*`. Esas claves pertenecen exclusivamente al backend. No subas
archivos de configuracion con secretos a Git.

## 4. Iniciar el backend en otra terminal

### Configurar la API externa de candidaturas

Anade tambien esta linea a `.env.local`, junto a las dos variables anteriores:

```dotenv
NEXT_PUBLIC_API_URL=https://playground.4geeks.com/tracker/api/v1
```

La ruta `/candidates` utiliza esta API compartida, no la API local de
autenticacion y proveedores. El prefijo `/v1` es obligatorio: omitirlo produce
un `404` al consultar `/records?page=1`. No anadas `/docs` ni `/records` a la
URL base. Consulta la [documentacion de Talent Tracker](https://playground.4geeks.com/tracker/api/v1/docs).

El navegador llama directamente a esa API; no coloques claves ni credenciales
en esta variable publica. Reinicia Next.js despues de cambiarla. Utiliza solo
candidaturas de prueba autorizadas: el servicio es compartido y la semilla
local de proveedores no lo modifica.

### Operaciones de candidaturas

Las acciones de `/candidates` llaman directamente a la API compartida de
Talent Tracker. Con `NEXT_PUBLIC_API_URL` configurada como se indica arriba,
la interfaz realiza estas operaciones:

| Accion en la interfaz | Peticion a la API externa |
|---|---|
| Abrir o actualizar el listado | `GET /records?page=...`; el cliente carga todas las paginas. |
| Buscar por nombre o email, filtrar por estado o etapa | Filtrado local de los registros cargados. |
| Abrir el detalle | `GET /records/:id`. |
| Crear una candidatura | `POST /records`. |
| Editar datos de una candidatura | `PUT /records/:id`. |
| Cambiar estado o etapa | `PATCH /records/:id`. |
| Ver notas internas | `GET /records/:id/notes`. |
| Anadir una nota | `POST /records/:id/notes`. |
| Confirmar la eliminacion de una nota | `DELETE /records/:id/notes/:note_id`. |

El cambio de estado y etapa se guarda al elegir una opcion, sin boton
adicional de guardar. La busqueda por nombre/email se hace en el navegador y
no se anade a la URL; los filtros de estado/etapa se conservan en la URL.
Los datos de contacto estan ocultos por defecto en el detalle, pero esto es
solo una proteccion visual y no sustituye los permisos del servicio.

### Comprobacion manual segura

La API es compartida y sus escrituras persisten. Antes de probar, confirma que
tienes autorizacion para usar el entorno y sus datos. No cambies candidaturas
reales, no elimines notas ajenas, no publiques capturas con datos personales
y no inspecciones ni compartas tokens o respuestas con datos de candidatos.

Para comprobar la interfaz sin tocar registros ajenos:

1. Abre `/candidates`, espera a que cargue el listado y compara el total con
   las filas. Si el servicio devuelve mas de una pagina, el cliente debe
   cargarlas todas. Usa **Actualizar listado** para repetir la lectura.
2. Prueba la busqueda por nombre y email y combina filtros de estado y etapa.
   Comprueba que **Limpiar** restablece los filtros. La ausencia de resultados
   debe mostrar **Sin coincidencias**, no un error de conexion.
3. Abre una candidatura autorizada para lectura. Confirma que email, telefono,
   LinkedIn y CV estan ocultos hasta activar **Mostrar datos de contacto**.
   Evita divulgar lo que revelan.
4. Si tienes autorizacion expresa para crear datos de prueba, crea una
   candidatura con nombre identificable como prueba y un email ficticio unico.
   Comprueba el detalle, la busqueda y la persistencia tras recargar. No repitas
   el registro si el detalle falla: vuelve al listado y comprueba si se creo.
5. Realiza ediciones y cambios de estado o etapa solamente en esa candidatura
   de prueba. Confirma que editar y cancelar se comportan por separado y que
   los cambios se conservan al recargar.
6. Para notas, anade una nota identificada como prueba en la candidatura de
   prueba. Verifica que aparece en el detalle y persiste. Para comprobar
   eliminacion, elimina solo una nota creada por ti; la accion es irreversible.
7. Para comprobar un ID inexistente, abre una ruta con un identificador
   sintactico pero ficticio, como `/candidates/id-inexistente-para-pruebas`.
   Debe mostrarse el error de no disponible y una opcion de reintento; reintentar
   no crea la candidatura.

Los estados disponibles son **Recibida**, **En proceso**, **Seleccionada** y
**Descartada**. Las etapas son **Pendiente de revision**, **En revision**,
**Entrevista personal**, **Entrevista tecnica** y **Oferta presentada**. Al
crear una candidatura, comprueba los valores que devuelve el servicio: no
presupongas un estado ni una etapa inicial.

El formulario de alta y edicion requiere nombre, email, telefono, puesto y
experiencia. Rechaza email invalido, experiencia negativa y enlaces de
LinkedIn/CV que no sean URL HTTP o HTTPS validas. LinkedIn y CV son opcionales;
nombre y puesto admiten hasta 200 caracteres, email 254 y telefono 40. Prueba
campos invalidos solo en una candidatura de prueba y confirma que no se muestra
un mensaje de exito ni se pierden los valores escritos ante un error.

La app no ofrece un boton para eliminar candidaturas. Coordina cualquier
limpieza de registros de prueba con la persona responsable de la API. Solo
puedes eliminar notas creadas por ti; la eliminacion confirmada es irreversible.

Si no tienes permiso para escribir en el servicio compartido, limita la
comprobacion a listado, filtros y lectura de detalles autorizados. Un listado
vacio, la paginacion en un conjunto grande o fallos de red intencionados
requieren un entorno de prueba adecuado; si no esta disponible, registra el
caso como **No probado** en vez de alterar datos compartidos para simularlo.

Para observar estados de carga, puedes usar **Slow 3G** en las herramientas de
red del navegador durante una prueba autorizada y volver a **Sin limitacion**
al terminar. Los botones de envio deben bloquearse mientras hay una operacion
en curso para evitar duplicados. Para probar recuperacion de red, utiliza solo
un entorno de prueba: tras una interrupcion no reenvies una escritura hasta
comprobar en el listado o detalle si la primera solicitud llego a guardarse.
Un resultado correcto en la interfaz no verifica por si solo permisos, filtros
del servidor ni codigos HTTP.

Configura primero sus variables siguiendo el
[README de la API](../services/README.md). Luego ejecuta:

```sh
cd /workspaces/camiladev-company/services
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Deja esa terminal abierta. No arranques tambien el backend antiguo
`services-1/api/` en el mismo puerto.

Comprueba la API desde otra terminal:

```sh
curl --fail http://127.0.0.1:8000/
```

La respuesta esperada es `{"message":"API funcionando"}`.

## 5. Iniciar el frontend

En la terminal del frontend:

```sh
cd /workspaces/camiladev-company/uis/backoffice
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Deja esta terminal abierta. El puerto 3000 es para el backoffice; no lo
confundas con el de la web publica.

Si esta ocupado, elige otro puerto, por ejemplo:

```sh
npm run dev -- --hostname 0.0.0.0 --port 3002
```

## 6. Abrir el frontend en Codespaces

1. Abre la pestana **Puertos** de VS Code.
2. Busca el puerto donde iniciaste el frontend, normalmente **3000**. Si no
   aparece, selecciona **Reenviar un puerto** e introduce ese numero.
3. Manten la visibilidad como **Privado**.
4. Selecciona **Abrir en navegador**.
5. Abre `/login` en esa URL para acceder al formulario de inicio de sesion.

La direccion debe ser parecida a:

```text
https://<nombre-del-codespace>-3000.app.github.dev
```

Para acceder a un puerto privado, utiliza un navegador con acceso autenticado
al Codespace. No necesitas hacerlo publico para probar el backoffice.

## 7. Vincular los enlaces de recuperacion con este frontend

La conexion frontend-backend y los enlaces del correo utilizan direcciones
distintas:

| Configuracion | Ubicacion | Direccion |
|---|---|---|
| `AUTH_API_BASE_URL` | `.env.local` del frontend | API interna: `http://127.0.0.1:8000` |
| `SUPPLIERS_API_BASE_URL` | `.env.local` del frontend | API interna: `http://127.0.0.1:8000` |
| `FRONTEND_URL` | `.env` del backend | URL HTTPS reenviada del frontend |

1. Copia la URL HTTPS del frontend desde **Puertos** o desde el navegador.
2. Configura `FRONTEND_URL` en el `.env` del backend con esa direccion base:

   ```dotenv
   FRONTEND_URL=https://<nombre-del-codespace>-3000.app.github.dev
   ```

3. Usa la direccion real y el puerto correcto, sin `/login`, `/reset-password`
   ni parametros.
4. Reinicia la API despues de modificar su `.env`.
5. Abre `/forgot-password` en el frontend y solicita un correo nuevo.
6. Abre el enlace mas reciente, restablece la contrasena y comprueba el login.

No uses `localhost` como `FRONTEND_URL` en Codespaces: el enlace del correo
apuntaria al ordenador del destinatario. Los correos anteriores no cambian
cuando actualizas la configuracion.

Consulta los requisitos de Resend y el procedimiento completo en
[Recuperar y restablecer la contrasena](../services/README.md#recuperar-y-restablecer-la-contrasena-desde-codespaces).

## Sembrar proveedores para probar el frontend

**ADVERTENCIA: sembrar sobrescribe todos los datos de la tabla de proveedores
en la base de datos del backend.** Borra los proveedores actuales y carga
15 ejemplos; no borra usuarios, perfiles ni tokens. No ejecutes este proceso
sobre datos reales que quieras conservar ni cada vez que inicias el frontend.

1. Deten la API con `Ctrl+C` y evita enviar cambios desde el frontend durante
   la siembra.
2. En una terminal, entra al backend y respalda la base existente:

   ```sh
   cd /workspaces/camiladev-company/services
   cp --no-clobber data/db.json data/db.before-seed.json
   ```

   Si el respaldo ya existe, usa otro nombre para obtener una copia de la
   base actual. Si la base aun no existe, omite la copia. No compartas ni
   subas el respaldo a Git: puede contener datos sensibles.
3. Desde ese mismo directorio, carga los ejemplos:

   ```sh
   uv run python seed.py
   ```

   Debe mostrar `Inserted 15 suppliers`.
4. Reinicia el backend:

   ```sh
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Manten el frontend activo, inicia sesion y abre `/suppliers` en su URL
   HTTPS de Codespaces. Recarga para comprobar los 15 proveedores y prueba
   los filtros de pais y categoria.

Las modificaciones realizadas desde el frontend persisten en la base.
Ejecutar otra vez `seed.py` reemplazara esos proveedores por los ejemplos
originales. La semilla no crea una cuenta: utiliza tu cuenta existente o
registra una desde `/register`.

Consulta el [procedimiento del backend](../services/README.md#sembrar-proveedores-para-comprobar-la-aplicacion)
para comprobar tambien los datos mediante la API.

## 8. Detener los servidores

Pulsa `Ctrl+C` en cada terminal: una para el frontend y otra para la API.

## Problemas habituales

- **El frontend no abre:** comprueba que Next.js sigue activo y que has
  reenviado el puerto correcto.
- **El servicio no esta disponible:** comprueba la API con `curl`, revisa
  ambas variables de `.env.local` y reinicia Next.js si las modificaste.
- **El login falla:** comprueba las credenciales y la configuracion de
  `JWT_SECRET` en el backend. Los usuarios deben existir en la TinyDB del
  backoffice, no solo en la base antigua.
- **El correo abre localhost:** corrige `FRONTEND_URL` en el backend,
  reinicia la API y solicita otro correo.
- **Codespaces pide acceso:** abre el enlace con tu sesion de GitHub
  autenticada; la privacidad del puerto no cambia la URL generada.

No compartas claves, contrasenas ni enlaces completos de recuperacion.

## Comprobaciones de desarrollo

Desde este directorio, con las dependencias instaladas:

```sh
npx tsc --noEmit
npm run lint
```

Para ejecutar una prueba concreta existente:

```sh
npm test -- --runInBand src/lib/__tests__/auth-api.test.ts
```
