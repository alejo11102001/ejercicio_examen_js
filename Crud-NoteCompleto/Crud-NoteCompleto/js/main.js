// Importa funciones relacionadas con usuarios, notas y suscripciones desde services.js
import { getUsers, registerUser, getAllNotes, createNote, updateNote, deleteNote as apiDeleteNote, addSubscription, deleteUser as apiDeleteUser, updateUser as apiUpdateUser, getSubscriptions, deleteSubscription as apiDeleteSubscription } from './services.js';

// Importa funciones relacionadas con la autenticación y sesión desde auth.js
import { getSession, saveSession, logout, isAuthenticated, isAdmin } from './auth.js';

// Importa funciones que renderizan las vistas principales de la aplicación desde ui.js
import { renderLoginView, renderRegisterView, renderHomeView, renderProfileView, renderAdminView } from './ui.js';

// Selecciona el contenedor principal donde se renderizarán las vistas
const app = document.getElementById('app');

// Objeto con las rutas de la aplicación, cada una indica su vista y si requiere autenticación/admin
const routes = {
    '/login': { view: renderLoginView, requiresAuth: false },
    '/register': { view: renderRegisterView, requiresAuth: false },
    '/home': { view: renderHomeView, requiresAuth: true, action: loadHomeData },
    '/profile': { view: renderProfileView, requiresAuth: true, action: loadProfileData },
    '/admin': { view: renderAdminView, requiresAuth: true, requiresAdmin: true, action: loadAdminData },
};

// Actualiza la navegación según si el usuario está logueado y si es administrador
function updateNav() {
    const auth = isAuthenticated(); // Comprueba si hay sesión activa
    const admin = isAdmin(); // Comprueba si el usuario es admin
    document.getElementById('nav-home').classList.toggle('d-none', !auth); // Oculta o muestra Home
    document.getElementById('nav-profile').classList.toggle('d-none', !auth); // Oculta o muestra Profile
    document.getElementById('nav-logout').classList.toggle('d-none', !auth); // Oculta o muestra Logout
    document.getElementById('nav-admin').classList.toggle('d-none', !admin); // Oculta o muestra Admin
    const brandLink = document.querySelector('.navbar-brand'); // Selecciona el enlace del logo
    if (auth) { // Si hay sesión, redirige al home o admin según rol
        brandLink.href = admin ? '#/admin' : '#/home';
    } else { // Si no hay sesión, redirige a login
        brandLink.href = '#/login';
    }
}

// Controla las rutas de la aplicación, redirecciona y carga vistas según corresponda
async function router() {
    const path = window.location.hash.substring(1) || '/login'; // Lee la ruta hash actual
    const route = routes[path]; // Busca la ruta en la tabla de rutas
    updateNav(); // Actualiza navegación superior
    if (!route) { // Si no existe la ruta, redirige a login
        window.location.hash = '/login';
        return;
    }
    if (route.requiresAuth && !isAuthenticated()) { // Si necesita sesión y no está logueado
        window.location.hash = '/login';
        return;
    }
    if (route.requiresAdmin && !isAdmin()) { // Si necesita admin y no es admin
        window.location.hash = '/home';
        return;
    }
    if (route.action) { // Si tiene acción especial (cargar datos)
        app.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>'; // Muestra spinner
        await route.action(); // Ejecuta la función de carga
    } else {
        route.view(); // Renderiza la vista si no requiere carga previa
    }
    addEventListenersForView(path); // Asigna los listeners a la vista actual
}

// Carga las notas del usuario y las compartidas para la vista Home
async function loadHomeData() {
    const currentUser = getSession(); // Obtiene el usuario actual
    const allNotes = await getAllNotes(); // Obtiene todas las notas del sistema
    const personalNotes = allNotes.filter(note => note.ownerId === currentUser.id); // Filtra las que son propias
    const sharedNotes = allNotes.filter(note => // Filtra las compartidas
        note.sharedWith && note.sharedWith.some(share => share.userId === currentUser.id)
    ).map(note => {
        const shareInfo = note.sharedWith.find(share => share.userId === currentUser.id); // Obtiene el permiso compartido
        return { ...note, permission: shareInfo.permission }; // Retorna la nota con permiso
    });
    renderHomeView(personalNotes, sharedNotes); // Renderiza la vista Home con las notas filtradas
}

// Carga los datos del perfil para la vista Profile
async function loadProfileData() {
    const currentUser = getSession(); // Obtiene el usuario actual
    renderProfileView(currentUser); // Renderiza la vista Profile con el usuario
}

