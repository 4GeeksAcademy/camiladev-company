# Auditoría de serialización del backend

**Fecha:** 2026-11-21  
**Alcance:** aplicación FastAPI activa en `services/main.py`, sus routers `services/routes/` y `services/routers/`. Se excluyen `services/legacy-api/` y `services-1/`, que son código archivado/no montado por esta aplicación. Los métodos listados son los endpoints de negocio y el health/root; las respuestas de error de FastAPI quedan fuera de los response models de éxito.

## Criterios

- **Ya serializado:** `response_model` explícito y payload apropiado para el consumidor.
- **Parcialmente serializado:** existe esquema o proyección, pero falta declarar el contrato de FastAPI o el payload incluye campos sin necesidad.
- **Sin serializar:** no existe `response_model` explícito; la ruta devuelve un dict, lista o registro sin contrato HTTP tipado.

La clasificación inicial describe el código antes de esta auditoría; la clasificación final refleja el estado tras los cambios.

## Resumen

| Estado inicial | Cantidad | Estado final |
|---|---:|---|
| Sin serializar | 19 | Todos tienen `response_model` explícito |
| Parcialmente serializado | 1 | Se optimizó el payload y se actualizó el cliente |
| Ya serializado | 5 | Se mantuvo su contrato |

Ningún endpoint de éxito devuelve ahora una entidad ORM/SQLModel ni un documento TinyDB sin validación por un esquema de salida.

## Inventario exhaustivo de endpoints

### Raíz

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `GET /` | Comprobación básica de que la API responde | Dict `{"message": ...}` sin `response_model` | Sin serializar | `HomeRead`: solo `message` |

### Autenticación (`/auth`)

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `POST /auth/login` | Validar credenciales y emitir token | Dict con access token y tipo, sin respuesta tipada | Sin serializar | `LoginResponse`: `access_token`, `token_type`; no devuelve email, usuario ni hash |
| `GET /auth/me` | Identidad y perfil del llamante autenticado | Dict con identidad y perfil; proyección manual parcial, sin esquema | Sin serializar | `AuthUserRead`: `id`, `email`, `role` y perfil plano nullable (`name`, `phone`, `address`). Se conserva el email requerido por la pantalla de perfil. Se excluyen hash, estado interno y `profile.user_id` (FK interna) |
| `POST /auth/forgot-password` | Solicitar enlace de recuperación | Mensaje genérico en dict, sin esquema | Sin serializar | `MessageRead`: solo `message` genérico; no confirma si el email existe ni devuelve el email o token |
| `POST /auth/reset-password` | Consumir token de un solo uso y cambiar contraseña | Mensaje en dict, sin esquema | Sin serializar | `MessageRead`: solo `message`; no devuelve token ni credenciales |
| `POST /auth/change-password` | Cambiar contraseña del llamante | Mensaje en dict, sin esquema | Sin serializar | `MessageRead`: solo `message`; no devuelve credenciales |

Los tres modelos de request de auth (`ForgotPasswordRequest`, `ResetPasswordRequest`, `ChangePasswordRequest`) rechazan campos extra con `extra="forbid"`; las credenciales se aceptan solo cuando corresponden a esa operación. El login conserva `OAuth2PasswordRequestForm` por compatibilidad OAuth2.

### Usuarios (`/users`)

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `POST /users` | Registrar usuario y crear su perfil | Respuesta compuesta con `public_user` y documento de perfil crudo; sin `response_model` | Sin serializar | `UserRegistrationRead`: usuario público (`id`, `email`, `is_active`, `role`, `created_at`) y perfil (`name`, `phone`, `address`). No expone `hashed_password` ni `profile.user_id`; mantiene el status HTTP existente |
| `GET /users` | Listar usuarios | Lista de proyecciones manuales sin esquema HTTP | Sin serializar | `list[PublicUserRead]`, solo campos del usuario público; sin perfil y sin contraseña |
| `GET /users/{user_id}` | Obtener usuario propio o de admin | Dict de proyección manual sin esquema HTTP | Sin serializar | `PublicUserRead`; sin hash ni atributos internos |
| `PUT /users/{user_id}` | Actualizar usuario | Entrada parcialmente restringida y respuesta manual sin esquema HTTP | Sin serializar | Entrada `UserUpdate` con `extra="forbid"`; respuesta `PublicUserRead`. El campo `password` entrante se transforma a hash antes de persistir; nunca se devuelve |
| `DELETE /users/{user_id}` | Eliminar usuario y perfil | Dict de confirmación sin esquema HTTP | Sin serializar | `MessageRead`: solo `message` |

`UserCreate` y `UserUpdate` son schemas de entrada separados de `PublicUserRead`. La respuesta de registro conserva email/rol/estado porque son parte del recurso de cuenta, pero no devuelve la contraseña ni su hash.

### Perfiles (`/profiles`)

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `GET /profiles/me` | Obtener los campos editables del perfil propio | Documento de TinyDB completo (`id`, `user_id`, datos de perfil), sin `response_model` | Sin serializar | `ProfileRead`: `name`, `phone`, `address`. Se excluyen ID de documento y FK `user_id`, que no consume la pantalla |
| `PUT /profiles/me` | Actualizar los campos editables | Entrada acotada en código pero aceptaba extras; devolvía documento TinyDB completo | Sin serializar | Entrada `ProfileUpdate` con `extra="forbid"`; respuesta `ProfileRead` con `name`, `phone`, `address` |

El update sigue permitiendo los campos editables `name`, `phone` y `address`; el identificador de usuario se determina exclusivamente desde la sesión autenticada, no desde el body.

