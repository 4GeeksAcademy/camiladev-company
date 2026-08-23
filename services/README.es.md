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

### Cómo ejecutarlo

1. Activar entorno virtual desde la raíz del repositorio:

```bash
source myenv/bin/activate
```

2. Levantar la API:

```bash
cd services/api
uvicorn main:app --reload
```

3. Sembrar datos de ejemplo:

```bash
cd services/api
python seed.py
```

4. Probar endpoints:

```bash
curl "http://127.0.0.1:8000/suppliers"
curl "http://127.0.0.1:8000/suppliers?country=Spain"
curl "http://127.0.0.1:8000/suppliers?country=USA"
curl "http://127.0.0.1:8000/suppliers?category=job_boards"
curl "http://127.0.0.1:8000/suppliers?country=USA&category=job_boards"
curl "http://127.0.0.1:8000/suppliers/by-category?category=job_boards"
curl -X DELETE "http://127.0.0.1:8000/suppliers/3"
```

### Nota de compatibilidad

- `GET /suppliers?category=...` es la ruta recomendada para filtrar por categoría.
- `GET /suppliers/by-category?category=...` se mantiene como alias compatible para integraciones existentes.
