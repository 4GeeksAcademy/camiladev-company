
# Cómo inicializar este proyecto

- Muevete a la carpeta uis-1/talent-pipeline-tracker

bash```
cd uis-1/talent-pipeline-tracker/
``

-  Si estás en un nuevo Codespaces, instala las dependencias:

bash```
npm install
``

-  Arranca el servidor de desarrollo:

bash```
npm run dev
``

## CONTEXT — Nexova -Talent Pipeline Tracker

### Sobre Nexova
 Nexova es una consultora de recursos humanos y adquisición de talento con oficinas en Valencia y Miami. El negocio principal de Nexova es exactamente lo que esta herramienta soporta: encontrar a las personas adecuadas. Este frontend no es solo un proyecto interno — es una demostración directa de las propias capacidades de Nexova.

## Pruebas manuales usando la UI

Estas pruebas comprueban la integración con la API utilizando las pantallas, campos y botones de la app. No hay que escribir peticiones, revisar JSON ni usar Postman. Son instrucciones para ejecutar pruebas, no resultados de pruebas ya realizadas.

### Preparación

1. Abre la app en `http://localhost:3000` o en la URL del puerto reenviado de Codespaces. Si el servidor ya está activo, reutilízalo; si no, ejecuta `npm run dev` desde la carpeta de esta app.
2. Comprueba que estás en la pantalla «Candidaturas» y que termina de cargar.
3. Usa únicamente candidaturas de prueba autorizadas. La API es compartida: no modifiques candidaturas ni elimines notas de personas reales.
4. Para las pruebas de registro, utiliza un email ficticio único en cada ejecución, por ejemplo `prueba.people.20261008.001@example.com`. No publiques capturas con datos personales ni el archivo de entorno.

No necesitas instalar herramientas adicionales. Las pruebas de éxito se realizan directamente en la UI. Solo para simular lentitud o desconexión se pueden usar los controles del navegador descritos al final.

### 1. Consultar y actualizar el listado

1. Entra en «Candidaturas» desde la cabecera.
2. Espera a que aparezcan las filas y el resumen «Total de candidaturas».
3. Comprueba que cada fila muestra nombre completo, puesto, estado actual y etapa actual.
4. Recorre el listado hacia abajo. Si hay más de veinte candidaturas conocidas en el entorno de pruebas, comprueba que también aparecen las posteriores: la app carga todas las páginas automáticamente, sin un botón «Siguiente».
5. Pulsa «Actualizar listado» y espera a que vuelva a aparecer el listado.

**Resultado esperado:** aparecen las candidaturas con etiquetas legibles en español. El resumen total coincide con las filas sin filtros. No aparecen emails, teléfonos ni notas internas en esta pantalla. Si el entorno está vacío, aparece «Todavía no hay candidaturas»; no borres registros para provocar este caso.

### 2. Registrar una candidatura de prueba

1. Desde el listado, pulsa «Nueva candidatura».
2. Completa el formulario con estos datos ficticios, cambiando el email por uno único:

| Campo de la UI | Valor de prueba |
| --- | --- |
| Nombre completo | Candidatura de prueba UI |
| Email | prueba.people.20261008.001@example.com |
| Teléfono | 600000000 |
| Puesto | Asistente de Dirección |
| Años de experiencia | 3 |
| LinkedIn | Déjalo vacío |
| Enlace al CV | Déjalo vacío |

3. Pulsa «Registrar candidatura» una sola vez.
4. Espera a que se abra el detalle y aparezca «Candidatura registrada correctamente».
5. Activa «Mostrar datos de contacto» y compara los datos visibles con los que escribiste.
6. Pulsa «Volver a candidaturas», busca el nombre de prueba y comprueba que aparece.
7. Abre de nuevo «Ver detalle» y recarga la página para comprobar que los datos siguen guardados.

**Resultado esperado:** se crea una candidatura y se abre su detalle. Durante el envío aparece «Guardando…» y el formulario se bloquea. Usa esta candidatura para las siguientes pruebas de escritura. No presupongas un estado o etapa inicial: comprueba lo que muestre la app.

Si después de guardar aparece un error al abrir el detalle, vuelve al listado y busca la candidatura antes de repetir el registro: podría haberse creado correctamente.

### 3. Filtrar por estado y etapa

1. En el listado, selecciona «En proceso» en «Estado».
2. Comprueba que todas las filas visibles tienen ese estado.
3. Selecciona «En revisión» en «Etapa» y comprueba que las filas cumplen ambos filtros.
4. Cambia el estado a «Todos los estados»: debe mantenerse el filtro de etapa.
5. Vuelve a elegir un estado y recarga la página. Los desplegables deben conservar los filtros seleccionados.
6. Pulsa «Limpiar» y comprueba que vuelven «Todos los estados» y «Todas las etapas» y reaparece el listado completo.

