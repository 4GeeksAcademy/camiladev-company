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

Si `services-1/api` ya está usando el puerto predeterminado `8000`, inicia esta API en el puerto `8001` para ejecutar ambas al mismo tiempo.

```bash
cd services/api
uvicorn main:app --reload --port 8001
```

3. Con myenv activo (myenv) instalar las dependencias si estamos en un nuevo Codespaces

```bash
pip install fastapi uvicorn tinydb pydantic
```

4. Ejecutar:

```bash
uvicorn main:app --reload
```

5. Sembrar datos de ejemplo desde services/api/

```bash
python seed.py
```

6. Probar endpoints:

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
