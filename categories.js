// ================= CROCHEVA CATEGORIES PAGE =================


// FOOTER YEAR

const yearElement = document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// ================= CATEGORY CARD HOVER =================

const categoryCards =
    document.querySelectorAll(".category-card");

categoryCards.forEach(function (card) {

    card.addEventListener("mouseenter", function () {

        card.classList.add("hovered");

    });


    card.addEventListener("mouseleave", function () {

        card.classList.remove("hovered");

    });

});