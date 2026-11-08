---
name: prepare-delivery
description: 'Preparar la entrega de un cambio: usar antes de un commit, al cerrar una feature, correccion o cambio documental para revisar alcance, validaciones, memoria y evidencias.'
---

# Preparar una entrega verificable

## Entradas y limites

Necesitas objetivo, criterios de aceptacion acordados, rutas propias modificadas
y permisos disponibles. Si falta el objetivo o un criterio, aclaralo antes de
continuar. Esta skill revisa una entrega; no implementa features nuevas, no
ejecuta semillas ni autoriza por si sola commits, push o despliegues.

## Procedimiento

1. Lee AGENTS.md raiz, los tres documentos de `memory-bank/`, reglas aplicables
   e instrucciones/README locales. No avances si falta contexto obligatorio.
2. Ejecuta desde la raiz `git status --short`, `git diff --stat` y revisa el diff
   de las rutas propias. Para archivos nuevos revisa su contenido; no aparecen
   en `git diff`. Si hay cambios staged, revisa tambien `git diff --cached`.
   Separa los cambios del usuario de los de esta tarea.
3. Asocia cada criterio de aceptacion a una comprobacion concreta y selecciona
   la mas pequena que lo verifique, usando scripts y pruebas existentes:
   - Solo docs/configuracion: comprueba rutas, enlaces locales y frontmatter
     de skills; ejecuta `git diff --check` y revisa tambien archivos nuevos.
  - API: desde `services/`, selecciona el archivo o caso pytest
     existente pertinente. Para recuperacion de contrasena:
     `uv run --extra dev pytest tests/test_forgot_password.py --no-cov`.
     No extrapoles cobertura global desde esta prueba parcial.
   - UI: consulta `package.json` y usa los scripts del modulo afectado para
     la prueba, lint, tipos o build requerido. Si hay cambios visuales verifica
     la pantalla modificada en escritorio y movil; registra viewport y resultado.
   - Si un gate de CI o del modulo exige una comprobacion mas amplia, ejecutala
     una vez cuando corresponda. No sustituirla por un check parcial.
4. Registra directorio, comando, codigo de salida y resultado relevante.
   Para inspecciones manuales registra archivo o pantalla, metodo y resultado.
   No inventes resultados. Si faltan dependencias, permisos o un servicio,
   marca el criterio bloqueado. No instales nada ni abras acceso publico sin permiso.
5. Si falla, limita las correcciones locales a dos intentos. Tras ese limite,
   deten la entrega y reporta error exacto, intentos y sospecha. No arregles
   problemas ajenos ni entres en ciclos de build y correccion.
6. Revisa secretos, PII, bases/respaldos, artefactos, cambios ajenos y contratos.
   Actualiza la memoria cuando cambien negocio, arquitectura, restricciones,
   estado o bloqueos. Indica explicitamente si no requiere actualizacion.
7. Emite el informe de salida. Solo si todos los criterios y gates aplicables
   cumplen, declara listo para commit. Incluso entonces pide autorizacion si
   no existe; prepara solo rutas propias con `git add <ruta>` y revisa el diff
   staged antes de un commit autorizado. Nunca hacer push implicitamente.

## Criterios de aceptacion de la skill

La skill se considera completada con exito solo cuando:

- Se identifican objetivo, rutas propias y criterios del cambio sin incluir
  modificaciones ajenas en la entrega.
- Todos los criterios tienen evidencia observable y resultado satisfactorio;
  ningun gate obligatorio queda fallido, omitido o bloqueado.
- El diff final, incluidos archivos nuevos y staged, no contiene errores de
  formato, secretos, datos personales, bases ni artefactos no solicitados.
- La memoria refleja las decisiones y el estado actual, o se justifica que
  no hubo cambios de contexto.
- El informe distingue verificaciones ejecutadas de pendientes y confirma
  el estado de autorizacion. No se crea commit sin permiso explicito.

Si falla uno, el resultado es **bloqueado**, no listo para commit.

## Formato de salida

```text
Objetivo:
Rutas propias:
Criterio | Comprobacion (directorio/comando o inspeccion) | Evidencia | Resultado
Memoria actualizada / sin cambios (motivo):
Riesgos y bloqueos:
Estado: listo para commit / bloqueado
Autorizacion de commit: recibida / pendiente
```