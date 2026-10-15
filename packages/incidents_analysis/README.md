# `incidents_analysis` package

This package implements the shared analysis logic for Nexova support tickets described in [`CONTEXT.md`](../../CONTEXT.md). Its [`analyzer.py`](./analyzer.py) module validates CSV rows, counts valid and invalid records, calculates category and status breakdowns and satisfaction metrics, and builds the console summary and aggregate CSV export.

## Run the analyzer

The recommended interface is the repository CLI. From the repository root, run:

```bash
python scripts/analyze.py scripts/incidents-nexova.csv
```

The CLI prints the summary and asks whether to export results to `results.csv` in the current working directory.

## API usage

The package exports `analyze_csv_text`, `format_summary`, and `summary_to_csv`:

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

`analyze_csv_text` requires the columns `ticket_id`, `date`, `client_company`, `category`, `description`, `agent_id`, `status`, and `customer_email`. The `satisfaction_score` column may be omitted from the header, but every `CLOSED` ticket must have a score.

## Privacy

`customer_email` is sensitive data. Validation errors never include its value, and summaries and exports contain aggregate counts and metrics only, never individual email addresses. Do not print or share the source CSV.

See [`scripts/README.md`](../../scripts/README.md) for the CLI details, or the [Spanish README](./README.es.md).
