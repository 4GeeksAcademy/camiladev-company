# API del backoffice

API FastAPI para usuarios, perfiles, autenticacion, proveedores e inventario.
TinyDB conserva la persistencia existente; SQLModel conecta con PostgreSQL en
Supabase para activos y movimientos. Resend envia enlaces de recuperacion de
contrasena. Las entidades de inventario siguen [BRIEFING.md](../../BRIEFING.md).

## 1. Instalar uv

Necesitas `uv` y Python 3.12 o superior. Si no tienes `uv`, sigue las
[instrucciones oficiales](https://docs.astral.sh/uv/getting-started/installation/).

Comprueba que esta disponible:

```sh
uv --version
```

## 2. Entrar al directorio de la API

Desde la raiz del repositorio:

```sh
cd backoffice/services
```

Si estas en `backoffice/`, usa `cd services`. Ejecuta los siguientes comandos
desde este directorio, no desde el backend antiguo `services-1/api/`.

## 3. Crear el entorno virtual e instalar las dependencias

```sh
uv sync --python 3.12
```

`uv sync` crea el entorno `.venv/` del workspace e instala las dependencias
declaradas en [pyproject.toml](pyproject.toml). En este monorepo, el entorno
compartido puede estar en la raiz, no dentro del servicio. Si Python 3.12 no esta disponible, `uv` puede
descargarlo automaticamente. La primera instalacion necesita acceso a internet.

El stack de autenticacion incluye `tinydb`, `bcrypt`, `python-jose[cryptography]`,
`python-dotenv` y `resend`. `email-validator` se instala mediante
`pydantic[email]`; el hash de contrasenas se utiliza a traves de Passlib.
El inventario usa `sqlmodel` y `psycopg2-binary`, incluidos en las dependencias;
no necesitas instalarlos por separado despues de `uv sync`.

No necesitas activar manualmente el entorno: `uv run` ejecuta los comandos
dentro de `.venv/`. No uses el Python global para arrancar esta API.

## 4. Configurar las variables de entorno

Crea un archivo `.env` en este directorio con las siguientes variables.
Sustituye los valores de ejemplo antes de iniciar la API:

```dotenv
JWT_SECRET=reemplazar_por_un_secreto_aleatorio
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
RESEND_API_KEY=reemplazar_por_la_clave_de_resend
RESEND_FROM_EMAIL=Acceso <no-reply@tu-dominio-verificado.com>
DATABASE_URL="postgresql+psycopg2://postgres.PROJECT_REF:DB_PASSWORD@POOLER_HOST:6543/postgres?sslmode=require"
```

La URI anterior es un ejemplo, no una conexion valida. Para inventario necesitas
`DATABASE_URL` y `JWT_SECRET`; Resend y `FRONTEND_URL` son necesarios para los
flujos de recuperacion por correo, no para registrar movimientos.

Puedes generar un secreto para `JWT_SECRET` localmente:

```sh
uv run python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### Mantener `JWT_SECRET` entre Codespaces

`JWT_SECRET` firma los tokens de acceso. Debe permanecer igual en todos los
Codespaces que usan esta API; si cambia, los tokens emitidos con el valor
anterior dejaran de ser validos. No generes uno nuevo cada vez que crees un
Codespace.

Para compartirlo de forma segura entre Codespaces:

1. Genera el valor una sola vez con el comando anterior y guardalo en un
   gestor de contrasenas. No lo compartas por chat ni lo agregues al repositorio.
2. En GitHub, abre el repositorio y ve a **Settings → Secrets and variables →
   Codespaces**. Selecciona **New repository secret**, usa `JWT_SECRET` como
   nombre y pega el valor generado como secreto.
3. Los Codespaces nuevos recibiran el secreto al crearse. Reinicia los
   Codespaces que ya estaban abiertos para que reciban un secreto nuevo o
   actualizado.

La aplicacion carga `.env` y luego lee `JWT_SECRET` del entorno. En Codespaces,
la variable inyectada como secreto tiene prioridad sobre el valor local de
`.env`. Para desarrollo fuera de Codespaces, configura el valor localmente en
`.env`, que esta excluido de Git.

- No compartas ni subas `.env` a Git. Guarda las claves solo en la configuracion
  local o en el gestor de secretos del despliegue.
- `FRONTEND_URL` debe ser la URL accesible del backoffice, sin incluir
  `/reset-password`. El correo dirige al usuario a esa pagina con un token.
- `RESEND_FROM_EMAIL` debe usar un dominio verificado en Resend para enviar a
  usuarios reales. `onboarding@resend.dev` es un remitente de prueba restringido
  al correo asociado a la cuenta de Resend.
- `database.py` carga explicitamente el `.env` de este directorio; otras partes
  de la API tambien utilizan `load_dotenv()`. Ejecutar desde este directorio
  mantiene la configuracion local consistente. Las variables ya exportadas
  en el proceso tienen prioridad sobre `.env`.

### Preparar las bases de datos

| Base | Datos | Como se pone en marcha |
|---|---|---|
| TinyDB | Usuarios, perfiles, tokens de recuperacion y proveedores | `database.py` abre `data/db.json` dentro del servicio y crea el archivo si falta. No requiere servidor, Docker ni comando de arranque propio. |
| Supabase PostgreSQL | `asset`, `assetentry` y `assetexit` | Crea o utiliza un proyecto de desarrollo activo en Supabase y configura `DATABASE_URL`. PostgreSQL se ejecuta en Supabase, no en el Codespace. |

Para configurar Supabase:

1. Abre [el panel de Supabase](https://supabase.com/dashboard). Si no tienes
   proyecto, crea uno y guarda su contrasena de base de datos en un gestor de
   contrasenas. Espera a que el proyecto este disponible.
2. Selecciona **Connect → Direct → Transaction pooler** y **Type: URI**.
   Copia la cadena de tu proyecto, incluido el host y el puerto proporcionados.
3. Sustituye `[YOUR-PASSWORD]` por la contrasena de la base de datos, sin los
   corchetes; no uses una API key ni la contrasena de tu cuenta de Supabase.
   Codifica para URI los caracteres especiales de la contrasena.
4. Guarda la cadena completa en `DATABASE_URL` dentro del `.env` local. El
   motor selecciona `psycopg2` explicitamente tanto para `postgresql://` como
   para `postgresql+psycopg2://`. Usa SSL, por ejemplo `sslmode=require` en la
   query de la URI, conservando los parametros que ya tenga.
5. Para persistir la configuracion entre Codespaces, guarda `DATABASE_URL`
   como secreto **Codespaces** del repositorio, igual que `JWT_SECRET`.
   Reinicia Codespaces existentes para recibir el secreto. Nunca publiques
   la URI ni la copies en codigo, capturas o commits.

No se usa Supabase Auth ni se replica una tabla de usuarios. `user_uuid` de cada
orden es una cadena con el ID del usuario de TinyDB, sin FK entre bases.
No borres ni sustituyas `data/db.json`: contiene las cuentas locales y no se
recupera automaticamente desde Supabase. Crear otro Codespace no replica ese
archivo; los secretos solo conservan configuracion, no los registros de TinyDB.

## 5. Iniciar la API

```sh
uv run uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Este comando levanta una sola API con ambas conexiones. Al arrancar, el
lifespan de [main.py](main.py) ejecuta `SQLModel.metadata.create_all(engine)`
para crear las tablas de inventario que falten y sus FK en Supabase. La
conexion debe tener permiso para crear el esquema; si falta `DATABASE_URL`
o Supabase no esta disponible, el servicio no puede arrancar correctamente.
No hay un segundo backend ni un PostgreSQL local que debas iniciar.

`create_all` no migra tablas existentes ni siembra registros. Una modificacion
posterior del modelo que requiera cambiar una tabla necesita una migracion
planificada, no borrar la tabla y volver a arrancar. [database.py](database.py)
mantiene el motor compartido, mientras `get_db()` crea y cierra una sesion
SQLModel por peticion; no hay sesiones globales.

`--reload` reinicia el servidor cuando modificas codigo y es solo para
desarrollo. Para permitir conexiones externas en un contenedor o Codespace,
puedes cambiar el host a `0.0.0.0` y configurar el reenvio del puerto. No
expongas la API publicamente sin la configuracion de seguridad del despliegue.

### Iniciar desde GitHub Codespaces con uv ya instalado

Si ya instalaste `uv` en este Codespace, no necesitas reinstalarlo ni activar
manualmente el entorno virtual. Abre una terminal de VS Code y ejecuta:

```sh
cd /workspaces/camiladev-company/backoffice/services
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

`uv run` utiliza el entorno `.venv/` del proyecto y sincroniza las dependencias
si hace falta. Deja esta terminal abierta mientras utilizas la API.

Para acceder desde el navegador:

1. Abre la pestana **Puertos** de VS Code.
2. Si el puerto **8000** no aparece automaticamente, selecciona **Reenviar un
   puerto** e introduce `8000`.
3. Manten la visibilidad del puerto como **Privado**.
4. Abre la direccion reenviada y anade `/docs` para acceder a Swagger.
   La URL tendra una forma similar a
   `https://<nombre-del-codespace>-8000.app.github.dev/docs`.
5. Para detener la API, pulsa `Ctrl+C` en la terminal donde la iniciaste.

Para login y recuperacion, configura primero las variables del paso 4.
En Codespaces, `FRONTEND_URL` debe ser la URL HTTPS reenviada del **frontend
del backoffice**, no la del puerto 8000 ni `http://localhost:3000`. Copiala
desde la pestana **Puertos**, usando el puerto donde arrancaste ese frontend.
Por ejemplo, si usa el puerto 3000:

```dotenv
FRONTEND_URL=https://<nombre-del-codespace>-3000.app.github.dev
```

Sustituye el nombre de ejemplo por la direccion real, sin `/reset-password`.
Con un puerto privado, el navegador debe tener acceso autenticado al Codespace
para abrir el enlace del correo. Reinicia la API despues de modificar `.env`.

No ejecutes el backend antiguo en el mismo puerto. El frontend del backoffice
usa `http://127.0.0.1:8000` por defecto; si cambias el puerto, configura
`AUTH_API_BASE_URL` y `SUPPLIERS_API_BASE_URL` en el entorno del frontend y
reinicialo.

## 6. Comprobar que responde

Con el servidor activo, abre otra terminal:

```sh
curl --fail http://127.0.0.1:8000/
```

La respuesta esperada es:

```json
{"message":"API funcionando"}
```

Tambien puedes abrir:

- Swagger: <http://127.0.0.1:8000/docs>
- Esquema OpenAPI: <http://127.0.0.1:8000/openapi.json>

Deten el servidor con `Ctrl+C` en la terminal donde lo iniciaste.

## Operaciones disponibles

### Inventario

Gestiona equipos y materiales de Nexova en Valencia y Miami: compras o
entregas recibidas (`AssetEntry`), asignaciones a empleados y consumos
(`AssetExit`). Los endpoints conservan el nombre `/products`, pero la entidad
de negocio se llama `Asset`.

Las lecturas son publicas; las escrituras requieren Bearer JWT de un usuario
activo de TinyDB. Los datos de inventario se guardan en Supabase y el UUID del
creador de cada orden se toma de la sesion autenticada, no del request.

| Metodo y ruta | Operacion |
|---|---|
| `GET /inventory/products` | Listar activos con `current_stock`. Admite `office=Valencia` o `office=Miami`. |
| `POST /inventory/products` | Crear un `Asset` con stock inicial calculado de cero. SKU duplicado devuelve `409`. |
| `GET /inventory/products/{id}` | Consultar un activo con su stock; devuelve `404` si no existe. |
| `POST /inventory/orders/inbound` | Registrar un `AssetEntry` con cantidad positiva. |
| `POST /inventory/orders/outbound` | Registrar un `AssetExit`; exige `assigned_to` en asignaciones y nulo en consumos. |
| `GET /inventory/orders` | Listar entradas y salidas con `order_type`, `user_uuid` y `asset` anidado. Admite filtro `office`. |

`current_stock` es la suma de entradas menos salidas; no se acepta en requests
ni se guarda como columna. Una salida superior al stock devuelve `400` antes
de insertar. Ambas clases de orden bloquean el activo durante su transaccion
para serializar movimientos concurrentes. Las listas usan agregaciones y joins,
sin consultas adicionales por cada orden.

Las respuestas son schemas Pydantic, no objetos ORM. Los campos extra, las
cantidades invalidas y las asignaciones incompletas devuelven `422`; un activo
inexistente en una orden devuelve `404`. La oficina de cada orden debe coincidir
con la del activo; en caso contrario devuelve `400` sin registrar el movimiento.
Las escrituras deben probarse solo
con datos de desarrollo autorizados. El arranque no siembra activos; consulta
la seccion de semillas de inventario para preparar la base de desarrollo.

#### Entidades y archivos

| Entidad | Campos de request | Campos adicionales de respuesta |
|---|---|---|
| `Asset` | `name`, `sku`, `category`, `office` | `id`, `current_stock` |
| `AssetEntry` | `asset_id`, `quantity`, `supplier`, `office` | `id`, `created_at`, `user_uuid` |
| `AssetExit` | `asset_id`, `quantity`, `exit_type`, `assigned_to`, `office` | `id`, `created_at`, `user_uuid` |

Categorias permitidas: `hardware`, `peripherals`, `office_supplies` y
`training_materials`. Oficinas: `Valencia` y `Miami`. Los nombres y SKU no
pueden estar vacios y `sku` es unico. `quantity` debe ser un entero positivo.
`created_at` se genera automaticamente en UTC; el cliente no puede enviar
ID de orden, fecha, `user_uuid` ni stock. `asset_id` debe referenciar un activo
existente; ambas tablas de ordenes tienen FK hacia `asset.id`.

Los modelos de tabla estan en [models.py](models.py), los requests y responses
Pydantic en [schemas.py](schemas.py), y las rutas en
[routers/inventory.py](routers/inventory.py). Los endpoints convierten sus
resultados a schemas Pydantic; no devuelven objetos ORM directamente.

#### Flujo de uso

Con la API activa, abre <http://127.0.0.1:8000/docs> o la URL privada reenviada
en Codespaces:

1. Si aun no existe una cuenta de desarrollo, registrala con `POST /users`.
2. Inicia sesion con `POST /auth/login`: `username` contiene tu email y
   `password` tu contrasena, en formato `application/x-www-form-urlencoded`.
   En Swagger puedes usar **Authorize** con ese flujo. Para otros clientes,
   envia `Authorization: Bearer <access_token>` en cada escritura. No publiques
   tokens ni captures la respuesta del login.
3. Crea un activo con `POST /inventory/products`; empieza con stock cero:

   ```json
   {"name":"Equipo de demostracion","sku":"DEMO-IT-001","category":"hardware","office":"Valencia"}
   ```

4. Usa el `id` devuelto como `asset_id` en `POST /inventory/orders/inbound`.
   El siguiente ejemplo supone que el activo creado tiene ID `1`; sustituyelo
   por el ID real:

   ```json
   {"asset_id":1,"quantity":5,"supplier":"Proveedor Demo","office":"Valencia"}
   ```

5. Registra una salida con `POST /inventory/orders/outbound`:

   ```json
   {"asset_id":1,"quantity":2,"exit_type":"allocation","assigned_to":"Empleado Demo","office":"Valencia"}
   ```

   Para consumo, usa `"exit_type":"consumption"` y `"assigned_to":null`.
   Tras estos movimientos, el stock de ese activo sera `5 - 2 = 3`.
6. Consulta el stock y el historial con los GET siguientes. Las ordenes
   incluyen `order_type` (`inbound` o `outbound`), datos del activo en `asset`
   y el UUID de su creador; el stock anidado es el actual, no una instantanea
   del momento de la orden.

```sh
curl --fail http://127.0.0.1:8000/inventory/products
curl --fail 'http://127.0.0.1:8000/inventory/products?office=Valencia'
curl --fail http://127.0.0.1:8000/inventory/orders
curl --fail 'http://127.0.0.1:8000/inventory/orders?office=Miami'
```

Los POST anteriores escriben en la base configurada: no los ejecutes antes de
la semilla si quieres usarla en tablas vacias, ni sobre una base de produccion.
No hay rutas para editar stock ni modificar o borrar ordenes.

#### Errores de inventario

| Estado | Causa |
|---|---|
| `401` | Escritura sin token o con token invalido o expirado. |
| `403` | Usuario inactivo o ID del usuario sin formato UUID valido. |
| `404` | El activo consultado o referenciado por la orden no existe. |
| `409` | SKU ya registrado. |
| `422` | Campos extra, cantidad invalida, categoria/oficina invalida o asignacion inconsistente. |
| `400` | Oficina de la orden distinta de la del activo, o salida superior al stock. |

En sobregiro el mensaje es:

```text
Insufficient stock for asset '{name}'. Available: {available}, requested: {quantity}.
```

Ante un fallo de conexion, comprueba que el proyecto Supabase este activo, la
URI y contrasena sean correctas y que la red permita llegar al pooler. Revisa
los logs sin publicar credenciales. `GET /` solo confirma que FastAPI responde;
un GET de inventario exitoso tambien comprueba el acceso a las tablas Supabase.

### Proveedores

La API del backoffice expone las siguientes rutas bajo `/suppliers`:

| Metodo y ruta | Operacion |
|---|---|
| `GET /suppliers` | Listar proveedores. Admite filtros opcionales `country` y `category`, que se pueden combinar. |
| `GET /suppliers/by-category?category=...` | Alias compatible para filtrar por categoria; para nuevas integraciones, usa `GET /suppliers?category=...`. |
| `POST /suppliers` | Crear un proveedor con el modelo `Suppliers`. |
| `PATCH /suppliers/{supplier_id}/status` | Cambiar el estado (`active` o `suspended`). |
| `PATCH /suppliers/{supplier_id}/rate` | Cambiar la tarifa mensual; debe ser mayor que cero. |
| `DELETE /suppliers/{supplier_id}` | Eliminar un proveedor por su ID numerico de TinyDB. |

Paises permitidos para el filtro: `Spain` y `USA`. Categorias: `job_boards`,
`ats_software`, `assessment_tools`, `training_platforms`,
`payroll_and_hr_software`, `video_interview`, `background_check`,
`office_and_facilities` e `it_and_software_licenses`. `GET /suppliers`
devuelve todos los proveedores si no se indican filtros.

Ejemplos de lectura seguros:

```sh
curl --fail http://127.0.0.1:8000/suppliers
curl --fail 'http://127.0.0.1:8000/suppliers?country=Spain'
curl --fail 'http://127.0.0.1:8000/suppliers?category=job_boards'
curl --fail 'http://127.0.0.1:8000/suppliers?country=USA&category=job_boards'
curl --fail 'http://127.0.0.1:8000/suppliers/by-category?category=job_boards'
```

Consulta `/docs` para ver los campos requeridos de creacion y los esquemas de
las solicitudes. `POST`, `PATCH` y `DELETE` escriben en la base activa.
`DELETE` elimina el documento de la base; respalda los datos antes y limita las
pruebas de escritura a proveedores de prueba autorizados.

### Salud de la API

| Metodo y ruta | Uso |
|---|---|
| `GET /` | Comprobar que la API responde; devuelve `{"message":"API funcionando"}`. No requiere sesion. |

### Autenticacion

| Metodo y ruta | Uso y acceso |
|---|---|
| `POST /auth/login` | Iniciar sesion con `application/x-www-form-urlencoded`; el campo `username` contiene el email. No requiere sesion. |
| `GET /auth/me` | Consultar la cuenta autenticada; requiere sesion Bearer. |
| `POST /auth/forgot-password` | Solicitar un enlace por email; la respuesta es uniforme y no confirma la entrega. No requiere sesion. |
| `POST /auth/reset-password` | Cambiar la contrasena con `token` y `new_password`; el enlace caduca a los 30 minutos y solo sirve una vez. No requiere sesion. |
| `POST /auth/change-password` | Cambiar la contrasena con `current_password` y `new_password`; requiere sesion Bearer. |

Un login invalido devuelve `401`. Un token de restablecimiento invalido,
caducado o ya utilizado devuelve `400`. Las contrasenas nuevas de mas de
72 bytes UTF-8 tambien se rechazan con `400`.

### Usuarios

Las rutas siguientes usan el prefijo `/users`. Salvo `POST /users`, requieren
sesion Bearer:

| Metodo y ruta | Uso y permisos |
|---|---|
| `POST /users` | Registrar una cuenta y su perfil; email valido y unico. No requiere sesion. |
| `GET /users` | Listar los datos publicos de todos los usuarios autenticados. |
| `GET /users/{user_id}` | Consultar los datos publicos del usuario propio o de cualquier usuario si quien consulta es admin. |
| `PUT /users/{user_id}` | Actualizar email, contrasena o estado de la cuenta propia; un admin tambien puede cambiar el rol. |
| `DELETE /users/{user_id}` | Eliminar la cuenta propia o cualquier cuenta si quien la elimina es admin. Es una operacion destructiva. |

La respuesta publica del usuario no incluye el hash de contrasena. Un email
duplicado al registrar o actualizar devuelve `400`; un usuario inexistente
devuelve `404`; intentar consultar, editar o eliminar la cuenta de otra
persona sin rol admin devuelve `403`. El endpoint de lista requiere
autenticacion, pero no filtra por rol admin.

### Perfil propio

Ambas rutas requieren sesion Bearer y operan sobre el perfil de la cuenta
autenticada; no aceptan un `user_id` en la URL:

| Metodo y ruta | Uso |
|---|---|
| `GET /profiles/me` | Consultar el propio perfil. |
| `PUT /profiles/me` | Actualizar los campos enviados de nombre, telefono o direccion; los campos omitidos no se modifican. |

Si la cuenta no tiene perfil, ambas operaciones devuelven `404`.

El frontend ofrece `/register`, `/login`, `/forgot-password` y
`/account/change-password`. El formulario enlazado desde el correo abre
`/reset-password?token=...`. Usa cuentas autorizadas y no compartas tokens,
contrasenas ni cabeceras de autenticacion. La recuperacion por correo y el
cambio de contrasena autenticado son flujos distintos.

## Sembrar inventario de desarrollo

`seed_inventory.py` inserta los seis activos, cuatro entradas y tres salidas
del briefing en Supabase. Requiere las tablas inicializadas por el arranque
de la API y un usuario activo existente en TinyDB; todas las ordenes llevan
su UUID. No modifica usuarios ni proveedores.

Para una instalacion nueva: configura ambas bases, arranca la API hasta que
complete el startup y crea una cuenta con `POST /users` si no tienes ninguna.
Puedes obtener tu UUID mediante `GET /auth/me` con sesion autenticada. Antes
de crear activos o movimientos manuales, ejecuta la semilla en otra terminal.
Usa [seed_inventory.py](seed_inventory.py), no `seed.py`: este ultimo es la
semilla destructiva de proveedores, no la de inventario.

Desde `backoffice/services/`, solo sobre una base de desarrollo autorizada:

```sh
uv run python seed_inventory.py
```

Si hay exactamente un usuario activo, se usa como creador. Si hay varios,
selecciona uno explicitamente:

```sh
uv run python seed_inventory.py --user-uuid UUID_DEL_USUARIO_ACTIVO
```

La semilla exige las tres tablas de inventario vacias. Bloquea esas tablas y
confirma todos los registros en una sola transaccion, comprobando el stock
antes del commit. Si hay datos existentes, se niega a ejecutarse sin borrar
ni sobrescribir nada. No elimines registros para repetirla sobre una base real.

| SKU | Entradas | Salidas | Stock calculado |
|---|---:|---:|---:|
| NXV-IT-001 | 15 | 3 | 12 |
| NXV-IT-002 | 8 | 2 | 6 |
| NXV-PER-001 | 0 | 0 | 0 |
| NXV-PER-002 | 0 | 0 | 0 |
| NXV-OFF-001 | 20 | 4 | 16 |
| NXV-TRN-001 | 0 | 0 | 0 |

Las asignaciones usan empleados ficticios y el consumo tiene `assigned_to`
nulo. `GET /inventory/products` y `GET /inventory/orders` permiten comprobar
los resultados sin nuevas escrituras.

## Sembrar proveedores para comprobar la aplicacion

**ADVERTENCIA: este comando sobrescribe los datos de proveedores de la base
de datos.** El script borra toda la tabla `suppliers` e inserta 15 proveedores
de ejemplo. No conserva los proveedores creados o editados anteriormente.
No borra las tablas de usuarios, perfiles ni tokens de recuperacion.

Usalo solo para preparar datos de prueba, no sobre datos reales que quieras
conservar. No es necesario ejecutarlo cada vez que inicias la aplicacion.

1. Deten la API con `Ctrl+C` para evitar escrituras simultaneas en TinyDB.
2. Desde el directorio del backend, respalda la base existente antes de
   sembrar. El siguiente comando crea una copia y se niega a sobrescribir
   un respaldo que ya tenga ese nombre:

   ```sh
   cd /workspaces/camiladev-company/backoffice/services
   cp --no-clobber data/db.json data/db.before-seed.json
   ```

   Comprueba que el respaldo corresponde a la base actual. Si ya existe
   uno anterior, utiliza otro nombre. Si aun no existe `data/db.json`, no hay
   una base que respaldar; el script la creara. Los respaldos pueden contener
   datos sensibles: no los compartas ni los subas a Git.
3. Ejecuta el script de semillas:

   ```sh
   uv run python seed.py
   ```

   La salida esperada es `Inserted 15 suppliers`. El script valida los
   ejemplos con Pydantic antes de reemplazar la tabla.
4. Reinicia la API:

   ```sh
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Desde otra terminal, comprueba los proveedores y un filtro:

   ```sh
   curl --fail http://127.0.0.1:8000/suppliers
   curl --fail 'http://127.0.0.1:8000/suppliers?country=Spain&category=job_boards'
   ```

6. Con el frontend activo y conectado a esta API, inicia sesion y abre
   `/suppliers`. Recarga la pagina para ver los ejemplos y comprobar el
   listado y los filtros. Los cambios que hagas desde la aplicacion se
   guardaran en la base; otra ejecucion de la semilla los reemplazara.

Ejecuta siempre el script de este backend, no el de `services/api/`.
No copies una base antigua completa sobre la base unificada.

## Persistencia y recuperacion de contrasena

La API utiliza `data/db.json`, relativo a este directorio, para las tablas
`users`, `profiles`, `password_reset_tokens` y `suppliers`. No comparte
automaticamente los datos con `services-1/api/data/db.json`. No borres ni
sobrescribas la base existente al iniciar el servidor.

Ante un fallo de envio, el log de recuperacion incluye una categoria segura:

- `missing_api_key`: falta `RESEND_API_KEY`.
- `credentials_rejected`: Resend rechazo las credenciales.
- `connection_failed`: fallo del cliente HTTP al contactar con Resend.
- `provider_unavailable`: Resend o un intermediario no esta disponible.
- `provider_rejected`: otro rechazo del proveedor, como validacion o limites.

La respuesta de `/auth/forgot-password` sigue siendo generica para no revelar
si una cuenta existe. Un `200` no garantiza que el correo se haya enviado;
consulta los logs de la API y el estado del envio en Resend.

### Recuperar y restablecer la contrasena desde Codespaces

1. Inicia el frontend del backoffice y comprueba que puedes abrirlo desde la
   pestana **Puertos** de VS Code.
2. En la fila del puerto del frontend, selecciona **Copiar direccion**. Debe
   ser una URL HTTPS terminada en `.app.github.dev`, no `localhost`. Si se
   copia una direccion local, usa **Abrir en navegador** y copia la URL HTTPS
   de la barra de direcciones.
3. Configura `FRONTEND_URL` en `.env` con esa direccion base, sin `/login`,
   `/reset-password` ni parametros. Por ejemplo:

   ```dotenv
   FRONTEND_URL=https://<nombre-del-codespace>-3000.app.github.dev
   ```

   Usa el puerto real del frontend, no el 8000 de la API. `localhost` en el
   enlace del correo apunta al ordenador del destinatario, no al Codespace.
4. Comprueba que has configurado un `JWT_SECRET` aleatorio y estable,
   `RESEND_API_KEY` y `RESEND_FROM_EMAIL`. Si aun no tienes un dominio
   verificado, puedes probar con:

   ```dotenv
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ```

   En ese caso, solicita la recuperacion para una cuenta del backoffice cuyo
   email sea el asociado a la cuenta de Resend de esa clave. Para enviar a
   otros usuarios necesitas un dominio verificado.
5. Reinicia la API despues de modificar `.env`: detenla con `Ctrl+C` y
   ejecuta desde este directorio:

   ```sh
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. Abre `/forgot-password` en el frontend del backoffice, introduce el email
   de tu cuenta y selecciona **Enviar enlace**.
7. Abre el correo mas reciente y comprueba que el enlace apunta a la URL HTTPS
   del frontend. El cambio de configuracion no modifica correos anteriores.
   Una nueva solicitud invalida los enlaces previos.
8. Abre el enlace antes de 30 minutos, introduce la nueva contrasena y envia
   el formulario. El enlace solo puede utilizarse una vez.
9. Tras la confirmacion, abre `/login` e inicia sesion con tu email y la nueva
   contrasena.

Manten el frontend y la API activos durante todo el proceso. El puerto del
frontend puede permanecer **Privado** si abres el enlace en un navegador con
acceso autenticado al Codespace; no necesitas hacerlo publico para generar
una URL HTTPS correcta.

Si el correo no llega, revisa spam y los logs de la API y de Resend. Si el
enlace sigue apuntando a `localhost`, revisa `FRONTEND_URL`, reinicia la API
y solicita otro correo. Si ha caducado o ya se utilizo, solicita uno nuevo.

No compartas enlaces completos ni capturas que muestren el token. Si uno
queda expuesto, solicita otra recuperacion para invalidarlo.

### Validacion y compatibilidad de emails

El registro, la actualizacion y la recuperacion validan el formato del email
con `EmailStr` y `email-validator`. El registro y la actualizacion guardan el
email normalizado, sin espacios externos y en minusculas. El login utiliza la
misma normalizacion y mantiene el error generico de credenciales para un email
invalido. No se comprueba la existencia del buzon ni se realizan consultas DNS.

La busqueda tambien normaliza los emails antiguos en memoria: no modifica
`data/db.json` ni fusiona cuentas. Un email antiguo invalido no coincide y
genera una advertencia sin datos personales. Si varias cuentas comparten el
mismo email normalizado, la operacion devuelve un error generico y registra
el conflicto; un administrador debe revisar y corregir esos registros antes
de utilizarlos. El registro y la actualizacion impiden nuevos duplicados por
diferencias de mayusculas o espacios.

## Ejecutar las pruebas existentes

Instala las dependencias opcionales de desarrollo:

```sh
uv sync --python 3.12 --extra dev
```

Para comprobar solo la solicitud de recuperacion:

```sh
uv run --extra dev pytest tests/test_forgot_password.py --no-cov
```

`--no-cov` evita aplicar el umbral de cobertura global de autenticacion a una
ejecucion parcial. Para trabajar con las dependencias opcionales instaladas,
conserva `--extra dev` en los comandos `uv run` correspondientes.
