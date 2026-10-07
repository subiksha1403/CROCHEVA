// ================= CROCHEVA HOME PAGE =================


// FOOTER YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// SHOP NOW BUTTON

const shopButton = document.querySelector(".shop-btn");

if (shopButton) {

    shopButton.addEventListener("click", function () {

        window.location.href = "products.html";

    });

}


// EXPLORE COLLECTION BUTTON

const exploreButton = document.querySelector(".explore-btn");

if (exploreButton) {

    exploreButton.addEventListener("click", function () {

        window.location.href = "categories.html";

    });

}