### Proveedores (`/suppliers`)

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `POST /suppliers` | Crear proveedor | Body validado y dict construido manualmente, sin `response_model` | Sin serializar | Entrada `SupplierCreate` (`extra="forbid"`); salida `SupplierRead`; mantiene el status HTTP existente |
| `GET /suppliers` | Listar/filtrar por país y categoría | Serializador manual `SupplierRead` por documento, sin contrato de ruta | Sin serializar | `list[SupplierRead]` |
| `GET /suppliers/by-category` | Alias legado de filtro por categoría | Mismo serializador manual, sin contrato de ruta | Sin serializar | `list[SupplierRead]` |
| `PATCH /suppliers/{supplier_id}/status` | Cambiar estado | Serializador manual, sin contrato de ruta | Sin serializar | Entrada `SupplierStatusPatch`; salida `SupplierRead` |
| `PATCH /suppliers/{supplier_id}/rate` | Cambiar tarifa | Serializador manual, sin contrato de ruta | Sin serializar | Entrada `SupplierRatePatch`; salida `SupplierRead` |
| `DELETE /suppliers/{supplier_id}` | Eliminar proveedor | Dict de confirmación sin esquema | Sin serializar | `MessageRead` |

`SupplierRead` expone la proyección que consume `SupplierTable`: `id`, `name`, `country`, `categories`, `monthly_rate`, `currency`, `updated_at`, `status`, `contract_renewal_date`, `contact_email`, `notes`. La lista actualmente muestra todos esos campos, por lo que no se eliminaron datos funcionales. `updated_at` es solo de salida: ya no se acepta desde `SupplierCreate`; el servidor lo genera al crear/actualizar. La importación `Suppliers` queda como alias de compatibilidad para `services/seed.py`, no se usa como contrato de entrada HTTP.

### Inventario (`/inventory`)

| Método y ruta | Propósito | Antes | Estado inicial | Estado final / contrato |
|---|---|---|---|---|
| `GET /inventory/products` | Listar productos con stock calculado y filtro opcional de oficina | `response_model=list[AssetRead]` | Ya serializado | Sin cambios: `id`, `name`, `sku`, `category`, `office`, `current_stock` |
| `POST /inventory/products` | Crear producto | `response_model=AssetRead`; entrada `AssetCreate` | Ya serializado | Sin cambios. Entrada separada; salida incluye stock inicial calculado |
| `GET /inventory/products/{id}` | Obtener producto y stock | `response_model=AssetRead` | Ya serializado | Sin cambios |
| `POST /inventory/orders/inbound` | Crear orden de entrada | `response_model=AssetEntryRead`; entrada `AssetEntryCreate` | Ya serializado | Sin cambios. Salida de confirmación incluye `id`, `quantity`, `supplier`, `office`, `created_at`, `user_uuid`; no devuelve un objeto relacionado completo |
| `POST /inventory/orders/outbound` | Crear orden de salida | `response_model=AssetExitRead`; entrada `AssetExitCreate` | Ya serializado | Sin cambios. Salida de confirmación incluye `id`, `quantity`, `exit_type`, `assigned_to`, `office`, `created_at`, `user_uuid` |
| `GET /inventory/orders` | Listar órdenes de entrada/salida | Tenía `response_model`, pero herencia de modelos incluía FK `asset_id` y objeto anidado completo `asset` | Parcialmente serializado | `list[AssetEntryOrder | AssetExitOrder]`; proyección de tabla: `id`, `quantity`, `created_at`, `asset_name`, `asset_sku`, `order_type`. Elimina el objeto de activo redundante, FK `asset_id` y `user_uuid` (UUID interno sin utilidad para una lista de usuario). La columna UUID se retiró de la UI y el cliente lee el payload plano |

Las entradas de inventario permanecen separadas: `AssetCreate`, `AssetEntryCreate` y `AssetExitCreate` no reutilizan los modelos de respuesta y rechazan campos extra. Las respuestas `POST` conservan `user_uuid` por trazabilidad y `asset_id` para confirmar la orden creada, pero la lista de órdenes no publica esos identificadores internos.

## Esquemas añadidos o ajustados

- `services/schemas.py`: `HomeRead`, `MessageRead`, `ProfileRead`, contratos de órdenes de salida y proyección plana `AssetOrderRead`.
- `services/routes/auth.py`: `LoginResponse`, `AuthUserRead`; tipado de mensajes y rechazo de campos extra para requests de contraseña.
- `services/routes/users.py`: `PublicUserRead`, `UserRegistrationRead`; `UserCreate` y `UserUpdate` rechazan campos extra.
- `services/routes/profiles.py`: `ProfileRead` y entrada estricta `ProfileUpdate`.
- `services/models.py` y `services/routes/suppliers.py`: entrada `SupplierCreate` separada de `SupplierRead`, `updated_at` controlado por servidor.
- `services/main.py`: esquema para root.
- `services/routers/inventory.py`: proyección plana de órdenes; `uis/backoffice/src/lib/inventory.ts` y `uis/backoffice/src/app/inventory/orders/page.tsx` actualizados al contrato nuevo.

## Verificación

- `uv` instalado con `pipx`; entorno preparado según README con `uv sync --python 3.12` y dependencias de prueba `uv sync --python 3.12 --extra dev`.
- Suite activa de `services`: **61 passed**, cobertura de `routes/auth.py` **100%** (umbral configurado: 70%).
- El chequeo de errores del editor no reportó errores en archivos Python ni en los dos consumidores TypeScript ajustados.

