// js/auth.js  
// Este archivo maneja la autenticacion y la sesion del usuario

// Guarda la sesion del usuario en SessionStorage
export function saveSession(user) { // Función para guardar sesión
    sessionStorage.setItem('currentUser', JSON.stringify(user)); // Convierte el objeto usuario a string y lo guarda en sessionStorage bajo la clave 'currentUser'
}

// Obtiene la sesion del usuario actual
export function getSession() { // Función para obtener la sesión actual
    const user = sessionStorage.getItem('currentUser'); // Obtiene el valor guardado en sessionStorage bajo la clave 'currentUser'
    return user ? JSON.parse(user) : null; // Si existe, lo convierte de string a objeto y lo retorna, si no existe devuelve null
}

// Cierra la sesion del usuario
export function logout() { // Función para cerrar la sesión
    sessionStorage.removeItem('currentUser'); // Elimina del sessionStorage la clave 'currentUser' para cerrar sesión
}

// Verifica si hay una sesion activa
export function isAuthenticated() { // Función para validar si hay usuario autenticado
    return getSession() !== null; // Retorna true si hay sesión guardada, false si no
}

// Verifica si el usuario autenticado es administrador
export function isAdmin() { // Función para verificar si el usuario es admin
    const user = getSession(); // Obtiene usuario actual
    return user && user.role === 'admin'; // Retorna true si existe usuario y su rol es admin, false si no
}
