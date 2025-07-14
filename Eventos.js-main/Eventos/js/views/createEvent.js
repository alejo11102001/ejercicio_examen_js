// public/js/views/createEvent.js

import { renderView, showMessage } from '../viewManager.js';
import { createEvent } from '../eventService.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista de creación de eventos.
 * Muestra un formulario para que los administradores ingresen los detalles de un nuevo evento.
 */
export function render() {
    const htmlContent = `
        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-lg p-4">
                        <h2 class="card-title text-center mb-4 text-primary">Crear Nuevo Evento</h2>
                        <form id="createEventForm">
                            <div class="mb-3">
                                <label for="eventName" class="form-label">Nombre del Evento:</label>
                                <input type="text" class="form-control" id="eventName" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventDate" class="form-label">Fecha:</label>
                                <input type="date" class="form-control" id="eventDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventLocation" class="form-label">Ubicación:</label>
                                <input type="text" class="form-control" id="eventLocation" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventCapacity" class="form-label">Capacidad:</label>
                                <input type="number" class="form-control" id="eventCapacity" min="1" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">Crear Evento</button>
                                <button type="button" id="cancelCreate" class="btn btn-secondary btn-lg">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderView(htmlContent, attachEventListeners);
}

/**
 * Adjunta los event listeners al formulario y botones de la vista de creación de eventos.
 */
function attachEventListeners() {
    const createEventForm = document.getElementById('createEventForm');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }

    const cancelCreateButton = document.getElementById('cancelCreate');
    if (cancelCreateButton) {
        cancelCreateButton.addEventListener('click', () => {
            navigateTo('/dashboard'); // Redirigir al dashboard al cancelar
        });
    }
}

/**
 * Maneja el envío del formulario de creación de eventos.
 * Recopila los datos del formulario, llama al servicio para crear el evento
 * y proporciona retroalimentación al usuario.
 * @param {Event} event - El objeto de evento del envío del formulario.
 */
async function handleCreateEvent(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventCapacity = parseInt(document.getElementById('eventCapacity').value, 10);

    // Validaciones básicas
    if (!eventName || !eventDate || !eventLocation || isNaN(eventCapacity) || eventCapacity <= 0) {
        showMessage('Por favor, completa todos los campos correctamente.', 'warning');
        return;
    }

    const eventData = {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        capacity: eventCapacity,
        registeredAttendees: [] // Inicialmente no hay asistentes registrados
    };

    try {
        await createEvent(eventData);
        showMessage('Evento creado exitosamente.', 'success');
        navigateTo('/dashboard'); // Redirigir al dashboard después de crear el evento
    } catch (error) {
        console.error('Error al crear el evento:', error);
        showMessage(`Error al crear el evento: ${error.message}`, 'danger');
    }
}

// Exportar la función render para que pueda ser utilizada por el router        