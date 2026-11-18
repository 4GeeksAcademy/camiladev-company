# Nexova Incidents Frontend

[Español](README.es.md)

Internal operations UI built with Next.js 16.4.0, React 19.3.0 and TypeScript. It uploads incident CSV files to the API in `services-2/api`, displays analysis metrics and downloads the latest results.

## Styling Updates

- Tailwind CSS and `@tailwindcss/postcss` are pinned to **4.3.3**, matching the Tailwind version resolved in `uis/` and `uis-1/`.
- [postcss.config.mjs](postcss.config.mjs) enables Tailwind through PostCSS, following the configuration in `uis/`.
- [src/app/tailwind.css](src/app/tailwind.css) imports Tailwind and defines the theme, base styles and component classes with `@apply`.
- All references to the deleted stylesheet were removed. The root layout now imports the Tailwind entry above.
- Slate surfaces, cyan accents, Manrope/Sora fonts via `next/font`, focus indicators, disabled/error states and responsive layouts follow the visual conventions of the other project sections.
- Application logic, API calls and routes were not changed by the styling update.

## Requirements

- Node.js 20.9 or newer and npm.
- Python 3.10 or newer and pip for the API.
- A checkout of the entire repository: the API imports `packages.incidents_analysis`.
- Internet access for dependency installation and Google font downloads during the initial build.

## Start the Application

Use two terminals and keep both processes running. Commands below start from the repository root, `camiladev-company/`.

1. Start the API in the first terminal:

	```bash
	python -m pip install -r services-2/api/requirements.txt
	python -m uvicorn main:app --app-dir services-2/api --host 0.0.0.0 --port 8000 --reload
	```

	Check [http://localhost:8000/](http://localhost:8000/) or open the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

2. Install and start the frontend in the second terminal:

	```bash
	cd uis-2
	npm ci
	npm run dev -- --hostname 0.0.0.0 --port 3000
	```

3. Open [http://localhost:3000](http://localhost:3000). In Codespaces, open the **Ports** panel and use **Open in Browser** for port 3000. The frontend forwards `/backend/:path*` to `http://127.0.0.1:8000/:path*`, so both processes must run in the same environment. Only the frontend port needs to be opened in your browser.

## Download the Test CSV

The sample is [scripts/incidents-nexova.csv](../scripts/incidents-nexova.csv), relative to the repository root. It is inside `scripts/`, not directly at the root level.

1. In the VS Code/Codespaces Explorer, expand `scripts/` and locate `incidents-nexova.csv`.
2. In browser-based Codespaces, right-click the file and choose **Download** to download it to your local computer.
3. If you work locally, no download is needed: select the existing file from your repository checkout when uploading it.

Keep its `.csv` extension and UTF-8 encoding. It contains incident identifiers, dates, companies, categories, descriptions, agents, statuses, customer emails and satisfaction scores. Use this sample for testing rather than uploading real customer data.

## Navigate and Test the UI

1. On **Inicio** (`/`), click **Analizar incidencias**, or select **Incidencias** in the navigation bar. You can also open [http://localhost:3000/incidents](http://localhost:3000/incidents) directly.
2. Under **Archivo CSV**, open the file picker and select the downloaded `incidents-nexova.csv`. Its name appears below the field.
3. Click **Analizar CSV**. The button shows **Analizando...** and is disabled while the request runs.
4. Review **Total**, **Válidos**, **Inválidos** and **Satisfacción**, followed by invalid-record reasons, category/status breakdowns and satisfaction statistics with score distribution.
5. Click **Descargar resultados CSV** to download `results.csv`, the analysis summary rather than the original input file.
6. To analyze another file, select it and click **Analizar CSV** again. Use **Inicio** in the navigation bar to return to the home page.

The API stores the latest successful analysis in memory, shared across users of that API process. Restarting it clears the export; run a new analysis before downloading results. Another successful upload replaces the result available for export.

## Checks and Production Build

Run these commands from `uis-2/`:

```bash
npm run lint
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Stop the development server before starting production on the same port. Keep the API running on port 8000.

## Troubleshooting

- **Port 3000 is occupied:** use `npm run dev -- --hostname 0.0.0.0 --port 3002` and open port 3002 instead. If another server already runs this same frontend, use it or stop it before starting a second instance.
- **Analysis or download fails:** check that the API is running on port 8000 and inspect its terminal output. The proxy target is defined in [next.config.ts](next.config.ts).
- **Tailwind plugin is not found after installing dependencies:** stop the frontend, run `npm ci` from `uis-2/`, then restart it so the new dependencies are loaded.
- **CSV is rejected:** check that it is a nonempty `.csv` file encoded as UTF-8 and preserves the sample headers. The UI displays the API's validation message.
- **No export is available:** complete an analysis first; restarting the API clears the saved result.
