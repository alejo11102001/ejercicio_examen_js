// js/ui.js
// Este archivo contiene las funciones para crear y renderizar los componentes de la UI

// Obtiene el elemento con id 'app' para renderizar las vistas dentro de él
const app = document.getElementById('app');

// Renderiza la vista de Login
export function renderLoginView() {
    // Inserta el HTML para el formulario de inicio de sesión en el contenedor 'app'
    app.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Iniciar Sesion</h2>
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="login-identifier" class="form-label">Email o Usuario</label>
                                <input type="text" class="form-control" id="login-identifier" required>
                            </div>
                            <div class="mb-3">
                                <label for="login-password" class="form-label">Contrasena</label>
                                <input type="password" class="form-control" id="login-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Ingresar</button>
                        </form>
                        <p class="mt-3 text-center">
                            No tienes cuenta? <a href="#/register">Registrate aqui</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza la vista de Registro
export function renderRegisterView() {
    // Inserta el HTML para el formulario de registro en el contenedor 'app'
    app.innerHTML = `
        <div class="row justify-content-center mt-5">
            <div class="col-md-6 col-lg-5">
                <div class="card shadow-sm">
                    <div class="card-body p-4">
                        <h2 class="card-title text-center mb-4">Registro de Usuario</h2>
                        <form id="register-form">
                            <div class="mb-3">
                                <label for="register-username" class="form-label">Nombre de Usuario</label>
                                <input type="text" class="form-control" id="register-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-email" class="form-label">Correo Electronico</label>
                                <input type="email" class="form-control" id="register-email" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-password" class="form-label">Contrasena</label>
                                <input type="password" class="form-control" id="register-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Registrar</button>
                        </form>
                        <p class="mt-3 text-center">
                            Ya tienes cuenta? <a href="#/login">Inicia sesion</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza la vista Principal (Home) con las notas
export function renderHomeView(personalNotes, sharedNotes) {
    // Inserta el HTML para la vista principal de notas en el contenedor 'app'
    app.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>Mis Notas</h1>
            <button class="btn btn-primary" onclick="window.viewNote(null, true)">
                <i class="bi bi-plus-lg"></i> Crear Nota
            </button>
        </div>

        <h3>Personales</h3>
        <div id="personal-notes-container" class="row g-4">
            ${personalNotes.length > 0 ? personalNotes.map(note => renderNoteCard(note, true)).join('') : '<p>No has creado ninguna nota.</p>'}
        </div>

        <hr class="my-4">

        <h3>Compartidas Conmigo</h3>
        <div id="shared-notes-container" class="row g-4">
            ${sharedNotes.length > 0 ? sharedNotes.map(note => renderNoteCard(note, false)).join('') : '<p>Nadie ha compartido notas contigo.</p>'}
        </div>

        ${renderNoteModal()}
    `;
}

// Renderiza una tarjeta de nota individual
function renderNoteCard(note, isOwner) {
    // Verifica si la nota es editable (si es del dueño o tiene permiso de editar)
    const isEditable = isOwner || note.permission === 'edit';
    // Crea un resumen corto del contenido de la nota
    const noteContent = note.content ? note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '') : '';
    // Devuelve el HTML para la tarjeta de la nota
    return `
        <div class="col-sm-6 col-lg-4">
            <div class="card h-100 note-card shadow-sm">
                ${note.imageUrl ? `<img src="${note.imageUrl}" class="card-img-top" alt="Imagen de la nota" style="max-height: 200px; object-fit: cover;">` : ''}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text flex-grow-1">${noteContent}</p>
                    <div class="mt-auto">
                        <button class="btn btn-sm btn-info" onclick="viewNote(${note.id}, ${isEditable})">Ver / Editar</button>
                        ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteUserNote(${note.id})">Eliminar</button>` : ''}
                        ${isOwner ? `<button class="btn btn-sm btn-secondary" onclick="shareNote(${note.id})">Compartir</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza el modal para crear/editar notas
function renderNoteModal() {
    // Devuelve el HTML del modal Bootstrap para crear o editar una nota
    return `
        <div class="modal fade" id="note-modal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="note-modal-title">Gestionar Nota</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="note-form">
                            <input type="hidden" id="note-id">
                            <div class="mb-3">
                                <label for="note-title" class="form-label">Titulo</label>
                                <input type="text" class="form-control" id="note-title" required>
                            </div>
                            <div class="mb-3">
                                <label for="note-content" class="form-label">Contenido</label>
                                <textarea class="form-control" id="note-content" rows="5" required></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="note-image-url" class="form-label">URL de la Imagen (Opcional)</label>
                                    <input type="url" class="form-control" id="note-image-url" placeholder="https://ejemplo.com/imagen.jpg">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="note-image-file" class="form-label">O subir desde tu PC</label>
                                    <input class="form-control" type="file" id="note-image-file" accept="image/*">
                                </div>
                            </div>
                            <div class="mb-3 text-center">
                                <img src="https://via.placeholder.com/150" id="note-image-preview" class="img-fluid rounded" style="max-height: 200px;">
                                <button type="button" class="btn btn-sm btn-warning mt-2" id="btn-remove-image" onclick="removeImage(document.getElementById('note-id').value)">Quitar Imagen</button>
                            </div>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza la vista de Perfil
export function renderProfileView(user) {
    // Inserta el HTML de la vista perfil con información del usuario en 'app'
    app.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-body">
                        <h3 class="card-title text-center">Mi Perfil</h3>
                        <p class="fs-5"><strong>Usuario:</strong> ${user.username}</p>
                        <p class="fs-5"><strong>Email:</strong> ${user.email}</p>
                        <p class="fs-5"><strong>Miembro desde:</strong> ${new Date(user.registrationDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title text-center">Cambiar Contrasena</h4>
                        <form id="change-password-form">
                           <div class="mb-3">
                                <label for="profile-new-password" class="form-label">Nueva Contrasena</label>
                                <input type="password" class="form-control" id="profile-new-password" required minlength="6">
                            </div>
                            <button type="submit" class="btn btn-warning">Actualizar Contrasena</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Renderiza el panel de Administracion
export function renderAdminView(allUsers, allNotes, usersById, allSubscriptions) {
    // Obtiene al usuario actual desde sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    // Inserta el HTML completo para la vista de administración dentro del contenedor 'app'
    app.innerHTML = `
        <h1 class="mb-4">Panel de Administracion</h1>
        
        <div class="row g-4 mb-4">
            <div class="col-md-6">
                <div class="card text-white bg-primary h-100">
                    <div class="card-body text-center">
                        <h4 class="card-title">Total de Usuarios</h4>
                        <p class="display-4">${allUsers.length}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card text-white bg-success h-100">
                    <div class="card-body text-center">
                        <h4 class="card-title">Total de Notas</h4>
                        <p class="display-4">${allNotes.length}</p>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="mt-5 mb-3">Gestion de Usuarios</h2>
        <div class="table-responsive mb-4">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Registro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${allUsers.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${user.role}</td>
                            <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
                            <td>
                                ${user.id !== currentUser.id ? `<button class="btn btn-sm btn-danger" onclick="deleteAnyUser(${user.id})">Eliminar</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <h2 class="mt-5 mb-3">Gestion Total de Notas</h2>
        <div class="table-responsive mb-4">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titulo</th>
                        <th>Contenido</th>
                        <th>Dueño</th>
                        <th>Imagen</th>
                        <th>Compartida Con</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${allNotes.map(note => `
                        <tr>
                            <td>${note.id}</td>
                            <td>${note.title}</td>
                            <td>${note.content ? note.content.substring(0, 50) + '...' : ''}</td>
                            <td>${usersById[note.ownerId]?.username || 'Desconocido'}</td>
                            <td>${note.imageUrl ? '<i class="bi bi-image-fill text-info"></i>' : '<i class="bi bi-x-circle-fill text-muted"></i>'}</td>
                            <td>${note.sharedWith && note.sharedWith.length > 0 ? note.sharedWith.map(s => `${usersById[s.userId]?.username || 'Desconocido'} (${s.permission})`).join(', ') : 'Nadie'}</td>
                            <td>
                                <button class="btn btn-sm btn-info" onclick="viewNote(${note.id}, true)">Ver / Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteUserNote(${note.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <h2 class="mt-5 mb-3">Gestion de Suscripciones</h2>
        <div class="d-flex justify-content-end mb-3">
            <button class="btn btn-success" onclick="window.sendEmailToSubscribers()">
                <i class="bi bi-envelope-fill"></i> Enviar Correo a Suscriptores
            </button>
        </div>
        <div class="table-responsive mb-4">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${allSubscriptions.length > 0 ? allSubscriptions.map(sub => `
                        <tr>
                            <td>${sub.id}</td>
                            <td>${sub.email}</td>
                            <td>
                                <button class="btn btn-sm btn-danger" onclick="deleteSubscription(${sub.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="3" class="text-center">No hay suscripciones registradas.</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>

        ${renderNoteModal()}
    `;
}