// Carga todos los datos necesarios para la vista Admin
async function loadAdminData() {
    const allUsers = await getUsers(); // Obtiene todos los usuarios
    const allNotes = await getAllNotes(); // Obtiene todas las notas
    const allSubscriptions = await getSubscriptions(); // Obtiene todas las suscripciones
    const usersById = Object.fromEntries(allUsers.map(u => [u.id, u])); // Convierte el array a objeto por id
    renderAdminView(allUsers, allNotes, usersById, allSubscriptions); // Renderiza la vista Admin
}

// Asigna eventos según la vista actual (por hash)
function addEventListenersForView(path) {
    if (path === '/login') {
        document.getElementById('login-form').addEventListener('submit', handleLogin); // Login
    }
    if (path === '/register') {
        document.getElementById('register-form').addEventListener('submit', handleRegister); // Registro
    }
    if (path === '/home' || path === '/admin') {
        const noteForm = document.getElementById('note-form'); // Formulario de notas
        if (noteForm && !noteForm.dataset.listenerAdded) { // Evita múltiples listeners
            noteForm.addEventListener('submit', handleSaveNote);
            noteForm.dataset.listenerAdded = 'true'; // Marca que ya tiene listener
        }
    }
    if (path === '/profile') {
        document.getElementById('change-password-form').addEventListener('submit', handleChangePassword); // Cambiar contraseña
    }
}

// Convierte un archivo a Base64 para guardar imágenes en localStorage
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Lector de archivos
        reader.readAsDataURL(file); // Lee como base64
        reader.onload = () => resolve(reader.result); // Devuelve resultado
        reader.onerror = error => reject(error); // Devuelve error si falla
    });
}
// Función que maneja el formulario de login
async function handleLogin(e) {
    e.preventDefault(); // Previene que el formulario recargue la página
    const identifier = document.getElementById('login-identifier').value; // Obtiene el valor del campo usuario/correo
    const password = document.getElementById('login-password').value; // Obtiene la contraseña
    const users = await getUsers(); // Obtiene todos los usuarios
    const user = users.find(u => (u.email === identifier || u.username === identifier) && u.password === password); // Busca usuario que coincida en correo/usuario y contraseña
    if (user) { // Si encontró el usuario
        saveSession(user); // Guarda la sesión
        window.location.hash = user.role === 'admin' ? '/admin' : '/home'; // Redirige según rol
    } else { // Si no encontró usuario válido
        alert('Credenciales incorrectas.'); // Muestra alerta
    }
}

// Función que maneja el registro de usuarios nuevos
async function handleRegister(e) {
    e.preventDefault(); // Previene recarga
    const username = document.getElementById('register-username').value; // Obtiene username
    const email = document.getElementById('register-email').value; // Obtiene email
    const password = document.getElementById('register-password').value; // Obtiene contraseña
    const users = await getUsers(); // Obtiene usuarios existentes
    if (users.some(u => u.username === username || u.email === email)) { // Verifica si usuario o correo ya existen
        alert('El nombre de usuario o el correo electronico ya estan registrados.'); // Muestra alerta
        return; // Detiene ejecución
    }
    const newUser = { username, email, password, role: 'user', registrationDate: new Date().toISOString() }; // Crea objeto usuario
    await registerUser(newUser); // Registra usuario
    alert('Registro exitoso. Ahora puedes iniciar sesion.'); // Muestra éxito
    window.location.hash = '/login'; // Redirige a login
}

// Función que guarda o actualiza una nota
async function handleSaveNote(e) {
    e.preventDefault(); // Previene recarga
    const title = document.getElementById('note-title').value; // Obtiene título
    const content = document.getElementById('note-content').value; // Obtiene contenido
    const imageUrl = document.getElementById('note-image-url').value; // Obtiene URL imagen
    const imageFile = document.getElementById('note-image-file').files[0]; // Obtiene archivo imagen
    const noteId = document.getElementById('note-id').value; // Obtiene id de la nota
    const currentUser = getSession(); // Obtiene usuario actual
    if (!title || !content) { // Verifica campos obligatorios
        alert('El titulo y el contenido son obligatorios.'); // Muestra alerta
        return; // Detiene ejecución
    }
    let finalImageUrl = imageUrl; // Usa imagen URL por defecto
    if (imageFile) { // Si hay archivo, lo convierte a Base64
        finalImageUrl = await toBase64(imageFile);
    }
    if (noteId) { // Si existe id, edita nota existente
        const existingNote = (await getAllNotes()).find(n => n.id === parseInt(noteId)); // Busca nota por id
        await updateNote(noteId, { ...existingNote, title, content, imageUrl: finalImageUrl }); // Actualiza nota
    } else { // Si no hay id, crea nueva nota
        const noteData = { title, content, ownerId: currentUser.id, imageUrl: finalImageUrl, sharedWith: [] }; // Crea objeto nota
        await createNote(noteData); // Crea nota
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('note-modal')); // Obtiene modal bootstrap
    modal.hide(); // Oculta modal
    router(); // Refresca vista
}

