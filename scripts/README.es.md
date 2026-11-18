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
