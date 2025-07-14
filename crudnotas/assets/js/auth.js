const APP_URL = "http://localhost:3000/";

export async function authLogin(emailOrUsername, password) {
    const res = await fetch(APP_URL + "users");
    const users = await res.json();

    const foundUser = users.find(user =>
        (user.Email === emailOrUsername || user.Username === emailOrUsername) &&
        user.Password === password
    );

    if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser.FullName));
        sessionStorage.setItem("auth", "true");
        return true;
    } else {
        return false;
    }
}
