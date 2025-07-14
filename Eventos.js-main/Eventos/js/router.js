// public/js/router.js

import { isAuthenticated, getUserRole } from './auth.js';
import { renderView } from './viewManager.js';

/**
 * Define las rutas de la aplicación con sus correspondientes vistas y requisitos de rol.
 *
 * Cada objeto de ruta contiene:
 * - path: La ruta URL (ej. '/dashboard', '/login').
 * - view: La función que renderiza la vista asociada a esta ruta.
 * - requiresAuth: Booleano que indica si la ruta requiere autenticación.
 * - allowedRoles: Array de strings con los roles permitidos para acceder a esta ruta.
 * Si es null o vacío, cualquier rol autenticado puede acceder.
 * Si requiresAuth es false, este campo se ignora.
 */
const routes = [
    {
        path: '/login',
        view: () => import('./views/login.js').then(module => module.render()),
        requiresAuth: false,
        allowedRoles: null
    },
    {
        path: '/register',
        view: () => import('./views/register.js').then(module => module.render()),
        requiresAuth: false,
        allowedRoles: null
    },
    {
        path: '/dashboard',
        view: () => import('./views/dashboard.js').then(module => module.render()),
        requiresAuth: false, // El dashboard no requiere autenticación
        allowedRoles: ['admin', 'visitor']
    },
    {
        path: '/dashboard/events/create',
        view: () => import('./views/createEvent.js').then(module => module.render()),
        requiresAuth: true,
        allowedRoles: ['admin'] // Solo administradores pueden crear eventos
    },
    {
        path: '/dashboard/events/edit', // Esta ruta esperará un ID de evento en el hash, ej: #dashboard/events/edit?id=event-1
        view: (params) => import('./views/editEvent.js').then(module => module.render(params)),
        requiresAuth: true,
        allowedRoles: ['admin'] // Solo administradores pueden editar eventos
    },
    {
        path: '/not-found', // Página custom para rutas no encontradas o acceso denegado
        view: () => import('./views/notFound.js').then(module => module.render()),
        requiresAuth: false,
        allowedRoles: null
    }
];

let updateNavbarCallback = null; // Callback para actualizar la navbar desde app.js

/**
 * Navega a una ruta específica.
 * Actualiza el hash de la URL y llama a router().
 * @param {string} path - La ruta a la que se desea navegar.
 */
export function navigateTo(path) {
    console.log('Router: navigateTo llamado con path:', path);
    if (window.location.hash.substring(1) !== path) {
        window.location.hash = path;
    } else {
        // Si la ruta es la misma, forzar la ejecución del router para recargar la vista
        console.log('Router: Ruta actual ya es la misma, forzando recarga de vista.');
        router();
    }
}

/**
 * Función principal del router.
 * Determina la vista a renderizar basándose en la URL actual y los permisos del usuario.
 */
async function router() {
    // Obtiene la ruta actual del hash de la URL, o '/' si no hay hash
    const fullPath = window.location.hash.substring(1) || '/';
    // Extrae la parte base de la ruta, ignorando los parámetros de consulta
    const path = fullPath.split('?')[0]; // CAMBIO CLAVE: Ignorar query params para la coincidencia de ruta
    console.log(`Router: Ejecutando router para fullPath: ${fullPath}, path base: ${path}`);
    
    // Busca la ruta correspondiente en la configuración de rutas
    const currentRoute = routes.find(route => {
        // Para rutas con parámetros como '/dashboard/events/edit', solo comparamos la parte base
        // Ahora 'path' ya no tiene los query params, así que la comparación es más directa
        return route.path === path;
    });

    const appContainer = document.getElementById('app-container');
    if (!appContainer) {
        console.error('Router: El contenedor de la aplicación (#app-container) no fue encontrado.');
        return;
    }

    // Lógica del guardián de rutas
    const authenticated = isAuthenticated();
    const userRole = getUserRole();

    // Manejar la ruta raíz si no se encontró una ruta específica.
    // Ahora, la ruta raíz siempre redirige al dashboard, ya que es pública.
    if (!currentRoute && fullPath === '/') { // Usar fullPath aquí para la redirección inicial de '/'
        console.log('Router: Ruta raíz detectada, redirigiendo a /dashboard.');
        navigateTo('/dashboard');
        return;
    }


    if (currentRoute) {
        console.log(`Router: Ruta encontrada: ${currentRoute.path}. Requiere autenticación: ${currentRoute.requiresAuth}. Roles permitidos: ${currentRoute.allowedRoles}`);

        // Redirección si el usuario está autenticado e intenta acceder a /login o /register
        if (authenticated && (currentRoute.path === '/login' || currentRoute.path === '/register')) {
            console.log('Router Guard: Usuario autenticado intentando acceder a login/register. Redirigiendo a dashboard.');
            navigateTo('/dashboard');
            return;
        }

        // Protección de rutas que requieren autenticación
        if (currentRoute.requiresAuth && !authenticated) {
            console.warn('Router Guard: Acceso denegado. Se requiere autenticación para la ruta:', path);
            navigateTo('/not-found'); // Redirigir a la página de no encontrado/acceso denegado
            return;
        }

        // Protección de rutas por rol
        if (currentRoute.requiresAuth && currentRoute.allowedRoles && !currentRoute.allowedRoles.includes(userRole)) {
            console.warn(`Router Guard: Acceso denegado. El rol '${userRole}' no tiene permiso para la ruta:`, path);
            navigateTo('/not-found'); // Redirigir a la página de no encontrado/acceso denegado
            return;
        }

        // Si la ruta es /dashboard/events/edit, extraemos el ID del evento de los parámetros de la URL
        let params = {};
        if (currentRoute.path === '/dashboard/events/edit') {
            // Usar fullPath para extraer los parámetros de la URL
            const urlParams = new URLSearchParams(fullPath.split('?')[1]);
            params.id = urlParams.get('id');
            console.log('Router: Parámetros de ruta para edición de evento:', params);
        }

        // Renderizar la vista correspondiente
        try {
            console.log(`Router: Renderizando vista para ${currentRoute.path}...`);
            await currentRoute.view(params);
            console.log(`Router: Vista ${currentRoute.path} renderizada exitosamente.`);
        } catch (error) {
            console.error('Router: Error al renderizar la vista:', error);
            navigateTo('/not-found'); // En caso de error al cargar la vista
        }
    } else {
        // Si la ruta no se encuentra en la configuración (y no es la raíz)
        console.warn('Router: Ruta no encontrada en la configuración:', path);
        navigateTo('/not-found');
    }

    // Asegurarse de que la barra de navegación se actualice después de cada cambio de ruta
    if (updateNavbarCallback) {
        updateNavbarCallback();
    }
}

/**
 * Configura el router y el listener para cambios de hash.
 * @param {function} navbarUpdateFn - Función de callback para actualizar la barra de navegación.
 */
export function setupRouter(navbarUpdateFn) {
    updateNavbarCallback = navbarUpdateFn;
    window.addEventListener('hashchange', router); // Escuchar cambios en el hash
    router(); // Ejecutar el router al cargar la página por primera vez
}
