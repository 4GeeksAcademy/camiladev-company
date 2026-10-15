# `scripts` folder

This folder contains **helper scripts** for the monorepo: development automation, maintenance utilities, repetitive tasks (setup, lint, migrations, data generation, etc.), and internal tooling.

- **Main purpose**: group support tools that do not belong to a specific app, agent, or pipeline but make the team’s work easier.
- **Recommendation**: document each script (what it does, parameters, requirements, usage examples) and keep them reproducible (and safe) across environments.

> _Spanish version: [README.es.md](./README.es.md)._

## Nexova incident analyzer

[`analyze.py`](./analyze.py) is the command-line entry point for the ticket CSV described in [`CONTEXT.md`](../CONTEXT.md). It reads the file, prints record totals, validation errors, category and status breakdowns, and satisfaction metrics. It then asks whether to export the aggregated metrics to `results.csv`.

Run it from the repository root:

```bash
python scripts/analyze.py scripts/incidents-nexova.csv
```

The CSV path is the only required argument. Answer `y` to create `results.csv` in the current working directory; otherwise, no export is written. Individual customer email addresses are never printed or exported. Treat the input CSV as sensitive and do not share it externally.

CSV validation and analysis live in [`packages/incidents_analysis/analyzer.py`](../packages/incidents_analysis/analyzer.py); this script handles arguments, file reading, display, and export.
