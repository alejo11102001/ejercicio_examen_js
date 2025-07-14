const toggleBtn = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    // Cambiar icono: sol ↔ luna
    icon.classList.toggle("bi-brightness-high-fill", !isDark); // sol
    icon.classList.toggle("bi-moon-fill", isDark); // luna
});
