# `packages` folder

This folder contains **shared packages** for the monorepo: internal libraries, utilities, types, shared components, SDKs, clients, and any code reused by multiple applications, agents, or pipelines.

Each subfolder under `packages/` should represent **one versionable package** (for example `shared-types`, `ui`, `analytics-sdk`) with its own README.

- **Main purpose**: encourage reuse and consistency across all company deliverables.
- **Recommendation**: document packages as you add them—their public API and how they are consumed from `apps/`, `agents/`, and `workflows/`.

> _Spanish version: [README.es.md](./README.es.md)._

## `incidents_analysis` package

Reusable validation and analysis logic for Nexova ticket CSV files lives in [`incidents_analysis/`](./incidents_analysis/). See the [English README](./incidents_analysis/README.md) or [Spanish README](./incidents_analysis/README.es.md) for the API and usage examples.
