# Contexto de negocio

Fuente principal: [BRIEFING.md](../BRIEFING.md). Revision: 2026-11-02.

## Empresa y usuarios

Nexova Solutions es la consultora del caso educativo de AI Engineering de
4Geeks Academy. Fundada en 2011, tiene sede en Valencia y expansion en Miami,
120 empleados y aproximadamente USD 8 millones de facturacion anual.
Sus clientes son medianas empresas de tecnologia, retail y servicios financieros.
Sus tres lineas son headhunting de mandos medios y directivos, outsourcing de
soporte al cliente y formacion corporativa. Laura Mendoza es la CEO.

El equipo de AI Engineering construye sistemas, automatizaciones y herramientas
inteligentes para reducir trabajo manual y permitir operar a escala.
[CONTEXT.md](../CONTEXT.md) denomina la plataforma propuesta Nexova TalentFlow AI.
Ese nombre no implica que todos los modulos esten implementados.

## Necesidades por area (objetivos, no estado implementado)

| Area y responsable | Problema | Resultado buscado |
| --- | --- | --- |
| Marketing, Carmen Ruiz | Web de 2019, contenido manual, conversiones poco visibles | Web accesible con SEO/GEO y schema.org, contenido asistido y metricas |
| Ventas, responsable por confirmar | HubSpot actualizado regularmente por solo el 40% del equipo; seguimiento manual | Pipeline, secuencias, alertas de inactividad y propuestas asistidas |
| RRHH interno, Patricia Solis | Email, hojas de calculo y onboarding manual | Portal, checklists, KPIs y consultas sobre politicas |
| Seleccion, Javier Almeida; 40 consultores | Criba manual de 30-80 CVs por proceso, matching subjetivo | Ranking explicable, RAG de candidatos, estado visible y comunicaciones |
| Formacion, Elena Vargas; 12 personas | Catalogo PDF, inscripciones y seguimiento manuales | Catalogo e inscripcion online, recomendaciones y portal del alumno |
| Soporte, Roberto Diaz; 30 agentes | Resolucion media de 48 h frente a SLA de 24 h | RAG de primera linea, conocimiento centralizado, backlog y sentimiento |
| Tecnologia, Sergio Molina; 6 personas | HubSpot, Zendesk legacy, ATS y Workspace desconectados | Datos integrados, telemetria, alertas y consultas de arquitectura |
| Direccion, Laura Mendoza | Informes PDF semanales; 4-8 h de preparacion por manager | KPIs unificados, informes automaticos y alertas estrategicas |

El objetivo del chatbot de soporte es resolver el 40% de consultas sin
intervencion humana; no es una metrica lograda. Los usuarios son equipos B2B
con flujos profesionales, ademas de candidatos, clientes y alumnos.

## Limites y dudas

- El briefing describe problemas actuales de la empresa y resultados deseados,
  no una autorizacion para implementar todas las areas en una sola tarea.
- Para cada feature deben acordarse criterios verificables y su alcance.
- Los rankings de candidatos deben ser explicables; no presuponer una decision
  automatica de contratacion ni usar atributos sensibles como criterio.
- El briefing nombra a Megan Clarke al describir Ventas y a Marcos Ibanez en
  el detalle del departamento. Confirmar con el responsable de negocio antes
  de fijar propietarios en la aplicacion.