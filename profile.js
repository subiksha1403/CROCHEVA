/* =========================================
   CROCHEVA - PROFILE PAGE
========================================= */


// =========================================
// GET CUSTOMER DATA
// =========================================

const loggedIn =
    localStorage.getItem("crochevaLoggedIn") === "true";

const customer =
    JSON.parse(localStorage.getItem("crochevaCustomer"));


// =========================================
// LOGIN CHECK
// =========================================

if (!loggedIn || !customer) {

    window.location.href = "login.html";

}


// =========================================
// PROFILE ELEMENTS
// =========================================

const displayName =
    document.getElementById("displayName");

const displayEmail =
    document.getElementById("displayEmail");

const profileAvatar =
    document.getElementById("profileAvatar");

const nameElement =
    document.getElementById("name");

const phoneElement =
    document.getElementById("phone");

const emailElement =
    document.getElementById("email");

const dobElement =
    document.getElementById("dob");

const addressElement =
    document.getElementById("address");


// =========================================
// DISPLAY PROFILE
// =========================================

function displayCustomer() {

    if (!customer) {
        return;
    }

    displayName.textContent =
        customer.name || "Customer";

    displayEmail.textContent =
        customer.email || "No email";

    profileAvatar.textContent =
        customer.name
            ? customer.name.charAt(0).toUpperCase()
            : "C";

    nameElement.textContent =
        customer.name || "—";

    phoneElement.textContent =
        customer.phone || "—";

    emailElement.textContent =
        customer.email || "—";

    dobElement.textContent =
        customer.dob || "—";

    addressElement.textContent =
        customer.address || "—";
}


// Display when page loads
displayCustomer();


// =========================================
// EDIT PROFILE ELEMENTS
// =========================================

const editProfileBtn =
    document.getElementById("editProfileBtn");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const editForm =
    document.getElementById("editForm");

const editName =
    document.getElementById("editName");

const editPhone =
    document.getElementById("editPhone");

const editEmail =
    document.getElementById("editEmail");

const editDob =
    document.getElementById("editDob");

const editAddress =
    document.getElementById("editAddress");


// =========================================
// OPEN EDIT PROFILE
// =========================================

editProfileBtn.addEventListener(
    "click",
    function () {

        // Put existing details inside form

        editName.value =
            customer.name || "";

        editPhone.value =
            customer.phone || "";

        editEmail.value =
            customer.email || "";

        editDob.value =
            customer.dob || "";

        editAddress.value =
            customer.address || "";


        // Open modal

        editModal.style.display = "flex";

        editModal.classList.add("active");

    }
);


// =========================================
// CLOSE EDIT MODAL
// =========================================

closeModal.addEventListener(
    "click",
    function () {

        editModal.classList.remove("active");

        editModal.style.display = "none";

    }
);


cancelEditBtn.addEventListener(
    "click",
    function () {

        editModal.classList.remove("active");

        editModal.style.display = "none";

    }
);


// =========================================
// SAVE EDITED PROFILE
// =========================================

editForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Get updated values

        const updatedName =
            editName.value.trim();

        const updatedPhone =
            editPhone.value.trim();

        const updatedEmail =
            editEmail.value.trim();

        const updatedDob =
            editDob.value;

        const updatedAddress =
            editAddress.value.trim();


        // =====================================
        // VALIDATION
        // =====================================

        if (
            updatedName === "" ||
            updatedPhone === "" ||
            updatedEmail === ""
        ) {

            showToast(
                "Please fill all required fields."
            );

            return;

        }


        if (
            !/^[0-9]{10}$/.test(updatedPhone)
        ) {

            showToast(
                "Please enter a valid 10-digit phone number."
            );

            return;

        }


        try {

            showToast(
                "Updating profile..."
            );


            // =====================================
            // SEND DATA TO BACKEND
            // =====================================

            const response =
                await fetch(
                    `http://localhost:5000/api/customers/${customer.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            name: updatedName,

                            dob: updatedDob,

                            email: updatedEmail,

                            phone: updatedPhone,

                            address: updatedAddress

                        })
                    }
                );


            const data =
                await response.json();


            // =====================================
            // BACKEND ERROR
            // =====================================

            if (!response.ok) {

                showToast(
                    data.message ||
                    "Profile update failed."
                );

                return;

            }


            // =====================================
            // UPDATE LOCAL CUSTOMER DATA
            // =====================================

            customer.name =
                updatedName;

            customer.phone =
                updatedPhone;

            customer.email =
                updatedEmail;

            customer.dob =
                updatedDob;

            customer.address =
                updatedAddress;


            // =====================================
            // SAVE TO LOCAL STORAGE
            // =====================================

            localStorage.setItem(
                "crochevaCustomer",
                JSON.stringify(customer)
            );


            // =====================================
            // UPDATE PROFILE DISPLAY
            // =====================================

            displayCustomer();


            // =====================================
            // CLOSE MODAL
            // =====================================

            editModal.classList.remove("active");

            editModal.style.display = "none";


            // =====================================
            // SUCCESS MESSAGE
            // =====================================

            showToast(
                "Profile updated successfully!"
            );

        }

        catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );

            showToast(
                "Cannot connect to CROCHEVA server."
            );

        }

    }
);


// =========================================
// LOGOUT ELEMENTS
// =========================================

const logoutBtn =
    document.getElementById("logoutBtn");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogoutBtn =
    document.getElementById("cancelLogoutBtn");

const confirmLogoutBtn =
    document.getElementById("confirmLogoutBtn");


// =========================================
// OPEN LOGOUT MODAL
// =========================================

logoutBtn.addEventListener(
    "click",
    function () {

        logoutModal.style.display = "flex";

        logoutModal.classList.add("active");

    }
);


// =========================================
// CANCEL LOGOUT
// =========================================

cancelLogoutBtn.addEventListener(
    "click",
    function () {

        logoutModal.classList.remove("active");

        logoutModal.style.display = "none";

    }
);


// =========================================
// CONFIRM LOGOUT
// =========================================

confirmLogoutBtn.addEventListener(
    "click",
    function () {

        // Remove only login status

        localStorage.removeItem(
            "crochevaLoggedIn"
        );


        // Close modal

        logoutModal.classList.remove("active");

        logoutModal.style.display = "none";


        // Go to login page

        window.location.href =
            "login.html";

    }
);


// =========================================
// TOAST MESSAGE
// =========================================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) {
        return;
    }


    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove("show");

        },
        2500
    );

}


// =========================================
// FOOTER YEAR
// =========================================

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}