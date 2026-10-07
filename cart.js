/* =================================
   CROCHEVA CART
================================= */


/* =================================
   GET CART
================================= */

let cart = JSON.parse(
    localStorage.getItem("crochevaCart")
) || [];


/* =================================
   DISPLAY CART
================================= */

function displayCart() {

    const container =
        document.getElementById("cartContainer");


    /* EMPTY CART */

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>No Items in Your Cart</h2>

                <p>
                    Your cart is waiting for some
                    beautiful handmade crochet pieces.
                </p>

                <a
                    href="products.html"
                    class="shop-now-btn"
                >
                    SHOP NOW
                </a>

            </div>

        `;

        return;
    }


    /* CALCULATE SUBTOTAL */

    let subtotal = 0;

    let totalItems = 0;


    cart.forEach(function(item) {

        subtotal += item.price * item.quantity;

        totalItems += item.quantity;

    });


    /* CART HTML */

    let cartHTML = `

        <div class="cart-layout">

            <!-- CART ITEMS -->

            <div class="cart-items">

    `;


    cart.forEach(function(item) {

        const itemTotal =
            item.price * item.quantity;


        cartHTML += `

            <div class="cart-item">

                <!-- IMAGE -->

                <div class="cart-item-image">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="cart-item-info">

                    <span class="cart-category">
                        ${item.category}
                    </span>

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-item-price">
                        ₹${item.price}
                    </p>


                    <!-- QUANTITY -->

                    <div class="quantity-box">

                        <button
                            type="button"
                            onclick="decreaseQuantity(${item.id})"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="increaseQuantity(${item.id})"
                        >
                            +
                        </button>

                    </div>

                </div>


                <!-- TOTAL + REMOVE -->

                <div class="cart-item-right">

                    <div class="item-total">
                        ₹${itemTotal}
                    </div>

                    <button
                        type="button"
                        class="remove-btn"
                        onclick="removeItem(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;

    });


    cartHTML += `

            </div>


            <!-- CART SUMMARY -->

            <div class="cart-summary">

                <h2>Order Summary</h2>


                <div class="summary-row">

                    <span>
                        Items
                    </span>

                    <span class="summary-value">
                        ${totalItems}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Subtotal
                    </span>

                    <span class="summary-value">
                        ₹${subtotal}
                    </span>

                </div>


                <div class="summary-row">

                    <span>
                        Delivery
                    </span>

                    <span class="summary-value">
                        Calculated at checkout
                    </span>

                </div>


                <div class="summary-row total">

                    <span>
                        Total
                    </span>

                    <span>
                        ₹${subtotal}
                    </span>

                </div>


                <button
                    type="button"
                    class="checkout-btn"
                    onclick="goToCheckout()"
                >
                    PROCEED TO CHECKOUT
                </button>


                <a
                    href="products.html"
                    class="continue-shopping"
                >
                    ← Continue Shopping
                </a>

            </div>

        </div>

    `;


    container.innerHTML = cartHTML;

}


/* =================================
   INCREASE QUANTITY
================================= */

function increaseQuantity(productId) {

    const item = cart.find(
        product => product.id === productId
    );


    if (item) {

        item.quantity++;

        saveCart();

        displayCart();

    }

}


/* =================================
   DECREASE QUANTITY
================================= */

function decreaseQuantity(productId) {

    const item = cart.find(
        product => product.id === productId
    );


    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        showToast(
            "Quantity cannot be less than 1"
        );

        return;
    }


    saveCart();

    displayCart();

}


/* =================================
   REMOVE ITEM
================================= */

function removeItem(productId) {

    const item = cart.find(
        product => product.id === productId
    );


    if (!item) {
        return;
    }


    cart = cart.filter(
        product => product.id !== productId
    );


    saveCart();

    displayCart();


    showToast(
        `${item.name} removed from cart`
    );

}


/* =================================
   SAVE CART
================================= */

function saveCart() {

    localStorage.setItem(
        "crochevaCart",
        JSON.stringify(cart)
    );

}


/* =================================
   GO TO CHECKOUT
================================= */

function goToCheckout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty"
        );

        return;
    }


    /* Remove old Buy Now item */

    localStorage.removeItem(
        "crochevaBuyNow"
    );


    window.location.href =
        "checkout.html";

}


/* =================================
   TOAST
================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 2500);

}


/* =================================
   CURRENT YEAR
================================= */

document.getElementById(
    "currentYear"
).textContent = new Date().getFullYear();


/* =================================
   LOAD CART
================================= */

displayCart();