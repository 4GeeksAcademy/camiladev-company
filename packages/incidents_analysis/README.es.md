# Paquete `incidents_analysis`

Este paquete implementa la lógica compartida del analizador de tickets de soporte de Nexova descrito en [`CONTEXT.md`](../../CONTEXT.md). Su módulo [`analyzer.py`](./analyzer.py) valida filas CSV, cuenta registros válidos e inválidos, calcula distribuciones por categoría y estado y métricas de satisfacción, y prepara el resumen de consola y la exportación CSV agregada.

## Ejecución del analizador

La interfaz recomendada es el CLI del repositorio. Desde la raíz, ejecuta:

```bash
python scripts/analyze.py scripts/incidents-nexova.csv
```

El CLI imprime el resumen y pregunta si se desea exportar los resultados a `results.csv` en el directorio actual.

## Uso de la API

El paquete exporta `analyze_csv_text`, `format_summary` y `summary_to_csv`:

```python
from pathlib import Path

from packages.incidents_analysis import (
    analyze_csv_text,
    format_summary,
    summary_to_csv,
)

csv_path = Path("scripts/incidents-nexova.csv")
summary = analyze_csv_text(
    csv_path.read_text(encoding="utf-8-sig"),
    source_file=csv_path.name,
)
print(format_summary(summary))
Path("results.csv").write_text(
    summary_to_csv(summary),
    encoding="utf-8",
)
```

`analyze_csv_text` requiere las columnas `ticket_id`, `date`, `client_company`, `category`, `description`, `agent_id`, `status` y `customer_email`. `satisfaction_score` puede omitirse del encabezado, pero es obligatorio para cada ticket `CLOSED`.

## Privacidad

`customer_email` es información sensible. La validación nunca incluye su valor en errores y los resúmenes y exportaciones contienen solo conteos y métricas agregadas, nunca direcciones individuales. No imprimas ni compartas el CSV original.

La descripción del CLI está en [`scripts/README.es.md`](../../scripts/README.es.md); consulta también el [README en inglés](./README.md).
