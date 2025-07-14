// public/js/viewManager.js

/**
 * Módulo para gestionar la carga y renderizado de las vistas en el contenedor principal de la SPA.
 */

const appContainer = document.getElementById('app-container');

/**
 * Renderiza una vista en el contenedor principal de la aplicación.
 * @param {string} htmlContent - El contenido HTML de la vista a renderizar.
 * @param {function} [callback] - Una función de callback opcional que se ejecuta después de que la vista es renderizada.
 */
export function renderView(htmlContent, callback = null) {
    if (!appContainer) {
        console.error('El contenedor de la aplicación (#app-container) no fue encontrado.');
        return;
    }

    // Limpiar el contenido actual del contenedor
    appContainer.innerHTML = '';

    // Crear un div temporal para parsear el HTML y ejecutar scripts si los hay
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Añadir el contenido parsed al contenedor principal
    // Esto es importante para que los listeners de eventos puedan adjuntarse correctamente
    // a los elementos recién añadidos al DOM.
    while (tempDiv.firstChild) {
        appContainer.appendChild(tempDiv.firstChild);
    }

    // Ejecutar el callback si se proporciona
    if (callback && typeof callback === 'function') {
        callback();
    }
}

/**
 * Muestra un mensaje de alerta temporal en la parte superior del contenedor de la aplicación.
 * @param {string} message - El mensaje a mostrar.
 * @param {string} type - El tipo de mensaje ('success', 'error', 'info', 'warning').
 * @param {number} duration - Duración en milisegundos antes de que el mensaje desaparezca.
 */
export function showMessage(message, type = 'info', duration = 3000) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `alert alert-${type} alert-dismissible fade show w-100 mb-3 text-center`; // Bootstrap classes
    messageContainer.setAttribute('role', 'alert');
    messageContainer.innerHTML = `
        <span>${message}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insertar el mensaje al principio del appContainer para que siempre esté visible
    if (appContainer.firstChild) {
        appContainer.insertBefore(messageContainer, appContainer.firstChild);
    } else {
        appContainer.appendChild(messageContainer);
    }

    // Auto-ocultar el mensaje después de la duración especificada
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(messageContainer);
        bsAlert.close();
    }, duration);
}
