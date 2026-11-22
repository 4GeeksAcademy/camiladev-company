# Informe técnico: optimización frontend y caché backend

## Alcance y criterio

Este informe documenta las optimizaciones de frontend ya realizadas y la caché aplicada a dos lecturas de la API FastAPI principal (`services/main.py`). La selección prioriza respuestas reutilizables con consultas o transformación repetidas, y evita cachear respuestas personales, credenciales, tokens u órdenes de alta rotación.

No hay telemetría de producción de latencia, tasa de solicitudes, volumen de filas ni frecuencia de cambios. Las frecuencias y costes indicados son estimaciones cualitativas derivadas de los consumidores del repositorio y de la implementación; no son medidas ni estadísticas observadas.

## Decisiones en el frontend

### Lazy loading

| Aplicación / componente | Implementación | Justificación y coste de diferir |
| --- | --- | --- |
| `uis/website/src/components/vacancy-application-form.tsx` en `/vacantes` | `next/dynamic` en `lazy-vacancy-application-form.tsx`; el formulario solo se monta al abrir `#apply-modal`. | Formulario largo con validaciones/opciones internacionales, dentro de un modal que un usuario puede no abrir. Se difieren su descarga y evaluación; al abrir se muestra estado de carga accesible y se añade esa espera localizada. |
| `uis/backoffice/componentes/candidate-form.tsx` desde `CandidateDetail` | `next/dynamic`; se solicita cuando `editing` es `true`. | La vista habitual es de lectura; el formulario y su lógica solo hacen falta tras activar edición. La primera entrada en edición puede esperar el chunk. |

Los imports dinámicos usan rutas estáticas para que Next genere chunks. No se fuerza SSR para estos formularios de cliente.

### Memoización con `useMemo`

Se memoizó el filtrado de candidaturas en `uis/backoffice/componentes/candidate-list.tsx`. El filtrado y la construcción/normalización del texto de búsqueda son O(n); ya no se repiten en renders que no cambian el listado ni sus criterios. Las dependencias son `[candidates, query, validStage, validStatus]`, por lo que los datos o filtros nuevos recalculan el resultado. No se memoizaron transformaciones triviales.

## Decisiones en el backend

### Inventario de endpoints expuestos

El conteo considera los 25 métodos/rutas registrados por los routers montados en `services/main.py` (incluida `/`).

Frecuencia esperada significa frecuencia relativa probable según el uso visible en el backoffice, no frecuencia medida. “Coste” estima trabajo de acceso/serialización a partir del código; no supone latencias medidas.

