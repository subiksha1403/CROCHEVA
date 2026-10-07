/* ================================
   CROCHEVA LOGIN
================================ */

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");


// Show message
function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = "message " + type;
}


// Show / Hide password
togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});


// Login
loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;


    // Empty field validation
    if (email === "" || password === "") {

        showMessage(
            "Please enter email and password.",
            "error"
        );

        return;
    }


    try {

        showMessage(
            "Logging in...",
            "success"
        );


        // Send login request to backend
        const response = await fetch(
            "http://localhost:5000/api/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        // Login failed
        if (!response.ok) {

            showMessage(
                data.message || "Login failed.",
                "error"
            );

            return;
        }


        // Save customer details
        localStorage.setItem(
            "crochevaCustomer",
            JSON.stringify(data.customer)
        );


        // Set login status
        localStorage.setItem(
            "crochevaLoggedIn",
            "true"
        );


        showMessage(
            "Login successful! Welcome back.",
            "success"
        );


        // Go to profile
        setTimeout(function () {

            window.location.href = "profile.html";

        }, 1000);


    } catch (error) {

        console.error("Login Error:", error);

        showMessage(
            "Cannot connect to CROCHEVA server. Please make sure the backend is running.",
            "error"
        );

    }

});


// Footer year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();