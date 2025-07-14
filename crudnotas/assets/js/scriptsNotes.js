const APP_URL = "http://localhost:3000/";
const user = JSON.parse(localStorage.getItem("user"));
const selectedNote = JSON.parse(localStorage.getItem("selectedNote"));

const titleElement = document.querySelector("h2");
const contentInput = document.getElementById("noteContent");
const saveBtn = document.getElementById("saveBtn");
const shareBtn = document.getElementById("shareBtn");
const deleteBtn = document.getElementById("deleteBtn");

if (selectedNote) {
    titleElement.textContent = selectedNote.title;
    contentInput.value = selectedNote.content;
} else {
    titleElement.textContent = "New Note";
    deleteBtn.style.display = "none";
    shareBtn.style.display = "none";
}

saveBtn.addEventListener("click", async () => {
    const content = contentInput.value.trim();
    const title = titleElement.textContent.trim();

    if (!title || !content) {
        alert("Please complete both title and content");
        return;
    }

    const noteData = {
        userId: user.id,
        title,
        content,
        shared: selectedNote?.shared || false
    };

    if (selectedNote) {
        // Edit
        await fetch(`${APP_URL}/notes/${selectedNote.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData)
        });
        alert("Note updated");
    } else {
        // Create
        await fetch(`${APP_URL}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(noteData)
        });
        alert("Note created");
    }

    localStorage.removeItem("selectedNote");
    window.location.href = "./dashboard.html";
});

deleteBtn.addEventListener("click", async () => {
    if (!selectedNote || selectedNote.userId !== user.id) return;

    const confirmDelete = confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    await fetch(`${APP_URL}/notes/${selectedNote.id}`, {
        method: "DELETE"
    });

    alert("Note deleted");
    localStorage.removeItem("selectedNote");
    window.location.href = "./dashboard.html";
});

shareBtn.addEventListener("click", async () => {
    if (!selectedNote) return;

    const updatedNote = { ...selectedNote, shared: true };
    await fetch(`${APP_URL}/notes/${selectedNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shared: true })
    });

    alert("Note shared");
});
