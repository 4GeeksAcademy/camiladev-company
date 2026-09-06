# Propuesta de arquitectura para Nexova TalentFlow AI

## 1. Contexto y objetivos

Nexova TalentFlow AI es una plataforma SaaS orientada a centralizar y automatizar las operaciones de Nexova Solutions. La plataforma debe integrar varios dominios:

- Reclutamiento y seguimiento de candidatos.
- Matching semántico entre candidatos y vacantes.
- Comunicación automática con candidatos, clientes y recruiters.
- Ventas y gestión de oportunidades comerciales.
- Atención al cliente y base de conocimiento.
- Formación corporativa.
- Recursos humanos internos.
- Marketing y analítica ejecutiva.
- Agentes de inteligencia artificial especializados.
- Integraciones con servicios externos como email, CRM y proveedores de IA.

La arquitectura debe permitir desarrollar estos dominios de forma independiente, manteniendo una base tecnológica sencilla de operar para un equipo pequeño o mediano. También debe soportar el crecimiento progresivo de la plataforma sin introducir desde el inicio la complejidad de una arquitectura de microservicios.

Los principales objetivos arquitectónicos son:

1. Separar claramente las responsabilidades del sistema.
2. Evitar que los distintos departamentos queden acoplados entre sí.
3. Facilitar la incorporación de nuevos módulos y agentes de IA.
4. Permitir procesar tareas largas de forma asíncrona.
5. Mantener una API clara y consistente para el frontend.
6. Proteger la información sensible de candidatos, clientes y empleados.
7. Hacer posible la evolución gradual hacia servicios independientes cuando sea necesario.

---

## 2. Patrón arquitectónico seleccionado

## Arquitectura modular monolítica en capas, orientada a dominios

El backend se organizará como un **monolito modular** con una arquitectura en capas y separación explícita por dominios de negocio.

Este enfoque combina:

- **Arquitectura por capas**, para separar presentación, aplicación, dominio e infraestructura.
- **Organización por dominios**, para que cada área funcional tenga sus propios módulos.
- **Procesamiento asíncrono basado en eventos**, para emails, análisis de CVs, generación de embeddings, notificaciones y tareas de IA.
- **API REST con FastAPI**, como punto principal de comunicación con el frontend y otros clientes.
- **Servicios externos desacoplados mediante adaptadores**, evitando que la lógica de negocio dependa directamente de proveedores concretos.

La arquitectura no será un monolito completamente desorganizado. Aunque inicialmente se desplegará como una aplicación backend única, sus dominios estarán aislados mediante límites claros. Esto permitirá extraer posteriormente determinados módulos a microservicios si su volumen, complejidad o necesidad de escalabilidad lo justifican.

### Representación general

