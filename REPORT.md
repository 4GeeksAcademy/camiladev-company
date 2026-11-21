# Informe de auditoría Lighthouse

**Fecha:** 2026-11-21  
**Aplicaciones:** `uis/website/` y `uis/backoffice/`  
**Alcance:** comparación de la puntuación Performance antes/después y resumen de los cambios realizados durante la auditoría.

## Resumen de puntuaciones

| Aplicación | Performance antes | Performance después | Diferencia | Resultado |
| --- | ---: | ---: | ---: | --- |
| Website | 96 | 86 | **−10 puntos** | Bajó |
| Backoffice | 97 | 98 | **+1 punto** | Subió |

Los valores iniciales fueron transcritos por el usuario de capturas Lighthouse tomadas antes de los cambios. Las puntuaciones posteriores también fueron reportadas por el usuario. No se dispone en este informe de los reportes JSON, URLs/rutas exactas, valores de métricas individuales ni condiciones completas de medición; por eso la comparación es descriptiva y no demuestra por sí sola causalidad.

### Otras categorías iniciales conocidas

La línea base reportada fue la misma en escritorio y móvil: website Accesibilidad 97, Recomendaciones 100 y SEO 63; backoffice Accesibilidad 100, Recomendaciones 100 y SEO 60. No se proporcionaron puntuaciones posteriores para estas categorías.

## Correcciones y cambios realizados

1. **Mitigación de clickjacking (website y backoffice):** se agregó `X-Frame-Options: DENY` en los encabezados de respuesta configurados en los `next.config.ts`. Impide que las páginas se incrusten en un `iframe`. La comprobación HTTP con los servidores reiniciados quedó pendiente en el registro de auditoría; confirmar también que no haya un caso legítimo de embedding.
2. **Aislamiento de origen (website y backoffice):** se agregó `Cross-Origin-Opener-Policy: same-origin`. La revisión estática no encontró uso de `window.open`/`window.opener`, pero quedaba pendiente validar el encabezado con los servidores reiniciados y revisar manualmente los flujos de autenticación/navegación.
3. **Reutilización del header público (website):** se extrajo `PublicSiteHeader` y se integró en inicio, formulario y vacantes, configurando sus enlaces por página. Es una mejora de mantenibilidad; no hay evidencia de que explique una variación de Performance.
4. **Evaluación de CSP (sin cambio aplicado):** se revisaron los recursos utilizados y la guía CSP de Next.js 16.4.3. Se decidió no añadir una política estática a ciegas: la estrategia con nonces recomendada por Next necesita nonces por respuesta, Proxy y renderizado dinámico. El sitio también usa JSON-LD inline y Google Fonts. CSP queda pendiente de una implementación probada, idealmente con report-only primero.

No se aplicó HSTS porque no se confirmó la terminación HTTPS/TLS del despliegue. Trusted Types sigue pendiente. La evaluación de CSP no es una corrección aplicada y no se cuenta como tal.

## ¿Qué tuvo mayor impacto?

En la puntuación Performance reportada, **el cambio más favorable fue el del backoffice (+1 punto, de 97 a 98)**. La mayor variación observada, en términos absolutos, fue en website: **−10 puntos, de 96 a 86**, un descenso y no una mejora.

No es posible atribuir esos resultados a una corrección concreta con la evidencia actual. Los encabezados XFO y COOP son controles de seguridad y no optimizaciones de rendimiento esperadas; la extracción del header es principalmente de mantenibilidad. Además, las puntuaciones agregadas pueden variar por ruta, dispositivo, carga de red/CPU, servidor, caché y condiciones de Lighthouse. Por tanto, **no hay evidencia para afirmar qué corrección causó el +1 del backoffice o el −10 del website**. El cambio de website merece investigación prioritaria, pero no debe atribuirse a CSP porque no se implementó.

## Limitaciones y siguiente paso

- Registrar URL/ruta medida, dispositivo, modo y condiciones de ejecución de ambas mediciones.
- Conservar o adjuntar reportes Lighthouse completos para comparar métricas y diagnósticos (TTFB, LCP, CLS, INP, TBT, recursos y oportunidades), no solo Performance.
- Repetir las mediciones bajo condiciones equivalentes, especialmente para website, y revisar el elemento LCP, recursos bloqueantes y variabilidad antes de seleccionar otra optimización.
- Confirmar por HTTP los encabezados XFO/COOP después de reiniciar los servidores y validar flujos funcionales.
- Mantener la comparación como reporte de puntuación agregada hasta disponer de los datos anteriores; no inferir mejoras o regresiones de métricas individuales.

## Fuentes

- `AUDIT.md`: baseline reportada, cambios, inspecciones y limitaciones de la auditoría.
- Puntuaciones posteriores (website 86, backoffice 98): dato reportado por el usuario; no se adjuntó el artefacto Lighthouse correspondiente.
