/* ================================
   CROCHEVA PRODUCT DETAILS
================================ */


/* ================================
   PRODUCT DESCRIPTIONS
================================ */

const productDescriptions = {

    1: "A cute handmade crochet bee keychain, perfect for bags, keys and everyday use.",

    2: "A soft and adorable handmade crochet bunny keychain for your everyday accessories.",

    3: "A beautiful handmade crochet flower keychain with a simple and cute design.",

    4: "A lovely crochet heart keychain designed to add a handmade touch to your bag.",

    5: "A cute strawberry-inspired crochet keychain made for your bags and keys.",

    6: "A delicate handmade butterfly crochet charm that adds a cute touch to your phone.",

    7: "A soft cloud-inspired crochet phone charm with a simple handmade aesthetic.",

    8: "A tiny handmade crochet heart charm designed for phones and small accessories.",

    9: "A charming handmade crochet flower phone accessory with a cute floral design.",

    10: "A playful cherry-inspired crochet phone charm made for a fun handmade look.",

    11: "A handmade crochet rose that brings a warm and timeless floral touch to any space.",

    12: "A cheerful handmade crochet daisy designed to brighten up your space.",

    13: "A vibrant handmade crochet sunflower crafted to stay beautiful for a long time.",

    14: "A delicate handmade crochet lavender flower with a calm and elegant appearance.",

    15: "A beautiful handmade crochet tulip made to add a soft floral touch to your collection.",

    16: "A cute crochet hair rope designed for everyday styling and comfortable use.",

    17: "A handmade crochet bow clip that adds a soft and stylish touch to your hairstyle.",

    18: "Cute handmade crochet scrunchies suitable for simple everyday hairstyles.",

    19: "Simple handmade crochet hair clips designed for an easy everyday look.",

    20: "A comfortable handmade crochet hairband with a simple and elegant appearance.",

    21: "A soft handmade crochet bunny toy made with a cute and friendly design.",

    22: "A handmade crochet teddy toy with a soft and adorable appearance.",

    23: "A cute handmade crochet penguin toy designed with a playful appearance.",

    24: "A handmade crochet Barbie-inspired toy created with a cute decorative design.",

    25: "A cute handmade crochet panda toy with a soft and playful design."

};


/* ================================
   GET PRODUCT ID FROM URL
================================ */

const urlParams =
    new URLSearchParams(window.location.search);

const productId =
    Number(urlParams.get("id"));


/* ================================
   PRODUCT
================================ */

let product = null;


/* ================================
   QUANTITY
================================ */

let quantity = 1;


/* ================================
   LOAD PRODUCT FROM DATABASE
================================ */

async function loadProduct() {

    const container =
        document.getElementById("productDetails");


    try {

        const response =
            await fetch("http://localhost:5000/api/products");


        const data =
            await response.json();


        if (!data.success) {

            showProductError();

            return;
        }


        /* FIND SELECTED PRODUCT */

        product =
            data.products.find(function (item) {

                return Number(item.id) === productId;

            });


        if (!product) {

            showProductError();

            return;
        }


        /* ADD DESCRIPTION */

        product.description =
            productDescriptions[product.id] ||
            "A beautiful handmade crochet product from CROCHEVA.";


        /* DISPLAY */

        displayProduct();


    } catch (error) {

        console.error(
            "Product API Error:",
            error
        );


        container.innerHTML = `

            <div class="product-error">

                <h2>Unable to Load Product</h2>

                <p>
                    Please make sure CROCHEVA backend is running.
                </p>

                <a href="products.html">
                    Back to Products
                </a>

            </div>

        `;

    }

}


/* ================================
   PRODUCT NOT FOUND
================================ */

function showProductError() {

    const container =
        document.getElementById("productDetails");


    container.innerHTML = `

        <div class="product-error">

            <h2>Product Not Found</h2>

            <p>
                Sorry, the product you are looking for
                is not available.
            </p>

            <a href="products.html">
                Back to Products
            </a>

        </div>

    `;

}


/* ================================
   DISPLAY PRODUCT
================================ */

function displayProduct() {

    const container =
        document.getElementById("productDetails");


    container.innerHTML = `

        <!-- PRODUCT IMAGE -->

        <div class="product-image-box">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <!-- PRODUCT INFO -->

        <div class="product-info">

            <span class="product-category">
                ${product.category}
            </span>


            <h2>
                ${product.name}
            </h2>


            <div class="product-price">
                ₹${product.price}
            </div>


            <p class="product-description">
                ${product.description}
            </p>


            <div class="product-divider"></div>


            <!-- QUANTITY -->

            <p class="quantity-title">
                Quantity
            </p>


            <div class="quantity-box">

                <button
                    type="button"
                    id="decreaseBtn"
                >
                    −
                </button>


                <span id="quantityValue">
                    1
                </span>


                <button
                    type="button"
                    id="increaseBtn"
                >
                    +
                </button>

            </div>


            <!-- BUTTONS -->

            <div class="product-buttons">

                <button
                    type="button"
                    class="add-cart-btn"
                    id="addCartBtn"
                >
                    Add to Cart
                </button>


                <button
                    type="button"
                    class="buy-now-btn"
                    id="buyNowBtn"
                >
                    Buy Now
                </button>

            </div>


            <a
                href="products.html"
                class="back-products"
            >
                ← Back to Products
            </a>

        </div>

    `;


    setupButtons();

}


/* ================================
   SETUP BUTTONS
================================ */

function setupButtons() {

    const decreaseBtn =
        document.getElementById("decreaseBtn");


    const increaseBtn =
        document.getElementById("increaseBtn");


    const quantityValue =
        document.getElementById("quantityValue");


    const addCartBtn =
        document.getElementById("addCartBtn");


    const buyNowBtn =
        document.getElementById("buyNowBtn");


    /* DECREASE */

    decreaseBtn.addEventListener(
        "click",
        function () {

            if (quantity > 1) {

                quantity--;

                quantityValue.textContent =
                    quantity;

            }

        }
    );


    /* INCREASE */

    increaseBtn.addEventListener(
        "click",
        function () {

            quantity++;

            quantityValue.textContent =
                quantity;

        }
    );


    /* ADD TO CART */

    addCartBtn.addEventListener(
        "click",
        function () {

            addToCart();

        }
    );


    /* BUY NOW */

    buyNowBtn.addEventListener(
        "click",
        function () {

            buyNow();

        }
    );

}


/* ================================
   ADD TO CART
================================ */

function addToCart() {

    let cart =
        JSON.parse(
            localStorage.getItem("crochevaCart")
        ) || [];


    const existingProduct =
        cart.find(function (item) {

            return item.id === product.id;

        });


    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            image: product.image,

            quantity: quantity

        });

    }


    localStorage.setItem(
        "crochevaCart",
        JSON.stringify(cart)
    );


    showToast(
        product.name + " added to cart"
    );

}


/* ================================
   BUY NOW
================================ */

function buyNow() {

    const buyNowProduct = {

        id: product.id,

        name: product.name,

        category: product.category,

        price: product.price,

        image: product.image,

        quantity: quantity

    };


    localStorage.setItem(
        "crochevaBuyNow",
        JSON.stringify(buyNowProduct)
    );


    window.location.href =
        "checkout.html";

}


/* ================================
   TOAST MESSAGE
================================ */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}


/* ================================
   CURRENT YEAR
================================ */

const yearElement =
    document.getElementById("currentYear");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* ================================
   START
================================ */

loadProduct();