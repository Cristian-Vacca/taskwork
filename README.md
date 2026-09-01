# taskwork
# Descripción general

Plataforma web para la gestión personal de tareas, desarrollada bajo una arquitectura monolítica modular. El sistema permite a los usuarios administrar sus tareas de forma organizada, asignándoles fechas límite, prioridades y categorías, con acceso a la información desde diferentes dispositivos mediante una cuenta de usuario.

# Objetivo

Desarrollar una plataforma web que permita a los usuarios crear, consultar, editar, organizar y eliminar tareas de manera sencilla, facilitando el seguimiento de sus actividades y su gestión desde diferentes dispositivos.

# Alcance

El sistema permitirá:

* Crear, editar y eliminar tareas.
* Asignar fecha límite y prioridad a cada tarea.
* Agrupar tareas mediante categorías.
* Asociar las tareas a una cuenta de usuario.
* Consultar las tareas desde diferentes dispositivos.
* Gestionar las tareas desde un panel principal.

**Exclusiones:** El proyecto se desarrollará únicamente como plataforma web y no contempla aplicaciones nativas para iOS o Android.
# Gestión de Tareas

## 1. Estructura del proyecto

El proyecto utiliza una **arquitectura monolítica modular**, organizando el sistema en módulos independientes de acuerdo con las principales funcionalidades del negocio.

### Frontend

El frontend será desarrollado con **TypeScript** y estará organizado por módulos funcionales:

```text
frontend/
└── src/
    ├── app/
    │   ├── routes/
    │   ├── providers/
    │   └── config/
    │
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── tasks/
    │   ├── categories/
    │   └── dashboard/
    │
    ├── components/
    │   ├── Button/
    │   ├── Input/
    │   ├── Modal/
    │   ├── Select/
    │   └── Layout/
    │
    ├── services/
    │   └── api/
    │
    ├── types/
    └── utils/
```

**Módulos principales:**

* **Auth:** registro e inicio de sesión.
* **Users:** gestión de información del usuario.
* **Tasks:** creación, consulta, edición y eliminación de tareas.
* **Categories:** organización de tareas mediante categorías.
* **Dashboard:** visualización y gestión de las tareas desde el panel principal.

### Backend

El backend será desarrollado en **Python** y estará organizado por módulos y responsabilidades:

```text
backend/
└── app/
    ├── core/
    │   ├── config.py
    │   ├── security.py
    │   └── database.py
    │
    ├── modules/
    │   ├── auth/
    │   │   ├── router.py
    │   │   ├── service.py
    │   │   ├── repository.py
    │   │   ├── schemas.py
    │   │   └── models.py
    │   │
    │   ├── users/
    │   ├── tasks/
    │   └── categories/
    │
    ├── shared/
    │   ├── exceptions/
    │   ├── middleware/
    │   └── utils/
    │
    └── tests/
```

Cada módulo utiliza las siguientes capas:

| Capa           | Responsabilidad                      |
| -------------- | ------------------------------------ |
| **Router**     | Gestiona las solicitudes HTTP        |
| **Service**    | Contiene la lógica del negocio       |
| **Repository** | Gestiona el acceso a PostgreSQL      |
| **Schemas**    | Define los datos de entrada y salida |
| **Models**     | Representa las entidades del sistema |

### Base de datos

Se utilizará **PostgreSQL** como sistema gestor de base de datos.

Las principales entidades serán:

```text
USERS
CATEGORIES
TASKS
```

Las tareas estarán asociadas a un usuario y podrán pertenecer a una categoría.

---

## 2. Lógica del proyecto

El sistema funciona mediante la interacción entre el **frontend**, el **backend** y la **base de datos**.

Cuando el usuario realiza una acción, el frontend envía una solicitud al backend. El backend valida la información, ejecuta las reglas de negocio y utiliza el repositorio correspondiente para realizar las operaciones sobre PostgreSQL.

### Flujo general

```text
Usuario
   ↓
Frontend
   ↓
API
   ↓
Router
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
   ↓
Respuesta
   ↓
Frontend
```

### Gestión de tareas

El módulo de tareas contempla las operaciones principales de:

* Crear tareas.
* Consultar tareas.
* Editar tareas.
* Eliminar tareas.

Cada tarea podrá contener:

```text
Título
Descripción
Fecha límite
Prioridad
Estado
Categoría
Usuario asociado
Fecha de creación
Fecha de actualización
```

Las tareas estarán vinculadas al usuario autenticado, permitiendo que cada usuario consulte únicamente sus propias tareas desde diferentes dispositivos.

### Proceso de creación de una tarea

```text
Usuario
   ↓
"+ Nueva tarea"
   ↓
Completa el formulario
   ↓
Presiona "Guardar"
   ↓
Frontend envía la solicitud
   ↓
Backend valida los datos
   ↓
Se crea la tarea
   ↓
PostgreSQL almacena la información
   ↓
La tarea aparece en la lista
```

---

## 3. Avances de arquitectura

La arquitectura definida para el proyecto es **monolítica modular**.

El sistema se mantiene como una única aplicación, pero sus funcionalidades están separadas en módulos independientes:

```text
Gestión de Tareas
│
├── Autenticación
├── Usuarios
├── Tareas
├── Categorías
└── Dashboard
```

La comunicación entre las capas del backend sigue el flujo:

```text
Router → Service → Repository → PostgreSQL
```

Esta organización permite separar responsabilidades, facilitar el mantenimiento y reducir el acoplamiento entre funcionalidades.

La arquitectura también permite que cada módulo pueda evolucionar de manera independiente dentro del mismo sistema monolítico.

---

## 4. Modelo de desarrollo

El proyecto utiliza **Scrum combinado con Kanban**.

**Scrum** permite organizar el desarrollo mediante iteraciones, priorización de funcionalidades y seguimiento de las tareas.

**Kanban** permite visualizar el estado de las actividades y controlar el flujo de trabajo mediante un tablero.

### Flujo de trabajo

```text
Backlog
   ↓
Por hacer
   ↓
En desarrollo
   ↓
En revisión
   ↓
Completado
```

Las funcionalidades se gestionan mediante **historias de usuario**, priorizando las características que aportan mayor valor al sistema.

---

## 5. Historias de usuario

Las historias de usuario definen los requerimientos funcionales desde la perspectiva del usuario.

### HU-01 — Creación de una tarea

**Como** usuario registrado,
**quiero** crear una nueva tarea,
**para** registrar y organizar una actividad pendiente.

#### Criterio de aceptación

```text
Dado que estoy en la pantalla principal de la aplicación,

Cuando presiono "+ Nueva tarea", ingreso el título
"Enviar reporte semanal", selecciono la fecha límite
"Mañana" y la prioridad "Alta", y presiono "Guardar",

Entonces la tarea se guarda correctamente y aparece
de primera en la lista de pendientes.
```

### HU-02 — Edición de una tarea

**Como** usuario registrado,
**quiero** editar una tarea existente,
**para** actualizar su información cuando sea necesario.

### HU-03 — Eliminación de una tarea

**Como** usuario registrado,
**quiero** eliminar una tarea,
**para** retirar actividades que ya no necesito gestionar.

### HU-04 — Organización por categorías

**Como** usuario registrado,
**quiero** asignar tareas a categorías,
**para** mantener mis actividades organizadas.

### HU-05 — Consulta de tareas

**Como** usuario registrado,
**quiero** visualizar mis tareas en el panel principal,
**para** conocer las actividades pendientes y su información.

### HU-06 — Gestión de cuenta

**Como** usuario,
**quiero** tener una cuenta personal,
**para** asociar mis tareas a mi usuario y consultarlas desde diferentes dispositivos.

---

## 6. Tecnologías

| Componente           | Tecnología         |
| -------------------- | ------------------ |
| Frontend             | TypeScript         |
| Backend              | Python             |
| Base de datos        | PostgreSQL         |
| Arquitectura         | Monolítica modular |
| Modelo de desarrollo | Scrum + Kanban     |

---

## 7. Documentación pendiente

Para esta entrega no se incluyen las siguientes secciones, ya que serán desarrolladas posteriormente:

* Presentación general del proyecto.
* Avances del proyecto.
* Evidencias de funcionamiento.