| Método y endpoint | Lectura/escritura y datos | Coste cualitativo | Frecuencia probable / cambios esperados | Decisión |
| --- | --- | --- | --- | --- |
| `GET /` | Estado estático | Muy bajo | Ocasional; casi nunca cambia | No cachear: no hay trabajo significativo. |
| `POST /users` | Crea usuario y perfil | Escritura | Poco frecuente; cambia con cada alta | No cachear. |
| `GET /users` | Lista de usuarios; requiere sesión | TinyDB lee toda la tabla y se proyecta a campos públicos | Baja/media; cambios con altas, ediciones y bajas | No cachear: datos personales, respuesta protegida y lista cambiante. |
| `GET /users/{user_id}` | Usuario público individual; autenticado y propietario/admin | TinyDB por id | Baja; cambia con la cuenta | No cachear: datos personales/permisos. |
| `PUT /users/{user_id}` | Actualiza email, estado, rol o contraseña | Escritura y validaciones | Baja; mutación | No cachear. |
| `DELETE /users/{user_id}` | Elimina usuario y perfil | Escritura | Baja; mutación | No cachear. |
| `GET /profiles/me` | Perfil personal autenticado | TinyDB por usuario | Ocasional; cambia con el perfil | No cachear: dato personal y específico de sesión. |
| `PUT /profiles/me` | Actualiza perfil personal | Escritura | Ocasional; mutación | No cachear. |
| `POST /auth/login` | Valida contraseña con bcrypt y emite JWT | Búsqueda más hash intencionalmente costoso | Recurrente pero no puede compartirse; cambios de credenciales | No cachear: secretos/tokens y validación de seguridad. |
| `GET /auth/me` | Usuario y perfil de la sesión | TinyDB por usuario y perfil | Frecuente en navegación/proxy; datos pueden cambiar | No cachear: depende del token y contiene datos personales. |
| `POST /auth/forgot-password` | Emite token y envía correo | Búsqueda, escrituras y proveedor de correo | Baja; operación con efectos secundarios | No cachear. |
| `POST /auth/reset-password` | Consume token de un solo uso y cambia contraseña | Búsqueda/escritura | Muy baja; mutación de seguridad | No cachear. |
| `POST /auth/change-password` | Comprueba y cambia contraseña | bcrypt y escrituras | Muy baja; mutación de seguridad | No cachear. |
| `POST /suppliers` | Añade proveedor TinyDB | Escritura | Baja; cambia el directorio | No cachear; invalida el listado. |
| `GET /suppliers` | Lista o filtra proveedores por país/categoría; TinyDB `.all()`, filtrado y serialización | Medio y creciente con el tamaño de la tabla | Probablemente frecuente: la página carga al entrar y al cambiar filtros; cambios por CRUD | Cacheado 60 s por combinación normalizada de filtros; invalidación en escrituras. |
| `GET /suppliers/by-category` | Alias de compatibilidad para filtro de categoría | Medio; mismo trabajo que el anterior | Igual que listado filtrado | Comparte clave/valor con `/suppliers?category=...`. |
| `PATCH /suppliers/{supplier_id}/status` | Cambia estado | Escritura | Baja/media; mutación | No cachear; invalida variantes del listado. |
| `PATCH /suppliers/{supplier_id}/rate` | Cambia tarifa | Escritura | Baja/media; mutación | No cachear; invalida variantes del listado. |
| `DELETE /suppliers/{supplier_id}` | Elimina proveedor | Escritura | Baja; mutación | No cachear; invalida variantes del listado. |
| `GET /inventory/products` | Lista activos con stock calculado mediante dos agregaciones SQL de entradas/salidas | Medio/alto relativo: agregaciones globales, joins, serialización | Recurrente: la página carga al entrar, filtrar oficina y al actualizar manualmente; stock cambia con operaciones | Cacheado 5 s por oficina (incluida vista sin filtro); invalida en alta de activo y órdenes entrantes/salientes. |
| `POST /inventory/products` | Crea activo | Escritura SQL | Baja; mutación | No cachear; invalida lista de stock. |
| `GET /inventory/products/{id}` | Stock calculado de un activo | Medio: mismas agregaciones con filtro por activo | Probablemente baja; cambia con órdenes | No cachear: caché inicial limitada a dos rutas. |
| `POST /inventory/orders/inbound` | Registra entrada, incrementa stock | Escritura SQL con bloqueo de fila | Baja/media; cada orden cambia stock | No cachear; invalida lista de stock tras commit. |
| `POST /inventory/orders/outbound` | Valida disponibilidad y registra salida | Consultas de stock más escritura SQL con bloqueo | Baja/media; cada orden cambia stock | No cachear; invalida lista de stock tras commit. |
| `GET /inventory/orders` | Une órdenes entrantes/salientes con activos y stock; ordena resultados | Medio/alto, respuesta crece con historial | Menos frecuente que stock; el historial crece y las órdenes son recientes | No cachear: alta rotación, payload creciente y frescura operacional. |

### Política y mecanismos implementados

- `services/cache.py` contiene caché TTL local al proceso y thread-safe, con copias profundas al almacenar/devolver para evitar que se mute la entrada retenida. Los errores del loader no se almacenan. Expiración con reloj monotónico.
- La clave de proveedores normaliza país/categoría y es compartida por el alias `/by-category`. TTL de 60 segundos: el directorio es relativamente estable frente al stock y existe invalidación inmediata después de alta, cambio de estado/tarifa o borrado.
- La clave de inventario distingue oficina e incluye la lista sin filtro. TTL de 5 segundos: el stock puede variar con órdenes y se prioriza frescura operacional. Crear activos y confirmar entradas/salidas invalida el namespace.
- La invalidación usa generaciones por namespace para impedir que una carga iniciada antes de una escritura repueble con datos viejos después de la invalidación.
- El TTL limita antigüedad si hay cambios que la aplicación no observa; las escrituras conocidas invalidan antes. Sigue existiendo un intervalo pequeño entre commit y ejecución de invalidación.

### Alcance y coherencia de despliegue

La caché es por proceso: no añade Redis ni dependencia adicional. Dockerfiles arrancan Uvicorn sin `--workers` y Compose declara una réplica del API, así que la topología declarada tiene un proceso con una caché. Escalar a workers/instancias elimina esa garantía: cada proceso tendría su copia e invalidación, y una lectura podría ver hasta el TTL de antigüedad. Para ese despliegue se debe migrar a invalidación compartida (p. ej. Redis) o aceptar/documentar la ventana.

