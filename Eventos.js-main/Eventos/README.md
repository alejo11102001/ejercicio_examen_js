Proyecto de Gestión de Eventos - Single Page Application (SPA)
Este proyecto es una Single Page Application (SPA) diseñada para la gestión de eventos, permitiendo a los organizadores y visitantes interactuar con una serie de eventos. Incluye funcionalidades clave como autenticación de usuarios (administrador y visitante), gestión de rutas protegidas, persistencia de sesión y operaciones CRUD con una base de datos simulada (json-server).

Información del Coder
Nombre: Abrahan Taborda Echavarria

Clan: Van Rossum

Correo Electrónico: abrahan.1194@gmail.com

Documento de Identidad :1017225403

Nombre del Proyecto en package.json
El nombre del proyecto en package.json sigue el formato solicitado: [abrahantaborda403] 

Funcionalidades Principales
Sistema de Autenticación:

Registro de usuarios con roles de administrador y visitante.

Inicio de sesión para usuarios registrados.

Protección de rutas mediante un guardián en router.js para asegurar que solo los usuarios autorizados accedan a ciertas secciones.

Persistencia de Sesión:

Uso de localStorage para mantener la sesión iniciada y proporcionar una experiencia de usuario fluida.

La información del usuario se almacena en localStorage al iniciar sesión y persiste incluso al recargar la página.

Consistencia de Datos (con json-server):

La aplicación sincroniza correctamente las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) con la base de datos simulada (db.json a través de json-server).

Interfaz de Usuario (UI):

La SPA es responsiva y proporciona una experiencia de usuario fluida, utilizando Bootstrap para el estilizado.

Formularios intuitivos para registro, login y gestión de eventos.

Tipos de Usuarios:

Usuario Administrador:

Existe un usuario administrador por defecto en db.json (username: admin, password: adminpassword).

Puede iniciar sesión con este rol.

Tiene capacidades para editar y eliminar eventos.

Puede crear nuevos eventos.

Usuario Visitante:

Puede registrarse en eventos siempre y cuando no se haya superado la capacidad del evento.

Puede visualizar sus registros en el dashboard.

Lógica de Rutas:

El Dashboard (/dashboard) es accesible para todos, sin necesidad de autenticación.

Si un usuario no autenticado intenta acceder a rutas protegidas (ej. /dashboard/events/create, /dashboard/events/edit), será redirigido a una página not-found.js.

Si un usuario ya autenticado intenta acceder a /login o /register, será redirigido a la ruta raíz del dashboard (/dashboard).

Vistas Implementadas:

Home/Dashboard: /dashboard (visible para todos, acciones protegidas por rol).

Crear Eventos: /dashboard/events/create (solo administradores).

Editar Eventos: /dashboard/events/edit?id={id_evento} (solo administradores).

Login: /login.

Registro: /register.

No Encontrado/Acceso Denegado: /not-found.

Estructura del Proyecto
event-management-spa/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── auth.js             // Módulo de autenticación y persistencia de sesión
│   │   ├── router.js           // Módulo de enrutamiento y guardián de rutas
│   │   ├── eventService.js     // Módulo para operaciones CRUD de eventos
│   │   ├── viewManager.js      // Módulo para renderizar vistas y mostrar mensajes
│   │   ├── app.js              // Punto de entrada principal de la SPA
│   │   └── views/              // Contiene las vistas individuales
│   │       ├── login.js
│   │       ├── register.js
│   │       ├── dashboard.js
│   │       ├── createEvent.js
│   │       ├── editEvent.js
│   │       └── notFound.js
│   └── index.html              // Archivo HTML principal
├── db.json                     // Base de datos simulada para json-server
├── package.json                // Configuración del proyecto Node.js
└── README.md                   // Este archivo

Instrucciones Detalladas para Levantar y Usar la Solución
Sigue estos pasos para poner en marcha la aplicación en tu entorno local:

1. Clonar el Repositorio (si aplica)
Si este proyecto está en un repositorio de Git, clónalo:

