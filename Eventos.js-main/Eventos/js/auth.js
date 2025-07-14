// public/js/auth.js

/**
 * Módulo para manejar la autenticación de usuarios y la persistencia de sesión.
 * Utiliza localStorage para almacenar la información del usuario.
 */

const AUTH_API_BASE_URL = 'http://localhost:3000'; // URL base para json-server
const USER_STORAGE_KEY = 'currentUser'; // Clave para almacenar el usuario en localStorage

/**
 * Registra un nuevo usuario en la "base de datos" (json-server).
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña del usuario.
 * @param {string} role - Rol del usuario ('admin' o 'visitor').
 * @returns {Promise<object>} - Promesa que resuelve con los datos del usuario registrado.
 * @throws {Error} Si el nombre de usuario ya existe o hay un error en la red.
 */
export async function registerUser(username, password, role) {
    try {
        // Verificar si el nombre de usuario ya existe
        const existingUsersResponse = await fetch(`${AUTH_API_BASE_URL}/users?username=${username}`);
        const existingUsers = await existingUsersResponse.json();

        if (existingUsers.length > 0) {
            throw new Error('El nombre de usuario ya está en uso.');
        }

        // Si no existe, registrar el nuevo usuario
        const response = await fetch(`${AUTH_API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario.');
        }

        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error('Error en registerUser:', error);
        throw error; // Propagar el error para que sea manejado por la interfaz de usuario
    }
}

/**
 * Inicia sesión para un usuario.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - Promesa que resuelve con los datos del usuario autenticado.
 * @throws {Error} Si las credenciales son inválidas o hay un error en la red.
 */
export async function loginUser(username, password) {
    try {
        const response = await fetch(`${AUTH_API_BASE_URL}/users?username=${username}&password=${password}`);
        const users = await response.json();

        if (users.length === 1) {
            const user = users[0];
            // Almacenar la información del usuario en localStorage para persistencia de sesión
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            return user;
        } else {
            throw new Error('Credenciales inválidas.');
        }
    } catch (error) {
        console.error('Error en loginUser:', error);
        throw error;
    }
}

/**
 * Cierra la sesión del usuario actual.
 * Elimina la información del usuario de localStorage.
 */
export function logoutUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
    console.log('Sesión cerrada.');
}

/**
 * Obtiene la información del usuario actualmente autenticado desde localStorage.
 * @returns {object | null} - Objeto de usuario si hay una sesión activa, de lo contrario null.
 */
export function getCurrentUser() {
    const userString = localStorage.getItem(USER_STORAGE_KEY);
    return userString ? JSON.parse(userString) : null;
}

/**
 * Verifica si un usuario está autenticado.
 * @returns {boolean} - True si hay un usuario autenticado, de lo contrario false.
 */
export function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Verifica el rol del usuario actual.
 * @returns {string | null} - El rol del usuario ('admin' o 'visitor') o null si no hay usuario.
 */
export function getUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}
