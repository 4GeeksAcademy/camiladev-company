# API

Esta API usa FastAPI, TinyDB y `uv`. Los comandos siguientes se ejecutan desde
`services-1/api/`.

## 1. Preparar el entorno

Instala `uv` si todavía no está disponible:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
```

Instala las dependencias y crea el entorno virtual:

```bash
cd services-1/api
uv sync
```

## 2. Configurar variables locales

Crea `services-1/api/.env` y añade las variables siguientes. Genera un valor
aleatorio para `JWT_SECRET` con `python -c "import secrets; print(secrets.token_urlsafe(48))"`.

```env
JWT_SECRET=pega_aqui_el_secreto_generado
ACCESS_TOKEN_EXPIRE_MINUTES=30
RESEND_API_KEY=re_pega_aqui_tu_clave
RESEND_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:3000
```

No publiques la API key ni el archivo `.env`; `.env` está ignorado por Git.
Si pruebas desde Codespaces, cambia `FRONTEND_URL` por la URL reenviada del
puerto 3000, con este formato:
`https://<nombre-del-codespace>-3000.<dominio-de-reenvio>`.
El frontend debe estar ejecutándose y el puerto 3000 debe estar accesible desde
el navegador donde abrirás el enlace.

El remitente `onboarding@resend.dev` puede enviar solo a destinatarios
permitidos/verificados por Resend. Para otros destinatarios, configura en
Resend un dominio verificado y usa una dirección de ese dominio en
`RESEND_FROM_EMAIL`.

## 3. Iniciar la API

Desde `services-1/api/`, ejecuta:

```bash
uv run uvicorn main:app --reload
```

Si `services/api` ya está usando el puerto `8000`, inicia esta API en el puerto `8001` para ejecutar ambas al mismo tiempo:

```bash
  uv run uvicorn main:app --reload --8001
  ```


Deja esa terminal abierta. La API queda disponible en `http://127.0.0.1:8000`;
la documentación interactiva está en `http://127.0.0.1:8000/docs`.

Para detenerla, pulsa `Ctrl+C`. Si editas `.env`, reinicia la API para que lea
los nuevos valores.

## 4. Crear una cuenta de prueba (opcional)

Si todavía no tienes una cuenta, crea una con un email al que puedas acceder.
Si ya existe, omite este paso.

```bash
curl -i -X POST http://127.0.0.1:8000/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"tu-email@example.com","password":"Prueba12345","name":"Usuario de prueba"}'
```

Una respuesta `200` indica que se creó la cuenta. Si la cuenta ya existe, la
API responde `400`; continúa con esa cuenta.

## 5. Probar el cambio de contraseña con sesión

Define en la terminal el email y la contraseña actual de la cuenta de prueba.
Usa contraseñas alfanuméricas para simplificar los ejemplos:

```bash
TEST_EMAIL='tu-email@example.com'
CURRENT_PASSWORD='Prueba12345'
NEW_PASSWORD='NuevaClave67890'
```

Inicia sesión para obtener el token de acceso. El endpoint de login usa
`application/x-www-form-urlencoded` y el campo `username` contiene el email:

```bash
ACCESS_TOKEN=$(curl -sS -X POST http://127.0.0.1:8000/auth/login \
  --data-urlencode "username=$TEST_EMAIL" \
  --data-urlencode "password=$CURRENT_PASSWORD" \
  | python -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')
```

Prueba primero que una contraseña actual incorrecta se rechaza (`400`):

```bash
curl -i -X POST http://127.0.0.1:8000/auth/change-password \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"current_password":"incorrecta","new_password":"NuevaClave67890"}'
```

Ahora cambia la contraseña correctamente; se espera `200`:

```bash
curl -i -X POST http://127.0.0.1:8000/auth/change-password \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d "{\"current_password\":\"$CURRENT_PASSWORD\",\"new_password\":\"$NEW_PASSWORD\"}"
```

Vuelve a iniciar sesión con `NEW_PASSWORD`; debe funcionar. Una solicitud a
`/auth/change-password` sin `Authorization: Bearer ...` debe responder `401`.

