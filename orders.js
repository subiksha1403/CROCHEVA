const ordersContainer = document.getElementById("ordersContainer");
const emptyOrders = document.getElementById("emptyOrders");


// ========================================
// LOAD ORDERS FROM BACKEND
// ========================================

async function loadOrders() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/orders"
        );

        const data = await response.json();

        if (!data.success || data.orders.length === 0) {

            showEmptyOrders();
            return;
        }

        displayOrders(data.orders);

    } catch (error) {

        console.error("Orders error:", error);

        // Fallback to localStorage
        const orders =
            JSON.parse(
                localStorage.getItem("crochevaOrders")
            ) || [];

        if (orders.length === 0) {

            showEmptyOrders();

        } else {

            displayOrders(orders);

        }

    }

}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(orders) {

    if (emptyOrders) {
        emptyOrders.style.display = "none";
    }

    if (!ordersContainer) return;

    ordersContainer.innerHTML = "";

    orders.reverse().forEach((order) => {

        const products =
            order.products || order.items || [];

        const customer =
            order.customer || {};

        const orderHTML = `

            <div class="order-card">

                <div class="order-header">

                    <div>
                        <h3>
                            Order #${order.orderId || order.order_id}
                        </h3>

                        <p>
                            ${order.date || order.order_date || ""}
                        </p>
                    </div>

                    <span class="order-status">
                        ${order.status || "Order Placed"}
                    </span>

                </div>


                <div class="order-customer">

                    <p>
                        <strong>Name:</strong>
                        ${customer.name || order.customer_name || ""}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${customer.phone || order.phone || ""}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${customer.email || order.email || ""}
                    </p>

                    <p>
                        <strong>Address:</strong>
                        ${customer.address || order.address || ""}
                    </p>

                </div>


                <div class="order-products">

                    ${products.map((item) => `

                        <div class="order-product">

                            <img
                                src="${item.image || ""}"
                                alt="${item.name || item.product_name}"
                            >

                            <div>

                                <h4>
                                    ${item.name || item.product_name}
                                </h4>

                                <p>
                                    Quantity:
                                    ${item.quantity}
                                </p>

                                <p>
                                    ₹${item.price}
                                </p>

                            </div>

                        </div>

                    `).join("")}

                </div>


                <div class="order-summary">

                    <p>
                        Payment:
                        <strong>
                            ${order.paymentMethod || order.payment_method}
                        </strong>
                    </p>

                    <p>
                        Subtotal:
                        ₹${order.subtotal}
                    </p>

                    <p>
                        Discount:
                        ₹${order.discount || 0}
                    </p>

                    <h3>
                        Total:
                        ₹${order.total}
                    </h3>

                </div>


                ${
                    (order.status || "Order Placed")
                    !== "Cancelled"

                    ? `
                        <button
                            class="cancel-order-btn"
                            onclick="cancelOrder('${order.orderId || order.order_id}')"
                        >
                            Cancel Order
                        </button>
                    `
                    : ""
                }

            </div>

        `;

        ordersContainer.innerHTML += orderHTML;

    });

}


// ========================================
// EMPTY ORDERS
// ========================================

function showEmptyOrders() {

    if (ordersContainer) {

        ordersContainer.innerHTML = "";

    }

    if (emptyOrders) {

        emptyOrders.style.display = "block";

        emptyOrders.innerHTML = `
            <h2>No Orders Yet</h2>

            <a href="products.html">
                SHOP NOW
            </a>
        `;

    }

}


// ========================================
// CANCEL ORDER
// ========================================

async function cancelOrder(orderId) {

    const confirmCancel =
        confirm("Are you sure you want to cancel this order?");

    if (!confirmCancel) return;


    try {

        const response = await fetch(
            `http://localhost:5000/api/orders/${orderId}/cancel`,
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        if (data.success) {

            loadOrders();

        }

    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );

    }

}


// ========================================
// YEAR
// ========================================

const yearElement =
    document.getElementById("currentYear");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// ========================================
// START
// ========================================

loadOrders();