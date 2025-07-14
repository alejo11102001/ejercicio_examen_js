// public/js/views/notFound.js

import { renderView } from '../viewManager.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista de "Página no encontrada" o "Acceso denegado".
 * Proporciona un mensaje claro al usuario y un botón para volver al dashboard o login.
 */
export function render() {
    const htmlContent = `
        <div class="container my-5 text-center">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-lg p-5">
                        <h1 class="display-4 text-danger mb-3">404</h1>
                        <h2 class="mb-4 text-secondary">Página no encontrada o Acceso Denegado</h2>
                        <p class="lead mb-4">
                            Lo sentimos, la página que estás buscando no existe o no tienes permiso para acceder a ella.
                        </p>
                        <div class="d-grid gap-2 col-6 mx-auto">
                            <button id="goToHomeBtn" class="btn btn-primary btn-lg">
                                <i class="fas fa-home me-2"></i>Volver al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderView(htmlContent, attachEventListeners);
}

/**
 * Adjunta los event listeners a los elementos de la vista notFound.
 */
function attachEventListeners() {
    const goToHomeBtn = document.getElementById('goToHomeBtn');
    if (goToHomeBtn) {
        goToHomeBtn.addEventListener('click', () => {
            // Dependiendo del estado de autenticación, redirigir al dashboard o al login
            // Esto se maneja mejor en el router, pero aquí como fallback
            navigateTo('/'); // El router se encargará de redirigir correctamente
        });
    }
}
// Exportar la función render para que pueda ser utilizada por el router
