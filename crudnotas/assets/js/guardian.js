const authUser = sessionStorage.getItem("auth");
if (authUser !== "true") {
    window.location.href = "../pages/login.html";
}