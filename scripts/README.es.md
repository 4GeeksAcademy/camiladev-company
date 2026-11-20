# Carpeta `scripts`

Esta carpeta contiene **scripts auxiliares** del monorepo: automatizaciones de desarrollo, utilidades de mantenimiento, tareas repetitivas (setup, lint, migraciones, generación de datos, etc.) y tooling interno.

- **Propósito principal**: agrupar herramientas de soporte que no pertenecen a una app/agente/pipeline específico, pero facilitan el trabajo del equipo.
- **Recomendación**: documenta cada script (qué hace, parámetros, requisitos, ejemplos de uso) y procura que sean reproducibles (y seguros) en distintos entornos.

## Analizador de incidentes de Nexova

[`analyze.py`](./analyze.py) es la interfaz de línea de comandos para procesar el CSV de tickets descrito en [`CONTEXT.md`](../CONTEXT.md). Lee el archivo, muestra el total de registros, los inválidos, los desgloses por categoría y estado, y las métricas de satisfacción. Después pregunta si se deben exportar las métricas agregadas a `results.csv`.

Desde la raíz del repositorio, ejecuta:

```bash
python scripts/analyze.py scripts/incidents-nexova.csv
```

El único argumento requerido es la ruta del CSV. Si aceptas la exportación con `y`, `s` o `sí`, el archivo `results.csv` se crea en el directorio actual. El analizador no imprime ni exporta direcciones de correo individuales; trata el CSV de entrada como información sensible y no lo compartas externamente.

La lógica de lectura y análisis pertenece a [`packages/incidents_analysis/analyzer.py`](../packages/incidents_analysis/analyzer.py); este script solo gestiona argumentos, lectura del archivo, presentación y exportación.

## Seed de incidencias históricas

`seed_incidents.py` importa el CSV del analizador a la base PostgreSQL
configurada por la API. Requiere el esquema creado por el arranque de FastAPI y
la ruta predeterminada del CSV indicada en `BRIEFING.md`; se puede indicar otra
ruta con `--csv`:

```sh
cd services
python3 -m uv run --no-sync python ../scripts/seed_incidents.py
python3 -m uv run --no-sync python ../scripts/seed_incidents.py --csv /ruta/al/incidents-nexova.csv
```

Valida y transforma cada fila antes del insert, muestra el resumen de filas
insertadas, repetidas e inválidas y no elimina ni sobrescribe incidencias. La
idempotencia se apoya en la tabla auxiliar `incidentseedsource`, que conserva
una clave hash de `ticket_id` o, si falta, de `title + created_at`; el valor
original de `ticket_id` no se guarda en `Incident`. No ejecutes el seed contra
una base real sin autorización. Para validar el script usa una base aislada.
