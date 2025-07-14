// public/js/app.js

import { isAuthenticated, getCurrentUser, logoutUser } from './auth.js';
import { navigateTo, setupRouter } from './router.js'; // navigateTo se importa aquí
import { renderView } from './viewManager.js';

/**
 * Función para actualizar la barra de navegación basada en el estado de autenticación.
 * Muestra enlaces de login/registro si no está autenticado, o dashboard/logout si lo está.
 */
function updateNavbar() {
    const navLinksContainer = document.getElementById('nav-links');
    if (!navLinksContainer) {
        console.error('Contenedor de enlaces de navegación no encontrado.');
        return;
    }

    navLinksContainer.innerHTML = ''; // Limpiar enlaces existentes

    if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        const userRole = currentUser ? currentUser.role : 'visitor'; // Default a visitor if role is somehow missing

        // Enlace al Dashboard
        const dashboardLink = document.createElement('a');
        dashboardLink.href = '#dashboard';
        dashboardLink.className = 'btn btn-outline-info me-2'; // Bootstrap classes for responsive button
        dashboardLink.textContent = 'Dashboard';
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/dashboard');
        });
        navLinksContainer.appendChild(dashboardLink);

        // Enlace para crear evento (solo para administradores)
        if (userRole === 'admin') {
            const createEventLink = document.createElement('a');
            createEventLink.href = '#dashboard/events/create';
            createEventLink.className = 'btn btn-outline-success me-2'; // Bootstrap classes
            createEventLink.textContent = 'Crear Evento';
            createEventLink.addEventListener('click', (e) => {
                e.preventDefault();
                navigateTo('/dashboard/events/create');
            });
            navLinksContainer.appendChild(createEventLink);
        }

        // Botón de Cerrar Sesión
        const logoutButton = document.createElement('button');
        logoutButton.className = 'btn btn-danger'; // Bootstrap classes
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.addEventListener('click', () => {
            logoutUser();
            updateNavbar(); // Actualizar la barra de navegación después de cerrar sesión
            navigateTo('/login'); // Redirigir al login
        });
        navLinksContainer.appendChild(logoutButton);

        // Mostrar nombre de usuario y rol (opcional, para feedback visual)
        const userInfo = document.createElement('span');
        userInfo.className = 'text-white ms-3 d-none d-md-inline'; // Hidden on small screens, visible on medium and up
        userInfo.textContent = `Bienvenido, ${currentUser.username} (${userRole})`;
        navLinksContainer.appendChild(userInfo);

    } else {
        // Enlace de Login
        const loginLink = document.createElement('a');
        loginLink.href = '#login';
        loginLink.className = 'btn btn-outline-light me-2'; // Bootstrap classes
        loginLink.textContent = 'Iniciar Sesión';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/login');
        });
        navLinksContainer.appendChild(loginLink);

        // Enlace de Registro
        const registerLink = document.createElement('a');
        registerLink.href = '#register';
        registerLink.className = 'btn btn-primary'; // Bootstrap classes
        registerLink.textContent = 'Registrarse';
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('/register');
        });
        navLinksContainer.appendChild(registerLink);
    }
}

/**
 * Inicializa la aplicación.
 * Configura el router, actualiza la barra de navegación y maneja la navegación inicial.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Configurar el router con las rutas y el guardián
    setupRouter(updateNavbar);

    // Actualizar la barra de navegación al cargar la página
    updateNavbar();

    // Manejar la navegación inicial al cargar la página
    // Si hay un hash en la URL, navegar a esa ruta, de lo contrario, ir al dashboard si está autenticado
    // o al login si no lo está.
    const initialPath = window.location.hash.substring(1) || (isAuthenticated() ? '/dashboard' : '/login');
    navigateTo(initialPath);

    // Escuchar cambios en el hash de la URL para la navegación
    window.addEventListener('hashchange', () => {
        const path = window.location.hash.substring(1);
        navigateTo(path);
    });
});