```text
Frontend web / Portales / Clientes externos
                  |
                  v
           API REST - FastAPI
                  |
                  v
        Routers y esquemas HTTP
                  |
                  v
       Servicios de aplicación
                  |
                  v
     Módulos de dominio y reglas de negocio
                  |
                  v
Repositorios, proveedores e integraciones externas
                  |
                  v
 PostgreSQL | Redis | almacenamiento de archivos
                  |
                  v
 Worker asíncrono y sistema de eventos


 ## 3. Estructura del backend

El backend seguirá una organización modular basada en dominios de negocio y responsabilidades técnicas. Cada módulo tendrá sus propios routers, esquemas, modelos y servicios.

```text
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── api/
│   │   ├── deps.py
│   │   └── v1/
│   │       └── router.py
│   ├── modules/
│   │   ├── auth/
│   │   ├── recruitment/
│   │   ├── support/
│   │   ├── sales/
│   │   ├── hr/
│   │   ├── analytics/
│   │   └── ai/
│   ├── integrations/
│   │   ├── email/
│   │   ├── llm/
│   │   ├── storage/
│   │   └── crm/
│   └── workers/
├── tests/
├── alembic/
├── pyproject.toml
└── .env.example
```

### Criterio de separación

La separación se realizará principalmente por **dominio de negocio**:

- `auth`: usuarios, autenticación, roles y permisos.
- `recruitment`: candidatos, vacantes, aplicaciones y entrevistas.
- `support`: tickets y base de conocimiento.
- `sales`: leads, clientes y oportunidades.
- `hr`: empleados y procesos internos.
- `analytics`: métricas y dashboards.
- `ai`: scoring de CVs, búsqueda semántica, RAG y agentes de IA.

Cada módulo podrá organizarse internamente de la siguiente manera:

```text
recruitment/
├── router.py
├── schemas.py
├── models.py
├── service.py
├── database.py
└── use_cases/
```

- `router.py`: endpoints HTTP del módulo.
- `schemas.py`: modelos Pydantic de entrada y salida.
- `models.py`: modelos de persistencia.
- `service.py`: lógica de aplicación.
- `database.py`: acceso a la base de datos.
- `use_cases/`: operaciones importantes del negocio.

Esta separación evita mezclar la lógica de reclutamiento con la de soporte, ventas o recursos humanos.

---

## 4. Organización de endpoints y routers de FastAPI

Los endpoints se agruparán por dominio y estarán versionados mediante el prefijo `/api/v1`.

```text
/api/v1/auth
/api/v1/recruitment
/api/v1/support
/api/v1/sales
/api/v1/hr
/api/v1/analytics
/api/v1/ai
```

### Rutas principales

#### Autenticación

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
GET  /api/v1/auth/me
```

#### Reclutamiento

```text
GET   /api/v1/recruitment/candidates
POST  /api/v1/recruitment/candidates
GET   /api/v1/recruitment/candidates/{candidate_id}
POST  /api/v1/recruitment/candidates/{candidate_id}/documents

GET   /api/v1/recruitment/jobs
POST  /api/v1/recruitment/jobs
GET   /api/v1/recruitment/applications
PATCH /api/v1/recruitment/applications/{application_id}/status
```

#### Soporte

```text
GET  /api/v1/support/tickets
POST /api/v1/support/tickets
GET  /api/v1/support/tickets/{ticket_id}
POST /api/v1/support/tickets/{ticket_id}/messages
```

#### Inteligencia artificial

```text
POST /api/v1/ai/candidates/{candidate_id}/score
POST /api/v1/ai/search
POST /api/v1/ai/assistants/{assistant_type}/messages
GET  /api/v1/ai/tasks/{task_id}
```

Los routers solo deben encargarse de:

1. Recibir y validar la petición.
2. Comprobar autenticación y permisos.
3. Llamar al servicio o caso de uso correspondiente.
4. Devolver una respuesta mediante un esquema Pydantic.

La lógica de negocio y las consultas a la base de datos no deben escribirse directamente dentro de los routers.

---

## 5. Convenciones habituales de FastAPI

La estructura propuesta sigue convenciones comunes de proyectos FastAPI:

- `main.py` contiene la instancia principal de FastAPI.
- Los routers se separan por dominio funcional.
- `schemas.py` contiene los modelos Pydantic.
- `models.py` contiene los modelos de base de datos.
- `config.py` centraliza la configuración de la aplicación.
- `database.py` gestiona la conexión a la base de datos.
- `deps.py` contiene dependencias reutilizables, como el usuario autenticado.
- `tests/` se divide en pruebas unitarias, de integración y de API.
- Las operaciones largas, como el análisis de CVs o la generación de embeddings, se ejecutan mediante workers asíncronos.

Esta organización facilita que los archivos sean fáciles de localizar y que cada componente tenga una responsabilidad concreta.

---

## 6. Separación entre frontend y backend

El frontend y el backend se tratarán como sistemas separados. Pueden mantenerse en un monorepo:

```text
project/
├── frontend/
└── backend/
```

También podrían utilizarse repositorios independientes si los equipos o ciclos de despliegue crecen.