git clone [(https://github.com/Abrahan1194/Eventos.js.git)]
cd event-management-spa

2. Inicializar el Proyecto Node.js
Asegúrate de tener Node.js y npm instalados. Navega a la raíz del proyecto en tu terminal y ejecuta:

npm install

Esto instalará cualquier dependencia que se haya podido añadir (aunque para este proyecto solo json-server es una dependencia de desarrollo).

3. Instalar json-server
json-server es una herramienta que te permite crear una API REST falsa con cero codificación en menos de un minuto. Necesitarás instalarlo globalmente:

npm install -g json-server

4. Configurar db.json
El archivo db.json ya está configurado en la raíz del proyecto con un usuario administrador por defecto y algunos eventos de ejemplo. No necesitas hacer nada aquí a menos que quieras modificar los datos iniciales.

Contenido de db.json:

{
  "users": [
    {
      "id": "admin-123",
      "username": "admin",
      "password": "adminpassword",
      "role": "admin"
    },
    {
      "id": "visitor-456",
      "username": "visitante",
      "password": "visitorpassword",
      "role": "visitor",
      "registeredEvents": []
    }
  ],
  "events": [
    {
      "id": "event-1",
      "name": "Conferencia de Tecnología 2025",
      "date": "2025-09-15",
      "location": "Centro de Convenciones",
      "capacity": 200,
      "registeredAttendees": []
    },
    {
      "id": "event-2",
      "name": "Taller de Desarrollo Web",
      "date": "2025-10-01",
      "location": "Espacio Co-working",
      "capacity": 50,
      "registeredAttendees": []
    },
    {
      "id": "event-3",
      "name": "Hackathon de Innovación",
      "date": "2025-11-20",
      "location": "Campus Universitario",
      "capacity": 100,
      "registeredAttendees": []
    }
  ]
}

5. Iniciar el Servidor de la Base de Datos Simulada
Abre una nueva terminal en la raíz del proyecto (event-management-spa/) y ejecuta el siguiente comando:

npm run start-db

Esto iniciará json-server en http://localhost:3000. Verás algo como esto en tu terminal:

  Resources
  http://localhost:3000/users
  http://localhost:3000/events

  Home
  http://localhost:3000

¡Es crucial que este servidor esté corriendo mientras usas la aplicación!

6. Abrir la Aplicación en el Navegador
Una vez que json-server esté en funcionamiento, puedes abrir la aplicación. Simplemente abre el archivo public/index.html en tu navegador web preferido.

No necesitas un servidor web adicional para este proyecto, ya que es una SPA que carga sus recursos directamente desde el sistema de archivos (para desarrollo local) y utiliza json-server para las operaciones de datos.

7. Uso de la Aplicación
Al cargar la página, serás redirigido al Dashboard (/dashboard), que es visible para todos.

Desde el dashboard, puedes ver los eventos disponibles.

Utiliza los enlaces en la barra de navegación para ir a Iniciar Sesión (/login) o Registrarse (/register).

Iniciar Sesión como Administrador:

Usuario: admin

Contraseña: adminpassword

Una vez autenticado como administrador, verás botones para "Crear Nuevo Evento", "Editar" y "Eliminar" eventos en el dashboard.

Iniciar Sesión como Visitante:

Puedes registrar un nuevo visitante a través de la página de registro o usar el que ya está en db.json:

Usuario: visitante

Contraseña: visitorpassword

Una vez autenticado como visitante, podrás "Registrarte" en eventos (si hay capacidad) y "Cancelar Registro" de eventos en los que ya estés inscrito. También verás una sección de "Mis Registros".

Navegación: Usa los enlaces de la barra de navegación o los botones dentro de las vistas para moverte entre las diferentes secciones de la SPA.

Colección POSTMAN
Para probar las operaciones de la API directamente con json-server, puedes usar una herramienta como Postman. Aquí hay un resumen de los endpoints y métodos que puedes probar:

Usuarios:

GET http://localhost:3000/users - Obtener todos los usuarios.

POST http://localhost:3000/users - Crear un nuevo usuario (JSON body: { "username": "nuevo", "password": "pass", "role": "visitor" }).

Eventos:

GET http://localhost:3000/events - Obtener todos los eventos.

GET http://localhost:3000/events/{id} - Obtener un evento por ID.

POST http://localhost:3000/events - Crear un nuevo evento (JSON body: { "name": "Evento Nuevo", "date": "2025-12-25", "location": "Lugar", "capacity": 50, "registeredAttendees": [] }).

PUT http://localhost:3000/events/{id} - Actualizar un evento existente (JSON body con todos los campos).

DELETE http://localhost:3000/events/{id} - Eliminar un evento.

Comentarios en el Código
El código fuente contiene comentarios claros y descriptivos en las secciones clave, explicando la lógica, las funciones y el propósito de cada módulo y vista.

Commits Descriptivos
(Nota: Como este README se genera en un entorno de conversación, no puedo evidenciar commits reales. Sin embargo, en un repositorio de GitHub, se esperaría ver un historial de commits claro y descriptivo por cada funcionalidad implementada, como "feat: Implementar registro de usuarios", "fix: Corregir redirección de rutas", "refactor: Mejorar manejo de eventos", etc.)