**Resultado esperado:** los filtros se combinan sin recargar toda la página al seleccionar opciones. La URL refleja los filtros y los conserva al recargar. Si no hay coincidencias, aparece «Sin coincidencias», no un error. Los resúmenes superiores siguen mostrando las cifras generales, no solo las filas filtradas.

### 4. Buscar por nombre y email

1. Pulsa «Limpiar» si hay filtros activos.
2. En «Buscar por nombre o email», escribe parte del nombre de la candidatura de prueba.
3. Comprueba que aparece la candidatura y que las filas que no coinciden desaparecen.
4. Sustituye el texto por parte de su email y comprueba que también la encuentra, aunque el email no se muestre en las filas.
5. Repite la búsqueda alternando mayúsculas y minúsculas: los resultados deben ser los mismos.
6. Escribe `sin-coincidencias-prueba-ui` y comprueba que aparece «Sin coincidencias» si ninguna candidatura coincide.
7. Combina la búsqueda con un estado y una etapa conocidos de la candidatura. Deben cumplirse los tres criterios.
8. Pulsa «Limpiar»: deben vaciarse la búsqueda y los filtros.

**Resultado esperado:** las coincidencias cambian mientras escribes, sin recargar la página. El nombre o email buscado no aparece en la URL. La búsqueda se pierde al recargar; los filtros de estado y etapa sí se conservan. Estas acciones filtran datos ya cargados, no prueban los filtros del servidor.

### 5. Abrir el detalle y comprobar la privacidad

1. Localiza la candidatura de prueba en el listado y pulsa «Ver detalle».
2. Comprueba el nombre, puesto, experiencia, fecha de candidatura, última actualización, estado y etapa.
3. Comprueba que email, teléfono, LinkedIn y CV muestran «Oculto».
4. Activa «Mostrar datos de contacto»: deben aparecer el email y teléfono; los enlaces vacíos deben indicar «No disponible».
5. Desactiva «Mostrar datos de contacto» y comprueba que vuelven a ocultarse.
6. Pulsa «Volver a candidaturas» y abre la misma candidatura pulsando su nombre en la tabla. Debe llevar al mismo detalle.

**Resultado esperado:** ambas acciones abren el detalle mediante navegación interna de Next.js. La URL contiene el identificador real del candidato. No uses `/candidates/1` salvo que exista ese ID: el identificador no es la posición en el listado.

Ocultar datos en pantalla evita mostrarlos por defecto, pero no sustituye a los permisos del backend.

### 6. Cambiar el estado desde «Ver detalle»

1. Abre la candidatura de prueba con «Ver detalle»; no pulses «Editar candidatura».
2. Localiza «Proceso de selección» y anota el valor de «Etapa actual».
3. En «Estado actual», elige una opción diferente, por ejemplo «En proceso».
4. Espera a «Candidatura actualizada correctamente» sin pulsar ningún botón «Guardar».
5. Comprueba que el desplegable y el campo «Estado» de los datos del detalle muestran el nuevo valor. La etapa debe seguir igual.
6. Pulsa «Volver a candidaturas» y comprueba el nuevo estado en la fila de prueba.
7. Abre otra vez el detalle y recarga la página: el estado debe mantenerse.
8. Repite con las otras opciones: «Recibida», «Seleccionada» y «Descartada», solo sobre el registro de prueba.

**Resultado esperado:** seleccionar un estado distinto lo guarda automáticamente. Durante el envío aparece «Actualizando…» y ambos desplegables se bloquean. El estado se actualiza sin recarga completa y no modifica la etapa.

### 7. Cambiar la etapa desde «Ver detalle»

1. En «Proceso de selección», anota el valor de «Estado actual».
2. En «Etapa actual», selecciona una opción diferente, por ejemplo «En revisión».
3. Espera a «Candidatura actualizada correctamente».
4. Comprueba la nueva etiqueta en el desplegable y en el campo «Etapa» del detalle. El estado debe permanecer igual.
5. Vuelve al listado para comprobar la etiqueta de la fila; abre de nuevo el detalle y recarga para verificar que se conservó.
6. Repite con «Pendiente de revisión», «Entrevista personal», «Entrevista técnica» y «Oferta presentada» sobre la candidatura de prueba.

**Resultado esperado:** el cambio se guarda con una sola selección, sin botón «Guardar». Los controles se bloquean mientras aparece «Actualizando…», y cambiar etapa no modifica el estado.

