# Convenciones del repositorio

Alcance: todo el repositorio, incluidos documentacion y configuracion de agentes.
Carga: obligatoria desde el AGENTS.md raiz.

- Lee ambos contextos y el estado activo antes de modificar; aplica el flujo
  de entrega del AGENTS.md raiz, no solo estas reglas.
- Lee instrucciones y README del modulo objetivo. Reutiliza convenciones,
  utilidades y tipos existentes; evita abstracciones y archivos innecesarios.
- Respeta cambios ajenos. No restaures, borres ni migres archivos sin solicitud.
- No crees nuevas apps fuera de `public-website/` y `backoffice/`.
- No mezcles `.agents/` (configuracion) con `agents/` y `skills/` (producto).
- No añadas dependencias, cambies contratos o hagas refactors fuera del alcance.
- No escribas pruebas nuevas sin peticion explicita; selecciona las existentes
  pertinentes y limita los intentos de correccion a dos por fallo.
- No copies credenciales, tokens, CVs, emails reales ni bases de datos a docs,
  memoria, fixtures, capturas o commits. Usa ejemplos sinteticos.
- Mantiene contexto vigente: una nueva decision o restriccion exige actualizar
  `memory-bank/` con fecha y fuente en la misma entrega.
- Para reglas nuevas declara alcance y agrega su seleccion al AGENTS.md raiz.
  Para skills usa `.agents/skills/<name>/SKILL.md`, `name` igual al directorio,
  descripcion con disparadores y criterios comprobables.