TinyDB persiste en archivo. Las mutaciones del backend invalidan localmente; una edición externa del archivo/proceso no notifica esta caché. `clear_cache()` en TinyDB ocurre al producirse un miss, pero no reemplaza invalidación de la caché TTL. El TTL de 60 s limita esa antigüedad.

## Intercambios reconocidos

- La reutilización evita repetir `.all()` + filtrado/serialización del directorio y agregaciones SQL de stock; el ahorro real depende de concurrencia, tamaño y patrón de uso no medidos.
- Los TTL permiten lecturas repetidas más rápidas a costa de posible antigüedad (hasta 60 s proveedores, 5 s inventario en cambios no notificados). La invalidación conocida suele reducirla a la ventana entre commit e invalidación.
- Cada combinación de clave mantiene valor propio y consume memoria si se crean muchas combinaciones; los filtros actuales tienen cardinalidad acotada. No hay límite LRU; conviene reevaluar si aumenta esa cardinalidad.
- Dos misses simultáneos de la misma clave pueden duplicar trabajo de origen porque el lock no se mantiene durante I/O. Se prioriza no bloquear otras lecturas; no se implementa single-flight sin evidencia de concurrencia que lo justifique.
- El cache de productos tiene TTL de cinco segundos aunque la UI permite refrescar manualmente; las escrituras propias invalidan inmediatamente después del commit.

## Qué no se cacheó y por qué

- Auth, `/auth/me`, perfiles y usuarios: dependen de identidad/permisos o contienen información personal/credenciales; no deben compartirse globalmente.
- Login y operaciones de restablecimiento/cambio de contraseña: validan bcrypt, consumen tokens, envían correo o mutan estado; cachearlas sería incorrecto e inseguro.
- Escrituras de proveedores e inventario: no son lecturas reutilizables. Invalidan los listados afectados.
- `GET /inventory/orders`: historial creciente, datos operacionales y alta rotación; no se cachea por frescura y porque el coste de invalidación podría reducir el beneficio sin métricas.
- `GET /inventory/products/{id}`: lógica SQL costosa similar, pero se limita el primer alcance a dos rutas para evitar ampliar invalidaciones sin evidencia de uso.
- `/` y consultas por id triviales: coste cualitativo bajo; complejidad adicional sin beneficio establecido.

## Evidencia y validación

- No se midieron latencias, consultas/segundo, CPU, tamaño de tablas, memoria ni hit ratio. No se presentan porcentajes ni mejoras de tiempo como resultados observados.
- La frecuencia se estima por los consumidores backoffice del repositorio: proveedores carga al entrar/cambiar filtros; inventario carga al abrir, cambiar oficina y actualizar; órdenes tienen página separada. Es un proxy del uso visible, no telemetría de usuarios.
- `services/tests/test_cache.py` cubre expiración TTL, copia defensiva, invalidación por namespace y que errores no se almacenen; `test_suppliers_cache.py` verifica reutilización, invalidación tras alta y equivalencia del alias por categoría.
- Validación backend: `python -m pytest -q -o addopts=''` desde `services/` pasó (66 tests). La opción desactiva el umbral global de cobertura de `routes.auth`, no aplicable a esta validación de caché; un intento inicial de tests focalizados sin desactivarlo reportó 34% de cobertura auth y falló el umbral 70%, aunque los fallos de invocación directa de tests se corrigieron. `python -m compileall` y `git diff --check` también pasaron.
- Para cuantificar impacto, tomar baseline/comparación con datos representativos y carga idéntica: latencia p50/p95 y consultas SQL para `/inventory/products`, tiempo de lectura TinyDB para `/suppliers`, hit/miss/invalidaciones y edad de respuestas. Confirmar comportamiento con escrituras concurrentes antes de escalar procesos.

## Validación frontend conservada

En el cambio frontend, `npm test` pasó (8/8), `npm run typecheck` y `git diff --check` pasaron. Tras iniciar Next.js, `npm run check:routes` respondió HTTP 200 para `/`, `/formulario` y `/vacantes`. Next.js y `eslint-config-next` quedaron en 16.4.6; builds de ambas aplicaciones pasaron y auditorías de producción reportaron cero vulnerabilidades en ese momento. Esa evidencia corresponde al trabajo frontend anterior, no mide ni valida el rendimiento de caché backend.