La comunicación entre ambos sistemas se realizará mediante una API REST documentada automáticamente por FastAPI y OpenAPI.

```text
Frontend
   |
   | HTTP/HTTPS + JSON
   v
Backend FastAPI
   |
   v
Base de datos, servicios de IA e integraciones externas
```

El frontend no tendrá acceso directo a:

- PostgreSQL.
- Redis.
- Proveedores de inteligencia artificial.
- Almacenamiento interno.
- Servicios privados del backend.

Para tareas largas, el backend podrá responder con el estado de una tarea:

```text
pending
processing
completed
failed
```

Esto será útil para analizar CVs, generar embeddings, procesar documentos o generar informes.

---

## 7. Configuración, variables de entorno y CORS

La configuración se gestionará mediante variables de entorno. Los valores sensibles no deben incluirse en el código fuente.

Ejemplo de variables:

```text
APP_ENV=development
DATABASE_URL=
SECRET_KEY=
JWT_SECRET_KEY=
CORS_ALLOWED_ORIGINS=
REDIS_URL=
LLM_API_KEY=
EMAIL_API_KEY=
CRM_API_KEY=
```

El archivo `.env.example` solo contendrá los nombres de las variables y valores de ejemplo. Las claves reales se configurarán en cada entorno de ejecución.

La política CORS permitirá únicamente los dominios conocidos del frontend:

- Desarrollo: `http://localhost:3000`.
- Staging: dominio de pruebas.
- Producción: dominio oficial de Nexova.

No se recomienda utilizar `allow_origins=["*"]` en producción, especialmente si se utilizan credenciales o cookies.

---

## 8. Riesgos y puntos de atención

### 8.1 Routers con demasiada lógica

Si los routers contienen consultas SQL, reglas de negocio y llamadas a servicios externos, el código se volverá difícil de probar y mantener.

**Prevención:** mantener los routers delgados y delegar la lógica a servicios, casos de uso y repositorios.

### 8.2 Mezcla de responsabilidades entre dominios

Si los módulos comparten directamente sus modelos y lógica interna, los cambios en reclutamiento pueden afectar a soporte, ventas o RRHH.

**Prevención:** separar los dominios y comunicarlos mediante servicios, interfaces o eventos bien definidos.

### 8.3 Procesos de IA ejecutados dentro de una petición

El análisis de CVs y la generación de embeddings pueden tardar demasiado y provocar errores de timeout.

**Prevención:** utilizar workers y colas para ejecutar estas operaciones de forma asíncrona.

### 8.4 Exposición de información sensible

Los CVs, datos de candidatos y documentos de empleados contienen información privada.

**Prevención:** aplicar autenticación, autorización por roles, control por organización, esquemas de respuesta específicos y logs sin datos sensibles.

### 8.5 Configuración insegura de CORS y secretos

Una política CORS demasiado permisiva o claves almacenadas en el repositorio podría comprometer la aplicación.

**Prevención:** usar variables de entorno, gestores de secretos y una lista explícita de orígenes permitidos.

### 8.6 Contratos inestables entre frontend y backend

Cambios inesperados en los endpoints pueden romper los portales de candidatos, recruiters y clientes.

**Prevención:** versionar la API, mantener la documentación OpenAPI actualizada y comunicar los cambios incompatibles.

---

## 9. Conclusión

La arquitectura modular monolítica en capas es adecuada para Nexova TalentFlow AI porque permite centralizar múltiples áreas de negocio sin introducir inicialmente la complejidad de los microservicios.

La separación por dominios, la organización de routers de FastAPI, el uso de servicios y repositorios, y la comunicación mediante una API versionada permitirán que el sistema sea más fácil de desarrollar, probar y mantener.

Además, esta estructura deja abierta la posibilidad de separar en el futuro aquellos módulos que necesiten escalar de forma independiente, como inteligencia artificial, notificaciones o analítica.