// Función que maneja el cambio de contraseña
async function handleChangePassword(e) {
    e.preventDefault(); // Previene recarga
    const newPassword = document.getElementById('profile-new-password').value; // Obtiene nueva contraseña
    if (!newPassword || newPassword.length < 6) { // Valida longitud
        alert("La nueva contrasena debe tener al menos 6 caracteres."); // Muestra alerta
        return; // Detiene ejecución
    }
    const currentUser = getSession(); // Obtiene usuario actual
    await apiUpdateUser(currentUser.id, { ...currentUser, password: newPassword }); // Actualiza usuario
    saveSession({ ...currentUser, password: newPassword }); // Guarda nueva sesión
    alert("Contrasena actualizada con exito."); // Muestra éxito
    document.getElementById('change-password-form').reset(); // Limpia formulario
}

// --- FUNCIONES GLOBALES (LLAMADAS DESDE HTML) ---
window.viewNote = async (noteId, isEditable) => {
    if (!noteId) {
        // Si no hay ID significa que quieres crear una nueva nota
        document.getElementById('note-id').value = '';
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        document.getElementById('note-image-url').value = '';
        document.getElementById('note-image-preview').src = 'https://cdn.prod.website-files.com/5ec7dad2e6f6295a9e2a23dd/6582f25642a96b818502c50d_Design.ai.jpg';
        document.getElementById('note-title').disabled = !isEditable;
        document.getElementById('note-content').disabled = !isEditable;
        document.getElementById('note-image-url').disabled = !isEditable;
        document.getElementById('note-image-file').disabled = !isEditable;
        document.querySelector('#note-form button[type="submit"]').style.display = isEditable ? 'block' : 'none';
        document.getElementById('btn-remove-image').style.display = 'none';
        new bootstrap.Modal(document.getElementById('note-modal')).show();
        return;
    }

    // Si hay ID, buscar la nota
    const allNotes = await getAllNotes();
    const note = allNotes.find(n => n.id === noteId);
    if (!note) {
        alert('Nota no encontrada.');
        return;
    }

    document.getElementById('note-id').value = note.id;
    document.getElementById('note-title').value = note.title;
    document.getElementById('note-content').value = note.content;
    document.getElementById('note-image-url').value = note.imageUrl && note.imageUrl.startsWith('http') ? note.imageUrl : '';
    document.getElementById('note-image-preview').src = note.imageUrl || 'https://via.placeholder.com/150';
    document.getElementById('note-title').disabled = !isEditable;
    document.getElementById('note-content').disabled = !isEditable;
    document.getElementById('note-image-url').disabled = !isEditable;
    document.getElementById('note-image-file').disabled = !isEditable;
    document.querySelector('#note-form button[type="submit"]').style.display = isEditable ? 'block' : 'none';
    document.getElementById('btn-remove-image').style.display = (note.imageUrl && isEditable) ? 'inline-block' : 'none';

    new bootstrap.Modal(document.getElementById('note-modal')).show();
};


// Función global para eliminar nota
window.deleteUserNote = async (noteId) => {
    if (confirm('Estas seguro de que quieres eliminar esta nota?')) { // Confirma
        await apiDeleteNote(noteId); // Elimina nota
        router(); // Refresca vista
    }
};

