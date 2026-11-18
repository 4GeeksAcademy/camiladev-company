# API de incidentes de Nexova

Este backend FastAPI recibe el CSV de incidentes de Nexova, lo valida y devuelve un resumen JSON. La aplicación está en [`api/main.py`](./api/main.py), sus dependencias en [`api/requirements.txt`](./api/requirements.txt) y la lógica de análisis compartida en [`packages/incidents_analysis`](../packages/incidents_analysis/README.es.md). El contrato de datos está descrito en [`CONTEXT.md`](../CONTEXT.md).

## Activar el entorno e instalar dependencias

Ejecuta los comandos desde la raíz del repositorio. En este workspace ya existe `.venv`; actívalo con:

```bash
source .venv/bin/activate
python -m pip install -r services-2/api/requirements.txt
```

## Levantar la API

Con el entorno activado, desde la raíz del repositorio ejecuta:

```bash
python -m uvicorn main:app --app-dir services-2/api --host 127.0.0.1 --port 8000 --reload
```

Mantén esa terminal abierta. La API queda disponible en `http://127.0.0.1:8000`; la documentación interactiva de FastAPI está en `http://127.0.0.1:8000/docs`.

## Analizar el CSV y ver el JSON

En otra terminal, también desde la raíz del repositorio, carga el CSV de muestra. El resultado JSON se imprime directamente en la terminal:

```bash
curl -s -F "file=@scripts/incidents-nexova.csv" http://127.0.0.1:8000/api/incidents/analyze | python -m json.tool
```

La respuesta incluye el total de registros, los válidos e inválidos, los desgloses por categoría y estado y las métricas de satisfacción.

## Ver la exportación CSV

Después de ejecutar el análisis anterior en el mismo proceso de API, solicita la exportación. Esta variante la imprime directamente en la terminal:

```bash
curl -s http://127.0.0.1:8000/api/incidents/results/export
```

Para guardarla en un archivo temporal en vez de imprimirla:

```bash
curl -s -o /tmp/results-api.csv http://127.0.0.1:8000/api/incidents/results/export
```

La ruta de exportación devuelve `404` si todavía no se ha analizado un CSV desde que se inició la API. El CSV incluye métricas agregadas, no datos individuales. Las direcciones de `customer_email` son sensibles y no se incluyen en respuestas ni exportaciones.

## Rutas disponibles

- `GET /`: comprueba que la API está activa.
- `POST /api/incidents/analyze`: recibe el archivo CSV en el campo multipart `file` y devuelve el análisis como JSON.
- `GET /api/incidents/results/export`: devuelve las métricas del último análisis como CSV.

Consulta también el [README en inglés](./README.md).
