# Nexova incidents API

This FastAPI backend accepts Nexova incident CSV files, validates them, and returns a JSON summary. The app lives in [`api/main.py`](./api/main.py), dependencies are listed in [`api/requirements.txt`](./api/requirements.txt), and shared analysis logic is in [`packages/incidents_analysis`](../packages/incidents_analysis/README.md). The data contract is documented in [`CONTEXT.md`](../CONTEXT.md).

## Activate the environment and install dependencies

Run these commands from the repository root. This workspace already has a `.venv` environment; activate it with:

```bash
source .venv/bin/activate
python -m pip install -r services-2/api/requirements.txt
```

## Start the API

With the environment active, run this from the repository root:

```bash
python -m uvicorn main:app --app-dir services-2/api --host 127.0.0.1 --port 8000 --reload
```

Keep that terminal running. The API is available at `http://127.0.0.1:8000`, and FastAPI's interactive documentation is at `http://127.0.0.1:8000/docs`.

## Analyze the CSV and print the JSON response

In a second terminal, also from the repository root, upload the sample CSV. The JSON response is formatted and printed in the terminal:

```bash
curl -s -F "file=@scripts/incidents-nexova.csv" http://127.0.0.1:8000/api/incidents/analyze | python -m json.tool
```

The response includes total, valid, and invalid record counts, category and status breakdowns, and satisfaction metrics.

## View the CSV export

After the analysis request above has run in the same API process, request the export. This form prints the CSV directly in the terminal:

```bash
curl -s http://127.0.0.1:8000/api/incidents/results/export
```

To save it to a temporary file instead:

```bash
curl -s -o /tmp/results-api.csv http://127.0.0.1:8000/api/incidents/results/export
```

The export route returns `404` if no CSV has been analyzed since the API started. The CSV contains aggregate metrics, not individual records. `customer_email` addresses are sensitive and are excluded from API responses and exports.

## Available routes

- `GET /`: health check.
- `POST /api/incidents/analyze`: accepts a CSV in the multipart `file` field and returns the analysis as JSON.
- `GET /api/incidents/results/export`: returns the latest analysis metrics as CSV.

See the [Spanish README](./README.es.md) as well.
