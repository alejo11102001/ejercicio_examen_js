import { authLogin } from "./auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const btnSignIn = document.getElementById("btnSignIn");

btnSignIn.addEventListener("click", async (e) => {
    e.preventDefault();
    await enterLogin();
});

async function enterLogin() {
    const success = await authLogin(emailInput.value, passwordInput.value);
    if (success) {
        alert("Login successful");
        window.location.href = "../pages/dashboard.html";
    } else {
        alert("Invalid credentials");
    }
}
