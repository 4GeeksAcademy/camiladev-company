# Carpeta `services`

Esta carpeta contiene **todos los servicios backend** (APIs y workers en segundo plano) relacionados con la compañía para el proyecto transversal de AI Engineering.

Cada subcarpeta dentro de `services/` debe corresponder a **un servicio concreto** (por ejemplo `admin-api`, `data-processor-worker`) e incluir su propia documentación técnica y funcional.

- **Propósito principal**: centralizar toda la lógica backend, APIs y consumidores de colas que dan soporte a los casos de uso de la compañía.
- **Recomendación**: documenta en este archivo (o en sub-READMEs) los servicios que vayas añadiendo, su objetivo, tecnología usada y cómo ejecutarlos.

## Servicio actual: `api`

### Objetivo del servicio

Exponer una API REST para gestionar proveedores (`suppliers`) con validación de datos y persistencia local.

### Tecnología usada

- Python 3.12
- FastAPI
- Pydantic
- TinyDB

### Archivos Python en `services/api`

- `services/api/main.py`:
	Punto de entrada de la API. Crea la app de FastAPI e incluye las rutas de proveedores.
- `services/api/database.py`:
	Configura TinyDB y expone la tabla `suppliers_table` compartida por el servicio.
- `services/api/models.py`:
	Define el modelo Pydantic `Suppliers` y reglas de validación (country, status, currency, categories).
- `services/api/seed.py`:
	Carga datos semilla: valida con Pydantic, limpia la tabla e inserta registros iniciales.
- `services/api/routes/__init__.py`:
	Inicializador del paquete de rutas.
- `services/api/routes/suppliers.py`:
	Endpoints HTTP de proveedores (`POST /suppliers`, `GET /suppliers` con filtros por `country` y `category`, alias `GET /suppliers/by-category`, `PATCH` de `status`, `PATCH` de `rate` y `DELETE /suppliers/{id}`).

### Gestión de errores implementada

- [api/errors.py](api/errors.py) define `SafeJSONStorage`: captura errores de lectura, JSON corrupto y escritura en la operación de almacenamiento concreta, sin envolver handlers completos.
- [api/main.py](api/main.py) registra manejadores para errores HTTP, validación y excepciones inesperadas. Las respuestas conservan el formato JSON `{"detail": ...}`.
- Los errores `422` incluyen ubicación, tipo y un mensaje de validación seguro; omiten valores de entrada y contexto interno. Los errores `500` devuelven un mensaje genérico, sin excepciones crudas, rutas internas ni tracebacks.
- [api/routes/suppliers.py](api/routes/suppliers.py) responde `400` ante filtros no válidos sin reflejar la entrada recibida, `404` cuando el proveedor no existe y `500` si un registro almacenado no puede validarse al serializarlo.
- Los logs propios de error usan mensajes fijos, sin datos del proveedor ni detalles de excepciones. La salida del seeder conserva únicamente el recuento de registros insertados.

#### Verificaciones realizadas

Se comprobaron errores de lectura/escritura simulados, filtros inválidos, registros corruptos y proveedores inexistentes. Las solicitudes ASGI verificaron respuestas `200`, `404`, `422` y `500`, sin valores sensibles de prueba ni tracebacks en el cuerpo. Se usó almacenamiento en memoria, sin modificar la base de datos real; los diagnósticos del editor y `git diff --check` no detectaron errores.

### Cómo ejecutarlo

1. Crear el entorno virtual si es un nuevo Codespaces:
```bash
python -m venv myenv
```

2. Activar entorno virtual desde la raíz del repositorio:

```bash
source myenv/bin/activate
```

3. Entrar en el directorio del servicio:

```bash
cd services/api
```

4. Con myenv activo (myenv) instalar las dependencias si estamos en un nuevo Codespaces

```bash
pip install fastapi uvicorn tinydb pydantic
```

5. Ejecutar:

```bash
uvicorn main:app --reload
```

Si `services-1/api` ya está usando el puerto `8000`, inicia esta API en el puerto `8001` para ejecutar ambas al mismo tiempo:

```bash
uvicorn main:app --reload --port 8001
```

6. Sembrar datos de ejemplo desde services/api/

```bash
python seed.py
```

7. Probar endpoints:

```bash
/suppliers
/suppliers?country=Spain
/suppliers?country=USA
/suppliers?category=job_boards
/suppliers?country=USA&category=job_boards
/suppliers/by-category?category=job_boards

```

### Nota de compatibilidad

- `GET /suppliers?category=...` es la ruta recomendada para filtrar por categoría.
- `GET /suppliers/by-category?category=...` se mantiene como alias compatible para integraciones existentes.
