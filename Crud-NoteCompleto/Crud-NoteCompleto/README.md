CrudNote - Aplicación de Notas Colaborativas
CrudNote es una Aplicación de Una Sola Página (SPA) diseñada para la gestión de notas, ofreciendo funcionalidades tanto personales como colaborativas. Permite a los usuarios registrarse, iniciar sesión y administrar sus notas de forma eficiente, con la posibilidad de compartirlas y controlar los permisos de acceso. Además, incorpora un robusto rol de administrador para la gestión integral del sistema.

🌟 Características Principales
Para Usuarios
Autenticación Segura: Sistema completo de registro e inicio de sesión para garantizar la privacidad de tus notas.

Gestión Completa de Notas (CRUD): Crea, lee, actualiza y elimina tus notas personales con facilidad.

Editor de Notas Intuitivo: Cada nota puede incluir:

Un título claro.

Contenido de texto detallado.

La opción de adjuntar una imagen, ya sea desde una URL externa o subiendo un archivo local.

Colaboración en Notas:

Comparte notas de forma selectiva con otros usuarios registrados en la plataforma.

Asigna permisos específicos a los colaboradores: solo lectura (readonly) o edición (edit).

Visualiza notas compartidas por otros, con los permisos que te hayan sido otorgados.

Perfil de Usuario Detallado:

Accede y visualiza tu información personal.

Actualiza tu contraseña para mantener la seguridad de tu cuenta.

Obtén un resumen rápido de las notas que has compartido.

Tema Personalizable: Alterna cómodamente entre un tema claro y un tema oscuro para optimizar tu experiencia visual. Tu preferencia se guarda automáticamente en el navegador.

Diseño Responsivo: Disfruta de una interfaz adaptada y optimizada para una visualización perfecta en una amplia gama de dispositivos, desde ordenadores de escritorio hasta teléfonos móviles y tabletas.

Para Administradores
Panel de Administración Centralizado: Una sección exclusiva que otorga control total y una visión general de la aplicación.

Gestión Integral de Usuarios:

Visualiza a todos los usuarios registrados en el sistema.

Capacidad para eliminar usuarios cuando sea necesario.

Control Total sobre Notas:

Accede, edita y elimina notas creadas por CUALQUIER usuario del sistema.

Estadísticas Generales: Un contador simple y claro que muestra el número total de usuarios y notas activas en la plataforma, facilitando la monitorización del crecimiento de la aplicación.

Gestión de Suscripciones: Visualiza y elimina las suscripciones al boletín.

Funcionalidad para Enviar Correo a Suscriptores: (Nota: Esta característica es un placeholder en el demo y requeriría un backend real para su implementación completa).

🛠️ Tecnologías Utilizadas
Frontend
HTML5: Para la estructura semántica de la página.

CSS3: Para el estilado y diseño visual.

JavaScript (ES6+ Modules): Para la lógica del lado del cliente, el enrutamiento de la SPA y la interacción dinámica.

Frameworks/Librerías
Bootstrap 5: Utilizado para un diseño responsivo robusto y componentes de interfaz de usuario pre-estilizados.

Bootstrap Icons: Para una iconografía moderna y escalable que mejora la usabilidad.

Backend (Simulado)
json-server: Una herramienta ligera que simula una API RESTful, utilizando un archivo db.json como base de datos. Ideal para el desarrollo rápido y prototipos sin necesidad de un backend complejo.

📂 Estructura de Carpetas
La organización del proyecto sigue una estructura modular para facilitar la claridad y el mantenimiento del código:

CrudNote/
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── ui.js
│   ├── services.js
│   └── auth.js
├── db.json
├── index.html
└── README.md
CrudNote/: Directorio raíz del proyecto.

css/: Contiene las hojas de estilo CSS personalizadas (style.css).

js/: Almacena todos los archivos JavaScript modularizados de la aplicación:

main.js: Punto de entrada principal; gestiona el enrutamiento y la orquestación de la aplicación.

ui.js: Contiene las funciones para renderizar las distintas vistas de la interfaz de usuario.

services.js: Maneja las interacciones con la API (simulada por json-server).

auth.js: Gestiona la lógica de autenticación y sesión del usuario.

db.json: Archivo de datos JSON que json-server utiliza como base de datos.

index.html: El único archivo HTML; es el punto de entrada de la SPA.

README.md: Este mismo archivo de documentación.

🚀 Cómo Iniciar el Proyecto
Para poner en marcha CrudNote en tu entorno de desarrollo local, sigue estos sencillos pasos:

📋 Prerrequisitos
Asegúrate de tener instalado Node.js y su gestor de paquetes npm en tu sistema.

👣 Pasos para la Configuración
Clona o descarga el repositorio:
Abre tu terminal o línea de comandos y ejecuta el siguiente comando para obtener el código fuente del proyecto:

Bash

git clone https://github.com/tu-usuario/CrudNote.git # Reemplaza con la URL real de tu repositorio
cd CrudNote
Instala json-server (si no lo tienes):
json-server es fundamental para simular la API. Instálalo globalmente para que esté disponible en tu sistema:

Bash

npm install -g json-server
Inicia el servidor de la API:
Desde la raíz del directorio CrudNote en tu terminal, ejecuta el siguiente comando. Esto lanzará el servidor de la API en http://localhost:3000, sirviendo los datos del archivo db.json.

Bash

json-server --watch db.json
Abre la aplicación en tu navegador:
No necesitas un servidor web adicional para el frontend de esta SPA. Simplemente abre el archivo index.html directamente en tu navegador web preferido (por ejemplo, haciendo doble clic en él o arrastrándolo a la ventana del navegador).

Importante: Para que la aplicación funcione correctamente y pueda interactuar con los datos, asegúrate de que tanto la página index.html esté abierta en tu navegador como el json-server esté ejecutándose en la terminal (http://localhost:3000).

🔑 Credenciales de Prueba
Para explorar las diferentes funcionalidades de CrudNote, puedes usar las siguientes credenciales:

Administrador:

Usuario: admin

Contraseña: 123

Usuario Normal:

Puedes registrar un nuevo usuario directamente desde la interfaz de la aplicación, siguiendo el flujo de registro.

proyecto:
## database
-db.json
## node_module
## public
-index.html
## src
#assets
#components
#views