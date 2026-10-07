// ================= CROCHEVA PRODUCTS =================


// ================= PRODUCT DATA =================

let products = [];


// ================= HTML ELEMENTS =================

const productsGrid =
    document.getElementById("productsGrid");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// ================= LOAD PRODUCTS FROM DATABASE =================

async function loadProducts() {

    try {

        const response =
            await fetch("http://localhost:5000/api/products");

        const data =
            await response.json();

        if (!data.success) {

            console.error("Failed to load products.");

            productsGrid.innerHTML = `
                <div class="no-products">
                    <h2>Unable to Load Products</h2>
                    <p>Products could not be loaded.</p>
                </div>
            `;

            return;
        }

        // Store database products
        products = data.products;

        // Check URL category
        const urlParams =
            new URLSearchParams(window.location.search);

        const selectedCategory =
            urlParams.get("category");


        if (selectedCategory) {

            const matchingButton =
                Array.from(filterButtons).find(function (button) {

                    return button.getAttribute("data-category")
                        === selectedCategory;

                });


            if (matchingButton) {

                filterButtons.forEach(function (button) {

                    button.classList.remove("active");

                });

                matchingButton.classList.add("active");

                displayProducts(selectedCategory);

            } else {

                displayProducts("All");

            }

        } else {

            displayProducts("All");

        }

    } catch (error) {

        console.error("Products API Error:", error);

        productsGrid.innerHTML = `
            <div class="no-products">
                <h2>Unable to Load Products</h2>
                <p>Please make sure CROCHEVA backend is running.</p>
            </div>
        `;

    }

}


// ================= DISPLAY PRODUCTS =================

function displayProducts(category = "All") {

    productsGrid.innerHTML = "";


    let filteredProducts;


    if (category === "All") {

        filteredProducts = products;

    } else {

        filteredProducts =
            products.filter(function (product) {

                return product.category === category;

            });

    }


    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `

            <div class="no-products">

                <h2>No Products Found</h2>

                <p>
                    No products are available in this category.
                </p>

            </div>

        `;

        return;
    }


    filteredProducts.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <span class="product-category">
                    ${product.category}
                </span>

            </div>


            <div class="product-content">

                <h2>
                    ${product.name}
                </h2>

                <p class="product-category-name">
                    ${product.category}
                </p>

                <p class="product-price">
                    ₹${product.price}
                </p>


                <div class="product-buttons">

                    <a
                        href="product-details.html?id=${product.id}"
                        class="details-btn"
                    >
                        View Details
                    </a>


                    <button
                        class="cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>


                <button
                    class="buy-btn"
                    onclick="buyNow(${product.id})"
                >
                    Buy Now
                </button>

            </div>

        `;


        productsGrid.appendChild(card);

    });

}


// ================= ADD TO CART =================

function addToCart(productId) {

    const product =
        products.find(function (item) {

            return item.id === productId;

        });


    if (!product) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("crochevaCart")
        ) || [];


    const existingProduct =
        cart.find(function (item) {

            return item.id === productId;

        });


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "crochevaCart",
        JSON.stringify(cart)
    );


    showToast(
        product.name + " added to cart!"
    );

}


// ================= BUY NOW =================

function buyNow(productId) {

    const product =
        products.find(function (item) {

            return item.id === productId;

        });


    if (!product) {
        return;
    }


    localStorage.setItem(
        "crochevaBuyNow",
        JSON.stringify({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            image: product.image,

            quantity: 1

        })
    );


    window.location.href =
        "checkout.html";

}


// ================= TOAST =================

function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}


// ================= FILTER =================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {


        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const category =
            button.getAttribute("data-category");


        displayProducts(category);

    });

});


// ================= LOAD PRODUCTS =================

// Start loading products from SQLite API

loadProducts();


// ================= FOOTER YEAR =================

const yearElement =
    document.getElementById("year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}