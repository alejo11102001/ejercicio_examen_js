// js/services.js
// Gestiona las interacciones con la API (json-server).

// URL base de la API que apunta a localhost puerto 3000
const API_URL = 'http://localhost:3000';

// Funcion para obtener todos los usuarios desde la API
export async function getUsers() {
    const response = await fetch(`${API_URL}/users`); // Hace una petición GET a /users
    return response.json(); // Convierte la respuesta a JSON y la retorna
}

// Funcion para registrar un nuevo usuario en la API
export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/users`, { // Hace petición POST a /users
        method: 'POST', // Define el método HTTP como POST
        headers: { // Encabezados de la petición
            'Content-Type': 'application/json', // Especifica que se envía JSON
        },
        body: JSON.stringify(userData), // Convierte el objeto userData a JSON
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para obtener todas las notas desde la API
export async function getAllNotes() {
    const response = await fetch(`${API_URL}/notes`); // Hace una petición GET a /notes
    return response.json(); // Convierte la respuesta a JSON y la retorna
}

// Funcion para crear una nueva nota en la API
export async function createNote(noteData) {
    const response = await fetch(`${API_URL}/notes`, { // Hace petición POST a /notes
        method: 'POST', // Define método HTTP como POST
        headers: { // Encabezados de la petición
            'Content-Type': 'application/json', // Especifica que el cuerpo es JSON
        },
        body: JSON.stringify(noteData), // Convierte el objeto noteData a JSON
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para actualizar una nota existente en la API
export async function updateNote(noteId, noteData) {
    const response = await fetch(`${API_URL}/notes/${noteId}`, { // Hace petición PUT a /notes/{id}
        method: 'PUT', // Define método HTTP como PUT (actualizar)
        headers: { // Encabezados de la petición
            'Content-Type': 'application/json', // Especifica que se envía JSON
        },
        body: JSON.stringify(noteData), // Convierte el objeto noteData a JSON
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para eliminar una nota de la API
export async function deleteNote(noteId) {
    const response = await fetch(`${API_URL}/notes/${noteId}`, { // Hace petición DELETE a /notes/{id}
        method: 'DELETE', // Define método HTTP como DELETE
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para registrar un nuevo correo de suscripción en la API
export async function addSubscription(email) {
    const response = await fetch(`${API_URL}/subscriptions`, { // Hace petición POST a /subscriptions
        method: 'POST', // Define método HTTP como POST
        headers: { // Encabezados de la petición
            'Content-Type': 'application/json', // Especifica que se envía JSON
        },
        body: JSON.stringify({ email }), // Convierte el email a JSON en un objeto
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para eliminar un usuario de la API
export async function deleteUser(userId) {
    const response = await fetch(`${API_URL}/users/${userId}`, { // Hace petición DELETE a /users/{id}
        method: 'DELETE', // Define método HTTP como DELETE
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// Funcion para actualizar los datos de un usuario en la API
export async function updateUser(userId, userData) {
    const response = await fetch(`${API_URL}/users/${userId}`, { // Hace petición PUT a /users/{id}
        method: 'PUT', // Define método HTTP como PUT (actualizar)
        headers: { // Encabezados de la petición
            'Content-Type': 'application/json', // Especifica que se envía JSON
        },
        body: JSON.stringify(userData), // Convierte el objeto userData a JSON
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}

// FUNCIONES PARA SUSCRIPCIONES

// Funcion para obtener todas las suscripciones desde la API
export async function getSubscriptions() {
    const response = await fetch(`${API_URL}/subscriptions`); // Hace una petición GET a /subscriptions
    return response.json(); // Convierte la respuesta a JSON y la retorna
}

// Funcion para eliminar una suscripcion de la API
export async function deleteSubscription(subscriptionId) {
    const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, { // Hace petición DELETE a /subscriptions/{id}
        method: 'DELETE', // Define método HTTP como DELETE
    });
    return response.json(); // Devuelve la respuesta en formato JSON
}