### 8. Editar los datos de una candidatura

1. Abre «Ver detalle» de la candidatura de prueba y pulsa «Editar candidatura».
2. Comprueba que el formulario contiene los valores guardados.
3. Cambia el nombre a `Candidatura de prueba UI editada` y la experiencia a `4`.
4. Pulsa «Guardar cambios» y espera a «Datos guardados correctamente».
5. Comprueba que el formulario se cierra y el detalle muestra el nombre y experiencia nuevos. El resto de los datos debe seguir igual.
6. Repite la edición para probar email, teléfono y puesto, siempre con datos ficticios.
7. Añade direcciones HTTP/HTTPS de prueba autorizadas en LinkedIn y CV y guarda. Activa «Mostrar datos de contacto» y pulsa «Abrir LinkedIn» y «Abrir CV»: deben abrir una pestaña nueva con la dirección guardada.
8. Vuelve a editar, vacía ambos enlaces y guarda: al mostrar el contacto deben indicar «No disponible».
9. Recarga el detalle y abre de nuevo el formulario para comprobar que los cambios persisten.

**Resultado esperado:** durante el envío aparece «Guardando…» y no se puede modificar el formulario. Al terminar se actualiza el detalle sin recarga completa. Estado y etapa se cambian con sus desplegables del detalle, no con este formulario.

### 9. Cancelar registro y edición

1. En el listado, pulsa «Nueva candidatura», escribe un nombre ficticio y pulsa «Cancelar» sin registrar.
2. Comprueba que vuelves al listado y que no aparece una nueva candidatura con ese nombre.
3. Abre una candidatura de prueba, pulsa «Editar candidatura» y modifica el nombre sin guardar.
4. Pulsa «Cancelar». El detalle debe conservar el nombre anterior.
5. Abre de nuevo «Editar candidatura»: debe seguir mostrando los datos guardados, no el cambio cancelado.

**Resultado esperado:** cancelar no guarda ni crea registros.

### 10. Validar registro y edición

Ejecuta cada caso primero en «Nueva candidatura» y después en «Editar candidatura» sobre el registro de prueba. Mantén válidos los demás campos y pulsa «Registrar candidatura» o «Guardar cambios», según la pantalla. Corrige el campo antes de pasar al siguiente caso.

| Acción en el formulario | Resultado visible esperado |
| --- | --- |
| Vacía el nombre, email, teléfono, puesto o experiencia, uno cada vez | El navegador solicita completar el campo; no se cierra el formulario ni aparece éxito |
| Escribe solo espacios en nombre, teléfono o puesto | Aparece «Completa todos los campos obligatorios» |
| Escribe `correo-invalido` en Email | El navegador o formulario indica que el email no es válido |
| Escribe `-1` en Años de experiencia | Se impide guardar por ser negativo |
| Deja vacía la experiencia | Se solicita completarla; no se guarda como cero |
| Escribe `0` o `2.5` en experiencia, con el resto válido | La validación local permite guardar; comprueba si el servicio lo acepta y conserva el valor |
| Escribe `no-es-una-url` en LinkedIn o CV | Se impide guardar y se señala una dirección inválida |
| Escribe `ftp://example.com/cv` en un enlace | Se indica que solo se permiten direcciones HTTP/HTTPS |
| Deja LinkedIn y CV vacíos con el resto válido | Se permite guardar; en el detalle, al mostrar contacto, indican «No disponible» |
| Intenta introducir más de 200 caracteres en nombre o puesto, 254 en email o 40 en teléfono | El campo limita la entrada al máximo correspondiente |

**Resultado esperado:** los datos inválidos no se guardan. En edición, pulsa «Cancelar» tras un intento inválido y comprueba que el detalle conserva los valores anteriores. Los mensajes nativos del navegador pueden variar según su idioma. No se exige un formato telefónico específico, más allá de obligatoriedad y longitud.

### 11. Consultar las notas internas

1. Abre «Ver detalle» de la candidatura de prueba y baja a «Notas internas».
2. Si todavía no tiene notas, comprueba que aparece «Sin notas internas» y un contador de cero.
3. Si ya tiene notas de prueba, comprueba que cada una muestra contenido y fecha, y que el contador coincide con el número de notas visibles.
4. Vuelve al listado general: no debe mostrar el contenido de las notas.

**Resultado esperado:** las notas aparecen únicamente en el detalle. Su carga muestra «Cargando notas…» antes del resultado cuando la conexión permite observarlo.

### 12. Añadir notas y comprobar validación

