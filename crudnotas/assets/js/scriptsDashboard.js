document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            sessionStorage.removeItem("auth");
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");

            window.location.href = "../../index.html";
        });
    }
});

document.getElementById("userGreeting").textContent = `Hello, ${JSON.parse(localStorage.getItem("user"))}`;

const personalNotes = document.getElementById("personalNotes");
const sharedNotes = document.getElementById("sharedNotes");
const APP_URL = "http://localhost:3000";

async function loadNotes() {
    const res = await fetch(APP_URL + "notes");
    const notes = await res.json();
    
    personalNotes.innerHTML = "";
    sharedNotes.innerHTML = "";

    notes.forEach(note => {
        const card = document.createElement("div");
        card.className = "col-md-3";
        card.innerHTML = `
            <div class="border rounded-3 p-3">
                <i class="bi bi-journal-text fs-4"></i>
                <h6 class="fw-bold mt-2">${note.title}</h6>
                <small class="text-muted">${note.content.slice(0, 40)}...</small>
            </div>
        `;
        card.addEventListener("click", () => {
            localStorage.setItem("selectedNote", JSON.stringify(note));
            window.location.href = "./notes.html";
        });

        if (note.userId === user.id) {
            personalNotes.appendChild(card);
        } else if (note.shared === true) {
            sharedNotes.appendChild(card);
        }
    });
}

loadNotes();
