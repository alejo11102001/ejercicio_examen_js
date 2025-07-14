// public/js/views/login.js

import { renderView, showMessage } from '../viewManager.js';
import { loginUser, isAuthenticated } from '../auth.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista de inicio de sesión.
 * Si el usuario ya está autenticado, redirige al dashboard.
 * De lo contrario, muestra el formulario de inicio de sesión.
 */
export function render() {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
        navigateTo('/dashboard');
        return;
    }

    const htmlContent = `
        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-5">
                    <div class="card shadow-lg p-4">
                        <h2 class="card-title text-center mb-4 text-primary">Iniciar Sesión</h2>
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Nombre de Usuario:</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña:</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">Iniciar Sesión</button>
                                <button type="button" id="backToDashboardBtn" class="btn btn-secondary btn-lg">Ver Eventos</button>
                            </div>
                        </form>
                        <p class="text-center mt-3">
                            ¿No tienes una cuenta? <a href="#register" id="goToRegister" class="text-info">Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderView(htmlContent, attachEventListeners);
}

/**
 * Adjunta los event listeners al formulario y enlaces de la vista de inicio de sesión.
 */
function attachEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const goToRegisterLink = document.getElementById('goToRegister');
    if (goToRegisterLink) {
        goToRegisterLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir la navegación por defecto del enlace
            navigateTo('/register'); // Navegar a la ruta de registro
        });
    }

    const backToDashboardBtn = document.getElementById('backToDashboardBtn');
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', () => {
            navigateTo('/dashboard'); // Navegar al dashboard
        });
    }
}

/**
 * Maneja el envío del formulario de inicio de sesión.
 * Recopila las credenciales, llama a la función de login y proporciona retroalimentación.
 * @param {Event} event - El objeto de evento del envío del formulario.
 */
async function handleLogin(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        showMessage('Por favor, ingresa tu nombre de usuario y contraseña.', 'warning');
        return;
    }

    try {
        await loginUser(username, password);
        showMessage('Inicio de sesión exitoso.', 'success');
        navigateTo('/dashboard'); // Redirigir al dashboard después de iniciar sesión
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showMessage(`Error al iniciar sesión: ${error.message}`, 'danger');
    }
}
