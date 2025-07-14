import { authLogin } from "./auth.js";

const nameInput = document.getElementById("FullName");
const emailInput = document.getElementById("Email");
const usernameInput = document.getElementById("Username");
const passwordInput = document.getElementById("Password");
const registerForm = document.getElementById("registerForm");
const APP_URL = "http://localhost:3000/";

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await registerUser();
});

async function registerUser() {
    if (!nameInput.value || !emailInput.value || !usernameInput.value || !passwordInput.value) {
        alert("Please fill in all fields");
        return;
    }else if (passwordInput.value.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
    }else if (!emailInput.value.includes("@")) {
        alert("Please enter a valid email address");
        return;
    }
    try {
        const resUsers = await fetch(APP_URL + "users");
        const users = await resUsers.json();
        const emailOrUsernameExists = users.some(user =>
            user.Email === emailInput.value || user.Username === usernameInput.value
        );
        if (emailOrUsernameExists) {
            alert("Email or Username already exists");
            return;
        }
        const res = await fetch(APP_URL + "users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            FullName: nameInput.value,
            Email: emailInput.value,
            Username: usernameInput.value,
            Password: passwordInput.value
            })
        });

        if (res.ok) {
            const user = await res.json();
            alert(`User registered successfully: ${user.FullName}`);
            const success = await authLogin(emailInput.value, passwordInput.value);
            if (success) {
                window.location.href = "../pages/dashboard.html";
            }
        } else {
            alert("Error registering user");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("Error registering user. Please try again.");
    }
}
