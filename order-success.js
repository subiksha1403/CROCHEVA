// ========================================
// CROCHEVA ORDER SUCCESS
// ========================================

// GET LAST ORDER
const order = JSON.parse(
    localStorage.getItem("crochevaLastOrder")
);


// ========================================
// HTML ELEMENTS
// ========================================

const orderIdElement =
    document.getElementById("orderId");

const customerNameElement =
    document.getElementById("customerName");

const customerPhoneElement =
    document.getElementById("customerPhone");

const customerEmailElement =
    document.getElementById("customerEmail");

const customerAddressElement =
    document.getElementById("customerAddress");

const productsElement =
    document.getElementById("orderProducts");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const totalElement =
    document.getElementById("total");

const paymentElement =
    document.getElementById("paymentMethod");

const successCard =
    document.querySelector(".success-card");

const noOrderCard =
    document.getElementById("noOrderCard");


// ========================================
// CHECK ORDER
// ========================================

if (!order) {

    // Hide success card
    if (successCard) {
        successCard.style.display = "none";
    }

    // Show no order card
    if (noOrderCard) {
        noOrderCard.style.display = "block";
    }

} else {

    // ========================================
    // ORDER ID
    // ========================================

    if (orderIdElement) {
        orderIdElement.textContent =
            order.orderId || "---";
    }


    // ========================================
    // CUSTOMER DETAILS
    // ========================================

    const customer =
        order.customer || {};


    // NAME
    if (customerNameElement) {
        customerNameElement.textContent =
            customer.name || "---";
    }


    // PHONE
    if (customerPhoneElement) {
        customerPhoneElement.textContent =
            customer.phone || "---";
    }


    // EMAIL
    if (customerEmailElement) {
        customerEmailElement.textContent =
            customer.email || "---";
    }


    // DELIVERY ADDRESS
    if (customerAddressElement) {
        customerAddressElement.textContent =
            customer.address ||
            order.to ||
            "---";
    }


    // ========================================
    // PAYMENT METHOD
    // ========================================

    if (paymentElement) {
        paymentElement.textContent =
            order.paymentMethod || "---";
    }


    // ========================================
    // ORDER PRODUCTS
    // ========================================

    if (productsElement) {

        const products =
            Array.isArray(order.products)
                ? order.products
                : [];

        if (products.length === 0) {

            productsElement.innerHTML = `
                <p class="no-products">
                    No product details available.
                </p>
            `;

        } else {

            productsElement.innerHTML =
                products.map(function (item) {

                    const price =
                        Number(item.price) || 0;

                    const quantity =
                        Number(item.quantity) || 1;

                    const itemTotal =
                        price * quantity;

                    return `
                        <div class="success-product">

                            <div class="success-product-image">

                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                >

                            </div>


                            <div class="success-product-info">

                                <h3>
                                    ${item.name}
                                </h3>

                                <p>
                                    Quantity:
                                    ${quantity}
                                </p>

                                <p>
                                    ₹${price} × ${quantity}
                                </p>

                                <strong>
                                    ₹${itemTotal}
                                </strong>

                            </div>

                        </div>
                    `;

                }).join("");
        }
    }


    // ========================================
    // BILL
    // ========================================

    if (subtotalElement) {
        subtotalElement.textContent =
            `₹${Number(order.subtotal) || 0}`;
    }


    if (discountElement) {
        discountElement.textContent =
            `- ₹${Number(order.discount) || 0}`;
    }


    if (totalElement) {
        totalElement.textContent =
            `₹${Number(order.total) || 0}`;
    }

}


// ========================================
// CURRENT YEAR
// ========================================

const yearElement =
    document.getElementById("currentYear");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}