1. En el detalle, escribe `Nota interna de prueba UI` en «Nueva nota».
2. Pulsa «Añadir nota» una sola vez.
3. Espera a «Nota añadida correctamente» y a que termine de actualizarse la lista.
4. Comprueba que aparece el texto con su fecha, el campo queda vacío y el contador aumenta en uno.
5. Recarga el detalle: la nota debe seguir visible.
6. Añade otra nota de prueba con varios párrafos y comprueba que conserva los saltos de línea.
7. Deja «Nueva nota» vacía y después escribe solo espacios: «Añadir nota» debe permanecer deshabilitado en ambos casos.
8. Intenta introducir más de 10000 caracteres ficticios: el campo debe limitar la entrada. No es necesario guardar ese texto largo.

**Resultado esperado:** durante el envío aparece «Añadiendo…» y se bloquean las operaciones de notas. Una nota vacía no se puede guardar. Si aparece éxito pero falla la actualización de la lista, pulsa «Reintentar» en las notas; no envíes de nuevo el mismo texto sin comprobar si ya está guardado.

### 13. Cancelar y confirmar la eliminación de una nota

1. Localiza una nota creada por ti para estas pruebas y pulsa su botón «Eliminar nota».
2. Comprueba que aparece «¿Eliminar esta nota definitivamente?» y que la nota todavía está visible.
3. Pulsa «Cancelar»: la confirmación desaparece y la nota permanece, sin cambiar el contador.
4. Vuelve a «Eliminar nota» y esta vez pulsa «Eliminar» en la confirmación.
5. Espera a «Nota eliminada correctamente». La nota debe desaparecer y el contador disminuir en uno.
6. Recarga el detalle y comprueba que la nota no vuelve a aparecer.

**Resultado esperado:** solo confirmar elimina la nota. Mientras se elimina aparece «Eliminando…» y se bloquean las operaciones de notas. La acción es irreversible; nunca pruebes sobre notas reales.

### 14. Candidatura inexistente

1. Abre en el navegador la ruta del frontend `/candidates/id-inexistente-para-pruebas`.
2. Si ese identificador no existe, comprueba el mensaje «La candidatura o nota ya no está disponible» y el botón «Reintentar».
3. Pulsa «Reintentar»: debe volver a intentar la carga y mostrar el mismo error si la candidatura sigue sin existir.
4. Pulsa «Volver a candidaturas» y abre una candidatura existente con «Ver detalle».

**Resultado esperado:** el error no queda en silencio, no aparecen controles de edición para datos inexistentes y puedes regresar al listado. «Reintentar» no crea candidaturas ni corrige un ID equivocado. El indicador «Insight» pertenece al desarrollo de Next.js; no es el resultado de esta prueba.

### 15. Observar carga y evitar envíos repetidos

Si la conexión es rápida, algunos indicadores pueden durar demasiado poco para observarlos. Opcionalmente, abre `F12`, entra en «Red / Network» y selecciona «Slow 3G». No escribas peticiones ni inspecciones respuestas: realiza las acciones normales en la UI.

| Acción en la UI | Resultado durante la espera |
| --- | --- |
| Pulsa «Actualizar listado» | Aparece «Cargando candidaturas…» |
| Abre «Ver detalle» | Aparece «Cargando candidatura…»; también puede aparecer «Cargando…» durante la navegación |
| Espera a la sección de notas del detalle | Aparece «Cargando notas…» |
| Cambia estado o etapa | Aparece «Actualizando…» y ambos desplegables quedan bloqueados |
| Registra o guarda una edición | Aparece «Guardando…» y los campos y botones quedan bloqueados |
| Añade una nota | Aparece «Añadiendo…» y los controles de notas quedan bloqueados |
| Confirma eliminar una nota | Aparece «Eliminando…» y los controles de notas quedan bloqueados |

Intenta pulsar de nuevo el mismo botón mientras está bloqueado: no debe producir otra acción. Al completarse, comprueba que no aparecen candidaturas o notas duplicadas. Una espera superior al límite de 15 segundos puede terminar en error. Devuelve la conexión a «Sin limitación / No throttling» al finalizar.

### 16. Errores de conexión y recuperación desde los controles

Carga primero la pantalla que vas a probar. Opcionalmente, usa `F12` > «Red / Network» > «Offline / Sin conexión» para simular la desconexión **antes** de pulsar guardar o cambiar una opción. No recargues toda la app estando offline para estos casos: perderías la pantalla cargada que necesitas probar.

