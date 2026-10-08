# Pruebas de autenticacion

## Plan backend (pytest)

Invocar directamente las funciones de negocio, sin TestClient ni serializacion
HTTP. Usar TinyDB en memoria, un secreto JWT exclusivo para tests y correo simulado.

| Endpoint / funcion | Camino feliz | Caso limite | Modo de fallo |
| --- | --- | --- | --- |
| POST /users (registro) | Usuario y perfil creados, hash verificable y sin exponerlo | Perfil opcional, email duplicado, password de 72 bytes | Password superior a 72 bytes; no crear datos |
| POST /auth/login | Credenciales validas generan JWT del usuario | Email/password vacios; password UTF-8 demasiado largo | Usuario inexistente, password incorrecto, secreto ausente |
| GET /auth/me | Identidad y perfil del usuario autenticado, sin hash | Usuario sin perfil | Error al consultar perfil; JWT invalido impide autenticar |
| POST /auth/forgot-password | Guardar hash del token, caducidad y enviar enlace | Email desconocido no revela existencia; sustituir tokens anteriores | Fallo de correo elimina token y no revela existencia |
| POST /auth/reset-password | Actualizar hash y consumir token una sola vez | Token vacio, reutilizado, caducado o fecha corrupta | Token inexistente, usuario eliminado, password demasiado largo |
| POST /auth/change-password | Actualizar hash e invalidar enlaces previos | Password de 72 bytes; ausencia de enlaces previos | Password actual incorrecto o nuevo demasiado largo; no mutar datos |
| JWT / get_current_user | Token firmado recupera usuario | Subject ausente, vacio o no textual | Token malformado, expirado, firma incorrecta, usuario eliminado, secreto ausente |
| Hash / verificacion | Hash con salt y verificacion correcta | Limite bcrypt medido en bytes UTF-8 | Hash corrupto, password incorrecto, error del proveedor |

Entradas de riesgo: campos vacios, duplicados, Unicode (72 bytes no son 72
caracteres), JWT sin subject, fechas sin zona horaria, tokens ya usados y fallos
de almacenamiento/correo. Las restricciones no implementadas no se presuponen:
si una prueba identifica un defecto de negocio, se registra abajo.

## Plan frontend (Jest)

Probar decisiones de los helpers TypeScript con dobles de red y navegador;
no probar Next.js, transporte, formato HTTP ni handlers que solo reenvian.

| Endpoint / helper | Camino feliz | Caso limite | Modo de fallo |
| --- | --- | --- | --- |
| login | Guardar y devolver token | Token ausente/vacio | Credenciales rechazadas o red caida; no guardar token |
| register | Completar registro | Email duplicado / errores de campos | Servicio rechaza registro |
| getCurrentUser (/me) | Devolver identidad | Sin token; 401 estando ya en login | 401 limpia sesion y redirige; 403 no limpia sesion |
| requestPasswordReset | Completar solicitud | Email desconocido produce el mismo resultado | Red o servicio fallan |
| resetPassword | Completar cambio | Token vacio/expirado rechazado | Servicio falla |
| changePassword | Completar cambio autenticado | Sesion expirada | Password actual incorrecto |
| updateMyProfile | Devolver perfil actualizado | Perfil nulo | Sesion invalida o datos rechazados |
| logout | Limpiar token y redirigir | Ejecucion sin window | Fallo de almacenamiento no informa exito |
| getToken / hasToken | Leer token y detectar sesion | Ausente, vacio, espacios, SSR | Almacenamiento falla |
| setToken / clearToken | Mutar storage y notificar | SSR; eliminar token inexistente | Almacenamiento falla sin notificar |
| fetchApi / readResponseText | Devolver resultado | Respuesta vacia | Ocultar detalles internos de errores de red/lectura |
| publicHttpErrorMessage / ApiError | Mensajes y datos publicos | Estado desconocido, campos por defecto | No exponer detalles internos del backend |
| getAuthApiBaseUrl / forwardAuthorizationHeader | Configuracion y credencial existente | Fallback y ausencia de Authorization | No inventar credenciales ni usar la URL de proveedores |

Entradas de riesgo: respuesta sin token, cuerpo ilegible/no JSON, validaciones
malformadas, mensajes internos sensibles, storage inaccesible y window ausente.

## Ejecucion

Backend desde la raiz: `uv run pytest` y `uv run pytest --cov`.
Frontend desde `uis/`: `npm exec -- jest --coverage` (o `npm test -- --coverage`).
La cobertura backend debe ser al menos 70% en `routes.auth`; la configuracion
de pytest aplica este umbral, tambien cuando se ejecuta `--cov` sin argumento.
El workspace uv de la raiz instala las dependencias de la API; no la empaqueta.
No se necesitan servicios activos ni secretos reales; las fixtures no abren la
base de datos real. Jest usa Node y dobles de navegador, no React ni Next.js.

## Defectos y resultados

- Bloqueo preexistente corregido: el import incompleto de `tests/conftest.py`
    impedia recoger tests. Ahora se usan fixtures con TinyDB en memoria.
- Configuracion Jest completada para TypeScript con ts-jest ya instalado.
- Defecto de negocio confirmado por
    `test_empty_credentials_are_currently_accepted`: `/users` permite email y
    password vacios. El test caracteriza el comportamiento actual; no lo considera
    una politica segura. La validacion del registro queda pendiente, sin introducir
    cambios de negocio en esta bateria de pruebas.
- Backend: 61 pruebas, 100% de lineas en `routes.auth` (umbral obligatorio: 70%).
- Frontend: 94 pruebas; 98.81% de lineas y 94.21% de ramas en los archivos
    seleccionados. Auth API, storage y validacion Next de login: 100% de lineas.
- Los proxies que solo reenvian se excluyen como transporte; se comprueba la
    decision de validacion del login y la ocultacion de errores compartida.
