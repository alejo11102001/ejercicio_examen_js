// public/js/eventService.js

/**
 * Módulo para gestionar las operaciones CRUD de los eventos
 * interactuando con la API de json-server.
 */

const EVENTS_API_BASE_URL = 'http://localhost:3000/events'; // URL base para los eventos en json-server
const USERS_API_BASE_URL = 'http://localhost:3000/users'; // URL base para los usuarios en json-server (para registrar asistentes)


/**
 * Obtiene todos los eventos de la base de datos.
 * @returns {Promise<Array<object>>} - Promesa que resuelve con un array de objetos de eventos.
 * @throws {Error} Si hay un error en la red o en la respuesta de la API.
 */
export async function getEvents() {
    try {
        const response = await fetch(EVENTS_API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener eventos: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getEvents:', error);
        throw error;
    }
}

/**
 * Obtiene un evento específico por su ID.
 * @param {string} eventId - El ID del evento a obtener.
 * @returns {Promise<object>} - Promesa que resuelve con el objeto del evento.
 * @throws {Error} Si el evento no se encuentra o hay un error en la red.
 */
export async function getEventById(eventId) {
    try {
        const response = await fetch(`${EVENTS_API_BASE_URL}/${eventId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Evento no encontrado.');
            }
            throw new Error(`Error al obtener el evento: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getEventById:', error);
        throw error;
    }
}

/**
 * Crea un nuevo evento en la base de datos.
 * @param {object} eventData - Objeto con los datos del nuevo evento (name, date, location, capacity).
 * @returns {Promise<object>} - Promesa que resuelve con el objeto del evento creado.
 * @throws {Error} Si hay un error al crear el evento.
 */
export async function createEvent(eventData) {
    try {
        const response = await fetch(EVENTS_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...eventData, registeredAttendees: [] }), // Asegura que registeredAttendees sea un array vacío
        });
        if (!response.ok) {
            throw new Error(`Error al crear el evento: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en createEvent:', error);
        throw error;
    }
}

/**
 * Actualiza un evento existente en la base de datos.
 * @param {string} eventId - El ID del evento a actualizar.
 * @param {object} updatedData - Objeto con los datos actualizados del evento.
 * @returns {Promise<object>} - Promesa que resuelve con el objeto del evento actualizado.
 * @throws {Error} Si hay un error al actualizar el evento.
 */
export async function updateEvent(eventId, updatedData) {
    try {
        const response = await fetch(`${EVENTS_API_BASE_URL}/${eventId}`, {
            method: 'PUT', // O PATCH si solo quieres actualizar campos específicos
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar el evento: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en updateEvent:', error);
        throw error;
    }
}

/**
 * Elimina un evento de la base de datos.
 * @param {string} eventId - El ID del evento a eliminar.
 * @returns {Promise<void>} - Promesa que resuelve cuando el evento ha sido eliminado.
 * @throws {Error} Si hay un error al eliminar el evento.
 */
export async function deleteEvent(eventId) {
    try {
        const response = await fetch(`${EVENTS_API_BASE_URL}/${eventId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar el evento: ${response.statusText}`);
        }
        // json-server devuelve un objeto vacío en DELETE exitoso, no necesitamos parsearlo
    } catch (error) {
        console.error('Error en deleteEvent:', error);
        throw error;
    }
}

/**
 * Registra a un usuario como asistente en un evento.
 * Actualiza el array `registeredAttendees` del evento y el array `registeredEvents` del usuario.
 * @param {string} eventId - El ID del evento al que se va a registrar el usuario.
 * @param {object} user - El objeto del usuario que se va a registrar.
 * @returns {Promise<object>} - Promesa que resuelve con el objeto del evento actualizado.
 * @throws {Error} Si el evento no tiene capacidad, el usuario ya está registrado o hay un error.
 */
export async function registerAttendee(eventId, user) {
    try {
        // 1. Obtener el evento actual
        const event = await getEventById(eventId);
        if (!event) {
            throw new Error('Evento no encontrado.');
        }

        // 2. Verificar capacidad
        if (event.registeredAttendees.length >= event.capacity) {
            throw new Error('El evento ha alcanzado su capacidad máxima.');
        }

        // 3. Verificar si el usuario ya está registrado
        if (event.registeredAttendees.some(attendee => attendee.id === user.id)) {
            throw new Error('Ya estás registrado en este evento.');
        }

        // 4. Añadir el usuario al array de asistentes del evento
        const updatedAttendees = [...event.registeredAttendees, { id: user.id, username: user.username }];
        const updatedEvent = { ...event, registeredAttendees: updatedAttendees };

        // 5. Actualizar el evento en la base de datos
        const response = await fetch(`${EVENTS_API_BASE_URL}/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (!response.ok) {
            throw new Error(`Error al registrar asistente en el evento: ${response.statusText}`);
        }

        const updatedEventResult = await response.json();

        // 6. Opcional: Actualizar el array de eventos registrados del usuario (si lo manejamos en el objeto usuario)
        // Esto asume que el objeto de usuario en db.json tiene un array 'registeredEvents'
        const userResponse = await fetch(`${USERS_API_BASE_URL}/${user.id}`);
        if (!userResponse.ok) {
            console.warn('No se pudo obtener el usuario para actualizar sus eventos registrados.');
            return updatedEventResult; // Continuar sin actualizar el usuario si falla
        }
        const currentUserData = await userResponse.json();

        const updatedUserEvents = currentUserData.registeredEvents ? [...currentUserData.registeredEvents] : [];
        if (!updatedUserEvents.some(e => e.id === event.id)) {
            updatedUserEvents.push({ id: event.id, name: event.name, date: event.date });
        }

        await fetch(`${USERS_API_BASE_URL}/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...currentUserData, registeredEvents: updatedUserEvents }),
        });

        return updatedEventResult;

    } catch (error) {
        console.error('Error en registerAttendee:', error);
        throw error;
    }
}

/**
 * Cancela el registro de un usuario de un evento.
 * Elimina al usuario del array `registeredAttendees` del evento y del array `registeredEvents` del usuario.
 * @param {string} eventId - El ID del evento del que se va a cancelar el registro.
 * @param {object} user - El objeto del usuario que va a cancelar el registro.
 * @returns {Promise<object>} - Promesa que resuelve con el objeto del evento actualizado.
 * @throws {Error} Si el usuario no está registrado o hay un error.
 */
export async function unregisterAttendee(eventId, user) {
    try {
        // 1. Obtener el evento actual
        const event = await getEventById(eventId);
        if (!event) {
            throw new Error('Evento no encontrado.');
        }

        // 2. Verificar si el usuario está registrado
        const isRegistered = event.registeredAttendees.some(attendee => attendee.id === user.id);
        if (!isRegistered) {
            throw new Error('No estás registrado en este evento.');
        }

        // 3. Eliminar el usuario del array de asistentes del evento
        const updatedAttendees = event.registeredAttendees.filter(attendee => attendee.id !== user.id);
        const updatedEvent = { ...event, registeredAttendees: updatedAttendees };

        // 4. Actualizar el evento en la base de datos
        const response = await fetch(`${EVENTS_API_BASE_URL}/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (!response.ok) {
            throw new Error(`Error al cancelar el registro del asistente en el evento: ${response.statusText}`);
        }

        const updatedEventResult = await response.json();

        // 5. Opcional: Eliminar el evento del array de eventos registrados del usuario
        const userResponse = await fetch(`${USERS_API_BASE_URL}/${user.id}`);
        if (!userResponse.ok) {
            console.warn('No se pudo obtener el usuario para actualizar sus eventos registrados.');
            return updatedEventResult; // Continuar sin actualizar el usuario si falla
        }
        const currentUserData = await userResponse.json();

        if (currentUserData.registeredEvents) {
            const updatedUserEvents = currentUserData.registeredEvents.filter(e => e.id !== event.id);
            await fetch(`${USERS_API_BASE_URL}/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...currentUserData, registeredEvents: updatedUserEvents }),
            });
        }

        return updatedEventResult;

    } catch (error) {
        console.error('Error en unregisterAttendee:', error);
        throw error;
    }
}