## 6. Probar el restablecimiento por email

Solicita un enlace para una cuenta existente. Si la solicitud es válida y no
falla la persistencia, la API responde `200` con el mismo mensaje para evitar
revelar si el email está registrado:

```bash
curl -i -X POST http://127.0.0.1:8000/auth/forgot-password \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$TEST_EMAIL\"}"
```

Abre el email y el enlace. En Codespaces, el enlace debe usar la URL reenviada
configurada en `FRONTEND_URL`, no `localhost`. En el formulario, introduce y
confirma la nueva contraseña. La página debe redirigir a `/login` al completar
el cambio.

También puedes probar el endpoint directamente: copia el valor de `token` de
la URL recibida y asígnalo a `RESET_TOKEN` en tu terminal. No compartas ni
publiques ese token.

```bash
RESET_TOKEN='pega_aqui_el_token_del_enlace'
RESET_PASSWORD='OtraClave24680'
curl -i -X POST http://127.0.0.1:8000/auth/reset-password \
  -H 'Content-Type: application/json' \
  -d "{\"token\":\"$RESET_TOKEN\",\"new_password\":\"$RESET_PASSWORD\"}"
```

El reset exitoso responde `200`. Vuelve a iniciar sesión con `RESET_PASSWORD`.
Si vuelves a enviar el mismo token, debe responder `400`: los tokens expiran
tras 30 minutos y solo se pueden utilizar una vez.

Si no llega el email, revisa la terminal de Uvicorn y **Emails/Logs** en Resend.
El mensaje `200` de `forgot-password` no confirma el envío. No imprimas ni
compartas la API key, contraseñas o el token de restablecimiento.

## Gestión de errores implementada

- [errors.py](errors.py) protege las operaciones de lectura y escritura de TinyDB mediante `SafeJSONStorage`. Los errores de disco, JSON corrupto y serialización se capturan en esa frontera, sin envolver rutas completas.
- [main.py](main.py) registra respuestas JSON `{"detail": ...}` para errores HTTP, validación y excepciones inesperadas. Los errores `422` omiten valores de entrada y contexto interno; los `500` usan mensajes genéricos sin tracebacks, rutas, claves ni detalles de excepciones.
- [routes/auth.py](routes/auth.py) limita la captura JWT a la decodificación o firma del token. Credenciales o tokens inválidos producen `401`; configuración JWT ausente o fallos internos producen `500`.
- Las operaciones bcrypt se capturan por separado. Contraseñas nuevas de más de 72 bytes UTF-8 producen `400`; hashes almacenados no válidos producen `500`. La longitud se comprueba antes de consumir el token de restablecimiento.
- [routes/users.py](routes/users.py) y [routes/profiles.py](routes/profiles.py) devuelven `404` al actualizar un usuario o perfil inexistente, en lugar de serializar un resultado nulo.
- [email_service.py](email_service.py) captura fallos únicamente alrededor del envío a Resend y los traduce a `EmailDeliveryError`, sin exponer la excepción del proveedor. Si falta la configuración de correo, también genera ese error seguro.
- Ante un fallo de entrega, `forgot-password` elimina el token recién creado y conserva la respuesta uniforme para evitar enumerar cuentas. Un `200` no garantiza el envío; una entrada inválida puede devolver `422` y un fallo de persistencia, `500`.
- [services.py](services.py) rechaza y elimina tokens con fechas corruptas o sin zona horaria. Los logs propios usan mensajes fijos, sin destinatarios, contraseñas, claves ni enlaces de recuperación.

### Verificaciones realizadas

Se probaron JWT inválido y configuración ausente, contraseñas demasiado largas, hashes corruptos, usuarios/perfiles inexistentes y fallos simulados de Resend. También se verificaron la limpieza de tokens y el rechazo de fechas sin zona horaria.

Las solicitudes ASGI comprobaron respuestas `401`, `422` y `500` en JSON, sin valores sensibles de prueba ni tracebacks. Las pruebas usaron mocks y TinyDB en memoria: no enviaron correos ni modificaron la base de datos real. Los diagnósticos del editor y `git diff --check` no detectaron errores.