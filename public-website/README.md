# Nexova: sitio publico

Migracion de los tres HTML originales a Next.js App Router y React con
TypeScript. Se conservan contenido, fuentes, metadatos, popovers y Tailwind.

## Requisitos

- Node.js 22 LTS y npm.
- Acceso a internet para instalar dependencias y cargar las fuentes de Google.
- Ejecutar desde este repositorio: el formulario estructurado reutiliza la
	disponibilidad de [collections.ts](../src/utils/collections.ts).

## Levantar en desarrollo

Desde la raiz del repositorio:

```sh
cd public-website
npm install
npm run dev 
```

Abrir [http://localhost:3001](http://localhost:3001). El servidor actualiza
la pagina al editar los archivos. Detenerlo con `Ctrl+C` en la terminal.

El puerto 3001 permite ejecutar el sitio junto al backoffice, cuyo enlace
actual usa el 3000. Si esta ocupado, sustituirlo por otro, por ejemplo 3002.
Si la terminal ya esta dentro de este directorio, omitir `cd public-website`.

Una vez sincronizado el archivo de bloqueo con las dependencias, se puede
usar `npm ci` para instalaciones reproducibles.

## Levantar en produccion

Desde este directorio, con las dependencias instaladas:

```sh
npm run build
npm run start
```

`start` requiere que `build` termine correctamente. Estas instrucciones
ejecutan el servidor local; no despliegan el sitio en un servicio externo.

## Comprobaciones

```sh
npx tsc --noEmit
npm run lint
```

El primer comando comprueba los tipos; el segundo ejecuta ESLint.

## Versiones

Como en el backoffice: Next 16.4.3, React y React DOM 19.3.0,
Tailwind y su plugin PostCSS ^4, TypeScript ^5.

## Funcionalidades

### Inicio: `/`

Presenta la consultora, su evolucion, servicios, tecnologia interna, proceso,
beneficios y datos de contacto. Incluye navegacion por secciones, menu movil
y enlaces al formulario estructurado y vacantes.

El formulario empresarial solicita nombre, cargo opcional, empresa, email,
servicio, tamano de empresa y mensaje. Valida campos obligatorios, formato
del email y un mensaje de al menos 20 caracteres. Muestra errores por campo,
un estado de envio con el boton deshabilitado y confirmacion local tras 900 ms.

### Solicitud estructurada: `/formulario`

Permite elegir entre una empresa que busca talento y un candidato que desea
postular. Las validaciones y los campos obligatorios cambian segun la opcion:

- Datos comunes: nombre completo de al menos 5 caracteres, email valido,
	telefono de 9 a 15 digitos con prefijo opcional, pais, ciudad, perfil o
	posicion, area profesional y mensaje de al menos 20 caracteres.
- Empresas: nombre y tamano de compania obligatorios, y correo corporativo;
	se rechazan proveedores personales como Gmail, Yahoo y Outlook.
- Candidatos: experiencia entre 0 y 45 anos, idioma nativo y nivel de ingles
	obligatorio cuando el idioma nativo es otro.
- Candidatos: modalidad preferida, moneda, salario anual entre 12.000 y
	500.000 y disponibilidad de incorporacion obligatorios.
- LinkedIn es opcional; para candidatos, si se indica, debe comenzar con
	`https://` y pertenecer a `linkedin.com`.
- CV obligatorio para candidatos: PDF, DOC o DOCX de hasta 5 MB. Si una
	empresa adjunta un archivo, tambien se valida su formato y tamano.
- Consentimientos obligatorios: privacidad, contacto y veracidad de datos.

Muestra validacion al interactuar con los campos, enfoca el primer campo
invalido al enviar y permite limpiar el formulario. La confirmacion distingue
entre empresas y candidatos y restablece los campos.

### Vacantes: `/vacantes`

Muestra las ofertas originales y sus detalles en popovers nativos del navegador.
Incluye un formulario de postulacion con nombre, email, prefijo internacional,
telefono local, CV, ingles, experiencia, seniority, disponibilidad, expectativa
salarial y habilidades.

- Nombre completo de al menos 5 caracteres y email valido.
- Prefijo obligatorio; numero local de al menos 6 digitos y telefono completo
	de 9 a 15 digitos. Admite espacios, parentesis y guiones en el numero local.
- CV obligatorio en PDF, DOC o DOCX de hasta 5 MB.
- Ingles, experiencia, seniority, disponibilidad y habilidades obligatorios.
- Expectativa salarial en USD: solo digitos; elimina letras y simbolos al escribir.

Muestra errores por campo, enfoca el primer error al enviar y restablece los
datos tras una confirmacion local. Los botones permiten abrir y cerrar los
detalles y el formulario sin navegar a otra pagina.

### Presentacion y accesibilidad

Conserva las utilidades Tailwind y el diseno adaptable a movil y escritorio.
Incluye metadatos SEO y sociales, datos estructurados de la organizacion,
etiquetas de campos, estados `aria-invalid` y mensajes accesibles de resultado.

## Estructura

- [src/app/page.tsx](src/app/page.tsx): pagina principal.
- [src/app/formulario/page.tsx](src/app/formulario/page.tsx): solicitud estructurada.
- [src/app/vacantes/page.tsx](src/app/vacantes/page.tsx): vacantes y detalles.
- [src/components/contact-form.tsx](src/components/contact-form.tsx): consulta empresarial.
- [src/components/application-form.tsx](src/components/application-form.tsx): solicitud estructurada.
- [src/components/vacancy-application-form.tsx](src/components/vacancy-application-form.tsx): postulacion.
- [src/hooks/use-validated-form.ts](src/hooks/use-validated-form.ts): controlador compartido de validacion.
- [src/lib/contact-validation.ts](src/lib/contact-validation.ts), [src/lib/application-validation.ts](src/lib/application-validation.ts)
	y [src/lib/vacancy-validation.ts](src/lib/vacancy-validation.ts): reglas TypeScript.

## Limitaciones actuales

Los envios siguen siendo demostrativos, sin API ni persistencia: la consulta
principal simula 900 ms de espera; los otros formularios muestran confirmacion
local inmediata, como sus versiones originales. No se guardan datos ni adjuntos.
Las confirmaciones no significan que Nexova haya recibido una solicitud real.

La gestion de proveedores pertenece exclusivamente al backoffice y no se
incluye en la navegacion de la web publica.

Los enlaces internos usan las rutas Next.js. No se incluyen redirecciones desde
las URLs HTML antiguas. Los HTML y el JavaScript originales permanecen sin
modificar; su eliminacion queda fuera de esta documentacion.