| Pantalla y pasos en la UI | Resultado visible esperado |
| --- | --- |
| Listado: activa Offline y pulsa «Actualizar listado» | Mensaje de conexión y botón «Reintentar» |
| Listado con error: recupera conexión y pulsa «Reintentar» | Las candidaturas vuelven a aparecer |
| Detalle cargado: activa Offline y cambia el estado | Error visible, controles disponibles otra vez y estado anterior conservado |
| Detalle cargado: activa Offline y cambia la etapa | Error visible, controles disponibles otra vez y etapa anterior conservada |
| Formulario de registro completo: activa Offline y pulsa «Registrar candidatura» | Error visible y campos escritos conservados para reintentar |
| Formulario de edición: modifica un dato, activa Offline y pulsa «Guardar cambios» | Error visible, formulario abierto y modificación escrita conservada |
| Notas: escribe un texto, activa Offline y pulsa «Añadir nota» | Error visible y borrador conservado |
| Nota de prueba: activa Offline antes de confirmar «Eliminar» | Error visible y nota todavía presente |

Después de cada fallo, recupera la conexión y vuelve a realizar la acción desde la UI. Debe completarse y aparecer su mensaje de éxito; la app no reenvía escrituras automáticamente. Si la conexión se interrumpió después de enviar datos, vuelve primero al listado o recarga el detalle con conexión para comprobar si ya se guardaron, evitando duplicados.

Para verificar por separado un error de carga del detalle o de las notas, se necesita un entorno de pruebas donde el responsable del backend pueda provocar ese fallo. Abre la candidatura desde el listado y comprueba el mensaje y «Reintentar». Si fallan solo las notas, los datos del candidato deben seguir visibles y «Reintentar» de las notas debe recuperar esa sección cuando el servicio vuelva a funcionar. No cambies la configuración de la app ni credenciales para provocar errores.

### 17. Uso en móvil y con teclado

1. Abre la app en una pantalla estrecha y realiza registro, «Ver detalle», cambio de estado y etapa, edición y gestión de notas sobre datos de prueba.
2. Comprueba que puedes leer los campos, pulsar los botones y ver los mensajes. La tabla permite desplazamiento horizontal dentro de su contenedor.
3. En escritorio, usa Tab para recorrer los controles, el teclado para elegir opciones y Enter para activar botones o enlaces. Comprueba que se distingue el foco.
4. Comprueba que las opciones de estado y etapa siguen mostrando etiquetas legibles, no sus valores internos.

**Resultado esperado:** las mismas operaciones están disponibles sin botones o campos inaccesibles por el tamaño de pantalla y sin depender exclusivamente del ratón.

### Qué integración comprueba cada acción

Esta tabla es solo una referencia: las pruebas se ejecutan con los controles descritos, no escribiendo estas rutas en el navegador.

| Acción probada en la UI | Integración con la API |
| --- | --- |
| Entrar en Candidaturas o «Actualizar listado» | `GET /records`, incluyendo todas las páginas |
| Abrir «Ver detalle» | `GET /records/:id` |
| Cambiar «Estado actual» | `PATCH /records/:id` |
| Cambiar «Etapa actual» | `PATCH /records/:id` |
| «Registrar candidatura» | `POST /records` |
| «Guardar cambios» en la edición | `PUT /records/:id` en plural |
| Ver «Notas internas» | `GET /records/:id/notes` |
| «Añadir nota» | `POST /records/:id/notes` |
| Confirmar «Eliminar» en una nota | `DELETE /records/:id/notes/:note_id` |

### Límites y registro de resultados

- La UI no tiene un botón para eliminar candidaturas. Coordina con el responsable de la API la limpieza de los registros ficticios; desde la app puedes eliminar únicamente las notas de prueba.
- No provoques duplicados, límites de peticiones ni fallos de permisos en la API compartida. Los casos de rechazo del servidor necesitan un entorno autorizado que los reproduzca; comprueba entonces el error visible y que no aparece un éxito falso.
- Un listado vacío, la paginación y fallos de carga independientes requieren datos o condiciones adecuados. Si no están disponibles, marca el caso como «No probado», no como «Correcto».
- Esta guía comprueba resultados observables y persistencia, no verifica por sí sola códigos HTTP, seguridad del backend ni filtros del servidor.
- Anota cada ejecución sin datos personales usando esta plantilla:

| Fecha | Caso de prueba | Acción realizada en la UI | Resultado observado | Correcto / Fallo / No probado |
| --- | --- | --- | --- | --- |
| AAAA-MM-DD | Cambiar estado | Elegir «En proceso» en la candidatura ficticia | Mensaje de éxito y estado conservado al reabrir | Por completar |

