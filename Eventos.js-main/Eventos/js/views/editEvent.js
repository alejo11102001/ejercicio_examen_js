// public/js/views/editEvent.js

import { renderView, showMessage } from '../viewManager.js';
import { getEventById, updateEvent } from '../eventService.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista de edición de eventos.
 * Carga los datos del evento a editar y muestra un formulario pre-llenado.
 * @param {object} params - Objeto que contiene los parámetros de la ruta (ej. { id: 'event-id' }).
 */
export async function render(params) {
    const eventId = params.id;
    if (!eventId) {
        showMessage('ID de evento no proporcionado para la edición.', 'danger');
        navigateTo('/dashboard'); // Redirigir si no hay ID
        return;
    }

    let event = null;
    try {
        event = await getEventById(eventId);
    } catch (error) {
        console.error('Error al cargar el evento para edición:', error);
        showMessage(`Error al cargar el evento: ${error.message}`, 'danger');
        navigateTo('/dashboard'); // Redirigir si el evento no se encuentra o hay un error
        return;
    }

    const htmlContent = `
        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="col-md-8 col-lg-6">
                    <div class="card shadow-lg p-4">
                        <h2 class="card-title text-center mb-4 text-primary">Editar Evento</h2>
                        <form id="editEventForm">
                            <input type="hidden" id="eventId" value="${event.id}">
                            <div class="mb-3">
                                <label for="eventName" class="form-label">Nombre del Evento:</label>
                                <input type="text" class="form-control" id="eventName" value="${event.name}" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventDate" class="form-label">Fecha:</label>
                                <input type="date" class="form-control" id="eventDate" value="${event.date}" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventLocation" class="form-label">Ubicación:</label>
                                <input type="text" class="form-control" id="eventLocation" value="${event.location}" required>
                            </div>
                            <div class="mb-3">
                                <label for="eventCapacity" class="form-label">Capacidad:</label>
                                <input type="number" class="form-control" id="eventCapacity" value="${event.capacity}" min="1" required>
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">Guardar Cambios</button>
                                <button type="button" id="cancelEdit" class="btn btn-secondary btn-lg">Cancelar</button>
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
 * Adjunta los event listeners al formulario y botones de la vista de edición de eventos.
 */
function attachEventListeners() {
    const editEventForm = document.getElementById('editEventForm');
    if (editEventForm) {
        editEventForm.addEventListener('submit', handleEditEvent);
    }

    const cancelEditButton = document.getElementById('cancelEdit');
    if (cancelEditButton) {
        cancelEditButton.addEventListener('click', () => {
            navigateTo('/dashboard'); // Redirigir al dashboard al cancelar
        });
    }
}

/**
 * Maneja el envío del formulario de edición de eventos.
 * Recopila los datos actualizados, llama al servicio para actualizar el evento
 * y proporciona retroalimentación al usuario.
 * @param {Event} event - El objeto de evento del envío del formulario.
 */
async function handleEditEvent(event) {
    event.preventDefault(); // Prevenir el envío por defecto del formulario

    const eventId = document.getElementById('eventId').value;
    const eventName = document.getElementById('eventName').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventCapacity = parseInt(document.getElementById('eventCapacity').value, 10);

    // Validaciones básicas
    if (!eventName || !eventDate || !eventLocation || isNaN(eventCapacity) || eventCapacity <= 0) {
        showMessage('Por favor, completa todos los campos correctamente.', 'warning');
        return;
    }

    const updatedData = {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        capacity: eventCapacity
        // No actualizamos registeredAttendees aquí, eso se maneja por separado
    };

    try {
        await updateEvent(eventId, updatedData);
        showMessage('Evento actualizado exitosamente.', 'success');
        navigateTo('/dashboard'); // Redirigir al dashboard después de actualizar el evento
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
        showMessage(`Error al actualizar el evento: ${error.message}`, 'danger');
    }
}       
// Exportar la función render para que pueda ser utilizada por el router
