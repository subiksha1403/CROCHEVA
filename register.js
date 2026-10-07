/* ================================
   CROCHEVA REGISTER
================================ */


/* ================================
   ELEMENTS
================================ */

const registerForm =
    document.getElementById("registerForm");

const nameInput =
    document.getElementById("name");

const dobInput =
    document.getElementById("dob");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const addressInput =
    document.getElementById("address");

const registerMessage =
    document.getElementById("registerMessage");

const togglePassword =
    document.getElementById("togglePassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


/* ================================
   SHOW MESSAGE
================================ */

function showMessage(message, type) {

    registerMessage.textContent = message;

    registerMessage.className =
        "message " + type;

}


/* ================================
   SHOW / HIDE PASSWORD
================================ */

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";

    }

});


/* ================================
   SHOW / HIDE CONFIRM PASSWORD
================================ */

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";

        toggleConfirmPassword.textContent = "Hide";

    } else {

        confirmPasswordInput.type = "password";

        toggleConfirmPassword.textContent = "Show";

    }

});


/* ================================
   PHONE NUMBER
   ONLY NUMBERS
================================ */

phoneInput.addEventListener("input", function () {

    phoneInput.value =
        phoneInput.value.replace(/\D/g, "");

});


/* ================================
   REGISTER
================================ */

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    /* GET VALUES */

    const name =
        nameInput.value.trim();

    const dob =
        dobInput.value;

    const email =
        emailInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const password =
        passwordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    const address =
        addressInput.value.trim();


    /* ================================
       VALIDATION
    ================================= */

    if (
        name === "" ||
        dob === "" ||
        email === "" ||
        phone === "" ||
        password === "" ||
        confirmPassword === "" ||
        address === ""
    ) {

        showMessage(
            "Please fill all the fields.",
            "error"
        );

        return;
    }


    /* PHONE VALIDATION */

    if (!/^[0-9]{10}$/.test(phone)) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return;
    }


    /* PASSWORD LENGTH */

    if (password.length < 6) {

        showMessage(
            "Password must contain at least 6 characters.",
            "error"
        );

        return;
    }


    /* PASSWORD MATCH */

    if (password !== confirmPassword) {

        showMessage(
            "Passwords do not match.",
            "error"
        );

        return;
    }


    /* ================================
       SEND DATA TO BACKEND
    ================================= */

    try {

        showMessage(
            "Creating your account...",
            "success"
        );


        const response = await fetch(
            "http://localhost:5000/api/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    dob: dob,

                    email: email,

                    phone: phone,

                    password: password,

                    address: address

                })
            }
        );


        const data = await response.json();


        /* ================================
           BACKEND ERROR
        ================================= */

        if (!response.ok) {

            showMessage(
                data.message || "Registration failed.",
                "error"
            );

            return;
        }


        /* ================================
           CUSTOMER OBJECT
        ================================= */

        const customer = {

            id: data.customerId,

            name: name,

            dob: dob,

            email: email,

            phone: phone,

            password: password,

            address: address

        };


        /* ================================
           SAVE LOGIN DATA
        ================================= */

        localStorage.setItem(
            "crochevaCustomer",
            JSON.stringify(customer)
        );


        localStorage.setItem(
            "crochevaLoggedIn",
            "true"
        );


        /* ================================
           SUCCESS MESSAGE
        ================================= */

        showMessage(
            "Account created successfully! Welcome to CROCHEVA.",
            "success"
        );


        /* ================================
           REDIRECT TO PROFILE
        ================================= */

        setTimeout(function () {

            window.location.href =
                "profile.html";

        }, 1200);

    }

    catch (error) {

        console.error("Registration Error:", error);

        showMessage(
            "Cannot connect to CROCHEVA server. Please make sure the backend is running.",
            "error"
        );

    }

});


/* ================================
   CURRENT YEAR
================================ */

document.getElementById("currentYear").textContent =
    new Date().getFullYear();