// Función para compartir nota a otro usuario
window.shareNote = async (noteId) => {
    const identifier = prompt('Ingresa el email o username del usuario para compartir la nota:'); // Pide usuario
    if (!identifier) return; // Si no escribe nada, detiene
    const users = await getUsers(); // Obtiene usuarios
    const targetUser = users.find(u => u.email === identifier || u.username === identifier); // Busca por username/email
    if (!targetUser) { // Si no existe
        alert('Usuario no encontrado.'); // Muestra alerta
        return;
    }
    const currentUser = getSession(); // Obtiene usuario actual
    if (targetUser.id === currentUser.id) { // Si intenta compartir consigo mismo
        alert('No puedes compartir una nota contigo mismo.'); // Alerta
        return;
    }
    const permission = prompt('Que permiso deseas dar? (escribe "readonly" o "edit")'); // Pide permiso
    if (permission !== 'readonly' && permission !== 'edit') { // Valida permiso
        alert('Permiso no valido. Usa "readonly" o "edit".'); // Alerta
        return;
    }
    const allNotes = await getAllNotes(); // Obtiene notas
    const noteToShare = allNotes.find(n => n.id === noteId); // Busca nota
    noteToShare.sharedWith = noteToShare.sharedWith || []; // Asegura propiedad
    const existingShare = noteToShare.sharedWith.findIndex(s => s.userId === targetUser.id); // Busca duplicados
    if (existingShare !== -1) { // Si ya estaba compartido, actualiza permiso
        noteToShare.sharedWith[existingShare] = { userId: targetUser.id, permission };
    } else { // Si no estaba, lo agrega
        noteToShare.sharedWith.push({ userId: targetUser.id, permission });
    }
    await updateNote(noteId, noteToShare); // Actualiza nota
    alert(`Nota compartida con ${targetUser.username} con permiso de ${permission}.`); // Alerta éxito
    router(); // Refresca
};

// Función para eliminar usuario desde Admin
window.deleteAnyUser = async (userId) => {
    const currentUser = getSession(); // Obtiene usuario actual
    if (userId === currentUser.id) { // Si intenta eliminarse a sí mismo
        alert("No puedes eliminar tu propia cuenta de administrador."); // Alerta
        return;
    }
    if (confirm("Estas seguro de que quieres eliminar a este usuario? Esta accion no se puede deshacer.")) { // Confirma
        await apiDeleteUser(userId); // Elimina usuario
        router(); // Refresca vista
    }
};

// Función para eliminar imagen de nota
window.removeImage = async (noteId) => {
    if (confirm("Estas seguro de que quieres eliminar la imagen de esta nota?")) { // Confirma
        const allNotes = await getAllNotes(); // Obtiene notas
        const note = allNotes.find(n => n.id === parseInt(noteId)); // Busca nota por id
        note.imageUrl = ""; // Elimina imagen
        await updateNote(noteId, note); // Actualiza nota
        document.getElementById('note-image-preview').src = 'https://via.placeholder.com/150'; // Imagen por defecto
        document.getElementById('btn-remove-image').style.display = 'none'; // Oculta botón
        alert("Imagen eliminada. Guarda la nota para confirmar los cambios."); // Alerta
    }
};

// Función para eliminar suscripción
window.deleteSubscription = async (subscriptionId) => {
    if (confirm("Estas seguro de que quieres eliminar esta suscripcion?")) { // Confirma
        await apiDeleteSubscription(subscriptionId); // Elimina suscripción
        alert("Suscripcion eliminada."); // Alerta
        router(); // Refresca admin
    }
};

// Función ficticia para enviar email (no implementada)
window.sendEmailToSubscribers = () => {
    alert("Funcionalidad de enviar correo a suscriptores no implementada en este demo. Esto requeriria un backend real para el envio de emails."); // Alerta
};

// Función para aplicar tema claro/oscuro
function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark'); // Cambia clase CSS
    const toggler = document.getElementById('theme-toggler'); // Botón de tema
    if (toggler) { // Si existe
        toggler.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>'; // Cambia icono
    }
    localStorage.setItem('theme', theme); // Guarda preferencia en storage
}

// Evento para botón de cambio de tema
document.getElementById('theme-toggler')?.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark'; // Cambia entre temas
    applyTheme(newTheme); // Aplica tema
});

// Evento para formulario de suscripción
document.getElementById('subscription-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene recarga
    const emailInput = document.getElementById('sub-email'); // Obtiene input email
    const email = emailInput.value; // Valor email
    try {
        await addSubscription(email); // Agrega suscripción
        alert('Gracias por suscribirte! Tu correo ha sido registrado.'); // Éxito
        emailInput.value = ''; // Limpia campo
    } catch (error) {
        alert('Hubo un error al procesar tu solicitud.'); // Error
    }
});

// Evento para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault(); // Previene recarga
    logout(); // Elimina sesión
    window.location.hash = '/login'; // Redirige login
    updateNav(); // Actualiza navbar
});

// Al cargar la página aplica tema y carga ruta inicial
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') || 'light'); // Aplica tema guardado
    router(); // Ejecuta router inicial
    window.addEventListener('hashchange', router); // Escucha cambios de hash
});
