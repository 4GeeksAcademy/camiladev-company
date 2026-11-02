# Estado activo y decisiones

Ultima actualizacion: 2026-11-02.

## Estado conocido

- El repositorio ya contiene sitio publico, UI interna y API; no parte de cero.
- La API unificada del backoffice tiene autenticacion, usuarios, perfiles y
  proveedores segun [su README](../backoffice/services/README.md).
- El backoffice documenta candidatos conectados a una API externa. No se ha
  verificado aqui el funcionamiento en ejecucion de las aplicaciones.
- Esta entrega introduce contexto y configuracion de agentes, sin cambiar
  aplicaciones, datos, dependencias ni crear commits.
- Los resultados historicos de [TESTING.md](../TESTING.md) no equivalen a
  pruebas ejecutadas en esta sesion. Consultar evidencia vigente en cada entrega.

## Decisiones en vigor

| Decision | Motivo y fuente |
| --- | --- |
| Negocio y tecnica se leen antes de modificar | Evitar reiniciar sin contexto; solicitud del tech lead y AGENTS.md raiz |
| Apps en `public-website/` y `backoffice/` | Mapa de la plantilla y requisito explicito del tech lead |
| Configuracion en `.agents/`, no en `agents/` o `skills/` | Separar herramientas de desarrollo de modulos de producto |
| Reglas seleccionadas por rutas desde AGENTS.md | No depender del descubrimiento automatico de un editor |
| Entrega con evidencia antes de commit y permiso explicito | Proteger calidad, cambios ajenos y datos sensibles |
| Preservar instrucciones locales de Next.js | Respetar las convenciones de cada aplicacion |

## Pendientes

- Confirmar propietario de Ventas: el briefing menciona dos nombres.
- Los sistemas IA y dashboards del briefing son objetivos; su alcance y
  aceptacion deben definirse por tarea, no declararse completados por defecto.
- No se han implementado hooks ni CI para imponer el flujo: AGENTS.md y
  la skill son instrucciones de operacion, no controles tecnicos de bloqueo.

## Como mantener este archivo

Al terminar una tarea registra fecha, cambio completado, decisiones con motivo,
validaciones realmente ejecutadas y pendientes. Sustituye estado obsoleto;
no acumules un diario de conversaciones. Actualiza tambien negocio o tecnica
si cambian sus hechos y conserva la referencia a la fuente correspondiente.