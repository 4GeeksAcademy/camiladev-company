# Nexova Solutions Web Experience

Sitio corporativo para la empresa ficticia Nexova Solutions, consultora B2B de RRHH con enfoque en IA, headhunting, outsourcing de soporte al cliente y formacion corporativa.

## Tecnologias usadas

- HTML5 semantico
- Tailwind CSS via script `@tailwindcss/browser@4`
- JavaScript Vanilla (modular)
- SEO tecnico on-page + Open Graph
- Schema.org JSON-LD (Organization y LocalBusiness)

## Estructura del proyecto

```text
.
├── index.html          # Landing page corporativa
├── application.html    # Formulario de aplicacion/registro
├── validation.js       # Menu movil + validaciones y UX del formulario
└── README.md           # Documentacion tecnica
```

## Instalacion y ejecucion

1. Asegura tener Node.js 18+ instalado.
2. Desde la raiz del proyecto ejecuta:

```bash
npx serve .
```

3. Abre la URL local mostrada por el comando (normalmente `http://localhost:3000`).

## Funcionalidades principales

- Landing profesional y responsive con secciones de negocio:
	- Hero con propuesta de valor HR Tech + IA
	- Servicios de Nexova
	- Beneficios operativos
	- Metricas corporativas
	- Testimonios B2B
	- Contacto y CTA final
- Navegacion responsive con menu hamburguesa accesible.
- Pagina independiente de formulario con campos alineados al contexto real del negocio.
- Validacion robusta del formulario:
	- En tiempo real
	- Al perder foco
	- En envio
- Mensajes de error especificos y accesibles.
- Simulacion de envio exitoso sin backend.
- Boton para limpiar formulario y restablecer estados.

## Decisiones tecnicas

- Se uso Tailwind CSS para todos los estilos, sin hojas CSS personalizadas.
- Se eligio una arquitectura JS por funciones desacopladas:
	- `setupMobileMenu()` para navegacion movil.
	- `setupApplicationForm()` para validaciones, estados y envio simulado.
- Las reglas de validacion se centralizan en un objeto para facilitar mantenimiento.

## Enfoque responsive

- Estrategia mobile-first.
- Breakpoints aplicados: `sm`, `md`, `lg`, `xl`.
- Layouts adaptativos con grids y flex segun contexto visual de cada seccion.
- CTA y bloques de contenido optimizados para lectura y accion en movil.

## Enfoque de accesibilidad

- Uso de etiquetas semanticas: `header`, `nav`, `main`, `section`, `article`, `footer`, `fieldset`, `legend`.
- Asociacion correcta de `label` con controles de formulario.
- Soporte de teclado completo (menu y formulario).
- Indicadores de foco visibles.
- Mensajes de error conectados mediante `aria-describedby`.
- Regions `aria-live` para feedback de validacion y estado de envio.

## Enfoque SEO

- `title` y `meta description` orientados a intencion de busqueda B2B.
- Meta tags Open Graph y Twitter Card.
- Jerarquia de headings coherente (`h1` unico + `h2/h3` por seccion).
- Schema.org en JSON-LD con:
	- `Organization`
	- `LocalBusiness`
	- Datos de contacto y ubicaciones de Valencia y Miami

## Notas

- El input de CV es una simulacion frontend y no sube archivos a ningun servidor.
- No se implementa backend en este entregable.
