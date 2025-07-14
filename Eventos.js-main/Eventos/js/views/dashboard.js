// public/js/views/dashboard.js

import { renderView, showMessage } from '../viewManager.js';
import { getEvents, deleteEvent, registerAttendee, unregisterAttendee } from '../eventService.js';
import { isAuthenticated, getUserRole, getCurrentUser } from '../auth.js';
import { navigateTo } from '../router.js';

/**
 * Renderiza la vista del dashboard.
 * Muestra una lista de eventos y funcionalidades específicas según el rol del usuario.
 */
export async function render() {
    const userRole = getUserRole();
    const currentUser = getCurrentUser();
    let events = [];

    try {
        events = await getEvents();
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        showMessage('Error al cargar los eventos. Inténtalo de nuevo más tarde.', 'danger');
        events = []; // Asegurarse de que events sea un array vacío en caso de error
    }

    const htmlContent = `
        <div class="container my-4">
            <h2 class="text-center mb-4 text-primary">Dashboard de Eventos</h2>

            ${userRole === 'admin' ? `
                <div class="d-grid gap-2 mb-4">
                    <button id="createEventBtn" class="btn btn-success btn-lg">
                        <i class="fas fa-plus-circle me-2"></i>Crear Nuevo Evento
                    </button>
                </div>
            ` : ''}

            ${events.length === 0 ? `
                <div class="alert alert-info text-center" role="alert">
                    No hay eventos disponibles en este momento.
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Ubicación</th>
                                <th scope="col">Capacidad</th>
                                <th scope="col">Asistentes</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${events.map(event => `
                                <tr>
                                    <td>${event.name}</td>
                                    <td>${event.date}</td>
                                    <td>${event.location}</td>
                                    <td>${event.capacity}</td>
                                    <td>
                                        ${event.registeredAttendees ? event.registeredAttendees.length : 0} / ${event.capacity}
                                        ${event.registeredAttendees && event.registeredAttendees.some(attendee => attendee.id === currentUser?.id) ?
                                            `<span class="badge bg-success ms-2">Registrado</span>` : ''
                                        }
                                    </td>
                                    <td>
                                        ${userRole === 'admin' ? `
                                            <button class="btn btn-warning btn-sm me-2 edit-event-btn" data-id="${event.id}">
                                                <i class="fas fa-edit"></i> Editar
                                            </button>
                                            <button class="btn btn-danger btn-sm delete-event-btn" data-id="${event.id}">
                                                <i class="fas fa-trash-alt"></i> Eliminar
                                            </button>
                                        ` : `
                                            ${event.registeredAttendees && event.registeredAttendees.some(attendee => attendee.id === currentUser?.id) ? `
                                                <button class="btn btn-danger btn-sm unregister-event-btn" data-id="${event.id}">
                                                    <i class="fas fa-times-circle"></i> Cancelar Registro
                                                </button>
                                            ` : `
                                                <button class="btn btn-primary btn-sm register-event-btn" data-id="${event.id}"
                                                    ${event.registeredAttendees && event.registeredAttendees.length >= event.capacity ? 'disabled' : ''}>
                                                    <i class="fas fa-user-plus"></i> Registrarse
                                                </button>
                                            `}
                                        `}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}

            ${userRole === 'visitor' && currentUser && currentUser.registeredEvents && currentUser.registeredEvents.length > 0 ? `
                <h3 class="text-center my-4 text-secondary">Mis Registros</h3>
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">Nombre del Evento</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${events.filter(event => currentUser.registeredEvents.some(regEvent => regEvent.id === event.id)).map(event => `
                                <tr>
                                    <td>${event.name}</td>
                                    <td>${event.date}</td>
                                    <td>
                                        <button class="btn btn-danger btn-sm unregister-event-btn" data-id="${event.id}">
                                            <i class="fas fa-times-circle"></i> Cancelar Registro
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </div>
    `;

    renderView(htmlContent, attachEventListeners);
}

/**
 * Adjunta los event listeners a los botones del dashboard.
 */
function attachEventListeners() {
    const userRole = getUserRole();
    const currentUser = getCurrentUser();

    // Botón para crear evento (solo admin)
    if (userRole === 'admin') {
        const createEventBtn = document.getElementById('createEventBtn');
        if (createEventBtn) {
            createEventBtn.addEventListener('click', () => {
                navigateTo('/dashboard/events/create');
            });
        }

        // Botones de editar evento
        document.querySelectorAll('.edit-event-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const eventId = e.currentTarget.dataset.id;
                navigateTo(`/dashboard/events/edit?id=${eventId}`);
            });
        });

        // Botones de eliminar evento
        document.querySelectorAll('.delete-event-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const eventId = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres eliminar este evento?')) { // Usar un modal personalizado en vez de confirm
                    try {
                        await deleteEvent(eventId);
                        showMessage('Evento eliminado exitosamente.', 'success');
                        render(); // Recargar la vista del dashboard
                    } catch (error) {
                        console.error('Error al eliminar el evento:', error);
                        showMessage(`Error al eliminar el evento: ${error.message}`, 'danger');
                    }
                }
            });
        });
    }

    // Botones de registrar/cancelar registro (solo visitor)
    if (userRole === 'visitor' && currentUser) {
        document.querySelectorAll('.register-event-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const eventId = e.currentTarget.dataset.id;
                try {
                    await registerAttendee(eventId, currentUser);
                    showMessage('Te has registrado al evento exitosamente.', 'success');
                    render(); // Recargar la vista del dashboard
                } catch (error) {
                    console.error('Error al registrarse:', error);
                    showMessage(`Error al registrarse: ${error.message}`, 'danger');
                }
            });
        });

        document.querySelectorAll('.unregister-event-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const eventId = e.currentTarget.dataset.id;
                if (confirm('¿Estás seguro de que quieres cancelar tu registro a este evento?')) { // Usar un modal personalizado
                    try {
                        await unregisterAttendee(eventId, currentUser);
                        showMessage('Tu registro al evento ha sido cancelado.', 'success');
                        render(); // Recargar la vista del dashboard
                    } catch (error) {
                        console.error('Error al cancelar registro:', error);
                        showMessage(`Error al cancelar registro: ${error.message}`, 'danger');
                    }
                }
            });
        });
    }
}
// Exportar la función render para que pueda ser utilizada por el router
   
