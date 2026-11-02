# Operacion de agentes de desarrollo

## Lectura obligatoria antes de actuar

Antes de modificar archivos, ejecutar comandos que alteren datos o preparar un
commit, lee en este orden:

1. [Contexto de negocio](memory-bank/business-context.md).
2. [Contexto tecnico](memory-bank/technical-context.md).
3. [Estado y decisiones](memory-bank/active-context.md).
4. Las reglas aplicables de la tabla siguiente y las instrucciones mas cercanas
   al archivo objetivo, incluidos los AGENTS.md de las aplicaciones.

Si falta un documento obligatorio, deten las modificaciones y comunica el
bloqueo. Para resolver dudas de negocio consulta [BRIEFING.md](BRIEFING.md);
para implementacion consulta los README y el codigo del modulo afectado.
No conviertas una aspiracion del briefing en una funcionalidad existente.

## Seleccion de reglas

Las reglas de `.agents/rules/` se cargan mediante esta tabla, no se presupone
que cualquier editor descubra automaticamente esa carpeta. Lee cada regla cuyo
alcance coincida con la tarea, incluso si el cambio solo afecta documentacion.

| Alcance (rutas relativas a la raiz) | Regla obligatoria |
| --- | --- |
| Todo el repositorio | [Repositorio](.agents/rules/repository.md) |
| `public-website/**`, `backoffice/**`; creacion o traslado de aplicaciones | [Aplicaciones](.agents/rules/applications.md) |
| `backoffice/services/**`; cambios en autenticacion, persistencia o datos personales | [API y datos](.agents/rules/api-data.md) |

`.agents/` configura herramientas de desarrollo. `agents/` y `skills/` son
modulos de producto: no alojes alli esta configuracion.

## Flujo de entrega obligatorio

1. Lee el contexto y revisa `git status --short`. Respeta cambios ajenos.
2. Explica el objetivo, alcance, criterios de aceptacion y un plan corto.
   Identifica el codigo que decide el comportamiento y una comprobacion local.
3. Implementa el cambio minimo, sin refactors ni dependencias ajenas al objetivo.
4. Ejecuta una comprobacion enfocada inmediatamente despues del cambio.
   No crees pruebas salvo peticion explicita. No repitas toda la suite.
   Tras dos intentos fallidos, informa del error y espera indicaciones.
5. Revisa el diff, riesgos, datos sensibles y actualiza la memoria afectada.
6. Usa [la skill de entrega](.agents/skills/prepare-delivery/SKILL.md) para
   registrar evidencias y comprobar todos los criterios antes de un commit.
7. Solo con autorizacion explicita, prepara archivos por ruta y crea el commit.
   No uses `git add .`, no incluyas cambios ajenos y no hagas push sin permiso.

Si un criterio obligatorio no se puede verificar, la entrega queda bloqueada:
explica el comando, error o dependencia pendiente. No declares pruebas exitosas
sin ejecutarlas. Estas instrucciones guian al agente; no son un hook ni una
barrera tecnica que impida commits externos.

## Mantenimiento de memoria

En cada entrega actualiza el documento que haya cambiado: negocio, arquitectura,
restricciones, funcionalidad terminada o bloqueos. Registra fecha, fuente y
evidencia; distingue hechos, propuestas y pendientes. No copies logs extensos,
secretos ni datos personales. Si nada cambio, indicarlo en el informe basta.