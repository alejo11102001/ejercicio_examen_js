// public/js/views/register.js

import { renderView, showMessage } from '../viewManager.js';
import { registerUser, isAuthenticated } from '../auth.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista de registro de usuarios.
 * Si el usuario ya está autenticado, redirige al dashboard.
 * De lo contrario, muestra el formulario de registro.
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
                        <h2 class="card-title text-center mb-4 text-primary">Registrarse</h2>
                        <form id="registerForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Nombre de Usuario:</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña:</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <div class="mb-3">
                                <label for="role" class="form-label">Rol:</label>
                                <select class="form-select" id="role" required>
                                    <option value="visitor" selected>Visitante</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">Registrarse</button>
                            </div>
                        </form>
                        <p class="text-center mt-3">
                            ¿Ya tienes una cuenta? <a href="#login" id="goToLogin" class="text-info">Inicia sesión aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderView(htmlContent, attachEventListeners);
}

/**
 * Adjunta los event listeners al formulario y enlaces de la vista de registro.
 */
function attachEventListeners() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const goToLoginLink = document.getElementById('goToLogin');
    if (goToLoginLink) {
        goToLoginLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir la navegación por defecto del enlace
            navigateTo('/login'); // Navegar a la ruta de login
        });
    }
}

/**
 * Maneja el envío del formulario de registro.
 * Recopila los datos del formulario, llama a la función de registro y proporciona retroalimentación.
 * @param {Event} event - El objeto de evento del envío del formulario.
 */
async function handleRegister(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');

    const username = usernameInput.value;
    const password = passwordInput.value;
    const role = roleSelect.value;

    if (!username || !password || !role) {
        showMessage('Por favor, completa todos los campos.', 'warning');
        return;
    }

    try {
        await registerUser(username, password, role);
        showMessage('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        navigateTo('/login'); // Redirigir al login después de un registro exitoso
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        showMessage(`Error al registrar: ${error.message}`, 'danger');
    }
}
// Exportar la función render para que pueda ser utilizada por el router
