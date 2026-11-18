# Frontend de Incidencias de Nexova

[English](README.md)

UI interna de operaciones desarrollada con Next.js 16.4.0, React 19.3.0 y TypeScript. Permite subir archivos CSV de incidencias a la API de `services-2/api`, consultar métricas del análisis y descargar los últimos resultados.

## Actualizaciones de Estilos

- Tailwind CSS y `@tailwindcss/postcss` están fijados en **4.3.3**, la misma versión de Tailwind resuelta en `uis/` y `uis-1/`.
- [postcss.config.mjs](postcss.config.mjs) activa Tailwind mediante PostCSS, siguiendo la configuración de `uis/`.
- [src/app/tailwind.css](src/app/tailwind.css) importa Tailwind y define el tema, los estilos base y las clases de componentes con `@apply`.
- Se eliminaron todas las referencias a la hoja de estilos borrada. El layout raíz ahora importa la entrada de Tailwind indicada arriba.
- Las superficies slate, los acentos cyan, las fuentes Manrope/Sora mediante `next/font`, los indicadores de foco, los estados deshabilitados/de error y los diseños adaptables siguen las convenciones visuales de las otras secciones del proyecto.
- La actualización de estilos no modificó la lógica de la aplicación, las llamadas a la API ni las rutas.

## Requisitos

- Node.js 20.9 o superior y npm.
- Python 3.10 o superior y pip para la API.
- Una copia del repositorio completo: la API importa `packages.incidents_analysis`.
- Acceso a internet para instalar dependencias y descargar las fuentes de Google durante la primera compilación.

## Levantar la Aplicación

Usa dos terminales y mantén ambos procesos ejecutándose. Los comandos siguientes parten de la raíz del repositorio, `camiladev-company/`.

1. Inicia la API en la primera terminal:

   ```bash
   python -m pip install -r services-2/api/requirements.txt
   python -m uvicorn main:app --app-dir services-2/api --host 0.0.0.0 --port 8000 --reload
   ```

   Comprueba [http://localhost:8000/](http://localhost:8000/) o abre la documentación de la API en [http://localhost:8000/docs](http://localhost:8000/docs).

2. Instala e inicia el frontend en la segunda terminal:

   ```bash
   cd uis-2
   npm ci
   npm run dev -- --hostname 0.0.0.0 --port 3000
   ```

3. Abre [http://localhost:3000](http://localhost:3000). En Codespaces, abre el panel **Ports** y utiliza **Open in Browser** para el puerto 3000. El frontend reenvía `/backend/:path*` a `http://127.0.0.1:8000/:path*`, por lo que ambos procesos deben ejecutarse en el mismo entorno. Solo necesitas abrir el puerto del frontend en el navegador.

## Descargar el CSV de Prueba

El archivo de ejemplo es [scripts/incidents-nexova.csv](../scripts/incidents-nexova.csv), relativo a la raíz del repositorio. Está dentro de `scripts/`, no directamente en el nivel raíz.

1. En el explorador de VS Code/Codespaces, despliega `scripts/` y localiza `incidents-nexova.csv`.
2. En Codespaces desde el navegador, haz clic derecho sobre el archivo y selecciona **Download** para descargarlo a tu computadora local.
3. Si trabajas localmente, no necesitas descargarlo: selecciona el archivo existente en tu copia del repositorio al subirlo.

Conserva su extensión `.csv` y codificación UTF-8. Contiene identificadores de incidencias, fechas, empresas, categorías, descripciones, agentes, estados, correos de clientes y puntuaciones de satisfacción. Usa este ejemplo para las pruebas en lugar de subir datos reales de clientes.

## Navegar y Probar la UI

1. En **Inicio** (`/`), pulsa **Analizar incidencias** o selecciona **Incidencias** en la barra de navegación. También puedes abrir directamente [http://localhost:3000/incidents](http://localhost:3000/incidents).
2. En **Archivo CSV**, abre el selector de archivos y elige el `incidents-nexova.csv` descargado. Su nombre aparece debajo del campo.
3. Pulsa **Analizar CSV**. El botón muestra **Analizando...** y permanece deshabilitado mientras se procesa la solicitud.
4. Revisa **Total**, **Válidos**, **Inválidos** y **Satisfacción**, seguidos de los motivos de registros inválidos, los desgloses por categoría/estado y las estadísticas de satisfacción con la distribución de puntajes.
5. Pulsa **Descargar resultados CSV** para descargar `results.csv`, el resumen del análisis y no el archivo original de entrada.
6. Para analizar otro archivo, selecciónalo y vuelve a pulsar **Analizar CSV**. Usa **Inicio** en la barra de navegación para regresar a la página principal.

La API guarda en memoria el último análisis exitoso, compartido entre los usuarios de ese proceso de API. Reiniciarla elimina la exportación; ejecuta un nuevo análisis antes de descargar resultados. Otra carga exitosa reemplaza el resultado disponible para exportar.

## Comprobaciones y Compilación de Producción

Ejecuta estos comandos desde `uis-2/`:

```bash
npm run lint
npm run build
npm run start -- --hostname 0.0.0.0 --port 3000
```

Detén el servidor de desarrollo antes de iniciar producción en el mismo puerto. Mantén la API ejecutándose en el puerto 8000.

## Solución de Problemas

- **El puerto 3000 está ocupado:** usa `npm run dev -- --hostname 0.0.0.0 --port 3002` y abre el puerto 3002. Si otro servidor ya ejecuta este mismo frontend, úsalo o detenlo antes de iniciar una segunda instancia.
- **Falla el análisis o la descarga:** comprueba que la API esté ejecutándose en el puerto 8000 y revisa su terminal. El destino del proxy está definido en [next.config.ts](next.config.ts).
- **No se encuentra el plugin de Tailwind después de instalar dependencias:** detén el frontend, ejecuta `npm ci` desde `uis-2/` y reinícialo para cargar las nuevas dependencias.
- **Se rechaza el CSV:** verifica que sea un archivo `.csv` no vacío, codificado en UTF-8 y que conserve los encabezados del ejemplo. La UI muestra el mensaje de validación de la API.
- **No hay una exportación disponible:** completa un análisis primero; reiniciar la API elimina el resultado guardado.