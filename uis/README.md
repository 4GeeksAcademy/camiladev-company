# Frontend UI (Next.js)

Este frontend está construido con Next.js, React, TypeScript y Tailwind CSS.

## Objetivo

Implementar el directorio de proveedores conectado al backend de services/api.

## Arranque rápido

1. Ir a la carpeta del frontend:

cd uis/

2. Instalar dependencias (si es la primera vez en el Codespace):

npm install

3. Levantar entorno de desarrollo:

npm run dev

4. Abrir en navegador:

http://localhost:3000

## Backend requerido

Para que el frontend funcione, la API debe estar levantada en paralelo:

1. Ir a la carpeta del servicio API:

cd services/api

2. Levantar la API:

python -m uvicorn main:app --reload

La API queda disponible en:

http://127.0.0.1:8000

## Funcionalidades implementadas del directorio de proveedores

1. Ruta principal del directorio:
	- /suppliers

2. Menú conectado al directorio:
	- Enlace a Proveedores desde index.html, pages/contact_form.html y pages/vacant.html

3. Listado completo de proveedores:
	- Muestra registros con datos provenientes de la API
	- Incluye visualización en formato clave: valor de los campos del proveedor

4. Actualización de tarifa:
	- Edición por fila en la tabla
	- Se ejecuta PATCH al endpoint existente de rate
	- Refleja el cambio inmediatamente en interfaz

5. Cambio de estado (active/suspended):
	- Selector y acción visible por fila
	- Se ejecuta PATCH al endpoint existente de status
	- Activos y suspendidos se diferencian visualmente con badges y color

6. Filtros funcionales por país y categoría:
	- Controles de país y categoría
	- Botón Filtrar
	- Actualización del listado sin recargar la página
	- Filtrado real en backend con query params

7. Registro de proveedor:
	- Formulario para crear proveedor
	- Usa los campos del modelo backend
	- Envía POST a suppliers
	- Muestra mensaje de error de API cuando backend rechaza entrada

## Endpoints consumidos por el frontend

1. GET /suppliers
2. POST /suppliers
3. PATCH /suppliers/{supplier_id}/rate
4. PATCH /suppliers/{supplier_id}/status
5. DELETE /suppliers/{supplier_id}

## Estructura frontend relevante

1. src/app/suppliers/page.tsx
	- Página principal del directorio

2. src/components/suppliers/SupplierTable.tsx
	- Tabla de proveedores y acciones por fila

3. src/components/suppliers/SupplierFilters.tsx
	- Filtros por país y categoría

4. src/components/suppliers/SupplierForm.tsx
	- Formulario de creación de proveedores

5. src/hooks/useSuppliers.ts
	- Estado, carga y acciones de proveedores

6. src/lib/suppliers-api.ts
	- Cliente API para operaciones CRUD/PATCH

7. src/app/api/suppliers/*
	- Rutas internas de Next que hacen proxy al backend

## Configuracion de URL de Proveedores en HTML estatico

Los menus de index.html, pages/contact_form.html y pages/vacant.html usan una variable global opcional:

window.NEXOVA_SUPPLIERS_URL

Comportamiento:

1. Si `window.NEXOVA_SUPPLIERS_URL` existe, se usa ese valor para el enlace de Proveedores.
2. Si no existe y estas en localhost/127.0.0.1, usa `http://localhost:3000/suppliers`.
3. Si no existe y estas en otro host, usa `${location.origin}/suppliers`.

Ejemplo para sobreescribir en tiempo de ejecucion antes de los menus:

<script>
	window.NEXOVA_SUPPLIERS_URL = "https://tu-dominio.com/suppliers";
</script>

## Comandos útiles

Desde uis:

npm run lint
npm run build

## Nota importante sobre datos semilla

Si ejecutas seed.py en services/api, el seeder limpia e inserta datos desde cero.
Por eso, cambios manuales previos (por ejemplo tarifa o estado) pueden perderse.
