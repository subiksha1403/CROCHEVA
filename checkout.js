// ========================================
// CROCHEVA CHECKOUT
// ========================================


// ========================================
// GET BUY NOW / CART
// ========================================

let buyNow =
    JSON.parse(
        localStorage.getItem("crochevaBuyNow")
    );

let cart =
    JSON.parse(
        localStorage.getItem("crochevaCart")
    );

let checkoutItems = [];


// BUY NOW

if (buyNow) {

    checkoutItems =
        Array.isArray(buyNow)
            ? buyNow
            : [buyNow];

}


// CART

else if (Array.isArray(cart)) {

    checkoutItems = cart;

}


// ========================================
// NORMALIZE DATA
// ========================================

checkoutItems =
    checkoutItems.map(function (item) {

        return {

            id: item.id,

            name: item.name,

            category:
                item.category || "",

            price:
                Number(item.price) || 0,

            image:
                item.image || "",

            quantity:
                Number(item.quantity) || 1

        };

    });


// ========================================
// CUSTOMER
// ========================================

const customer =
    JSON.parse(
        localStorage.getItem(
            "crochevaCustomer"
        )
    );

const loggedIn =
    localStorage.getItem(
        "crochevaLoggedIn"
    ) === "true";


// ========================================
// HTML ELEMENTS
// ========================================

const nameInput =
    document.getElementById(
        "fullName"
    );

const phoneInput =
    document.getElementById(
        "phone"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const addressInput =
    document.getElementById(
        "address"
    );

const fromAddressInput =
    document.getElementById(
        "fromAddress"
    );

const toAddressInput =
    document.getElementById(
        "toAddress"
    );

const codRadio =
    document.getElementById(
        "cod"
    );

const upiRadio =
    document.getElementById(
        "upi"
    );

const upiSection =
    document.getElementById(
        "upiSection"
    );

const qrCode =
    document.getElementById(
        "qrCode"
    );

const summaryContainer =
    document.getElementById(
        "checkoutItems"
    );

const subtotalElement =
    document.getElementById(
        "subtotal"
    );

const discountElement =
    document.getElementById(
        "discount"
    );

const totalElement =
    document.getElementById(
        "total"
    );

const placeOrderBtn =
    document.getElementById(
        "placeOrderBtn"
    );


// ========================================
// CUSTOMER DETAILS
// ========================================

if (
    loggedIn &&
    customer
) {

    if (nameInput) {

        nameInput.value =
            customer.name || "";

    }

    if (phoneInput) {

        phoneInput.value =
            customer.phone || "";

    }

    if (emailInput) {

        emailInput.value =
            customer.email || "";

    }

    if (addressInput) {

        addressInput.value =
            customer.address || "";

    }

}


// ========================================
// FROM
// ========================================

if (fromAddressInput) {

    fromAddressInput.value =
        "CROCHEVA";

}


// ========================================
// TO
// ========================================

if (
    toAddressInput &&
    customer &&
    customer.address
) {

    toAddressInput.value =
        customer.address;

}


// ========================================
// CALCULATE SUBTOTAL
// ========================================

let subtotal = 0;

checkoutItems.forEach(
    function (item) {

        const price =
            Number(item.price) || 0;

        const quantity =
            Number(item.quantity) || 1;

        subtotal +=
            price * quantity;

    }
);


// ========================================
// DISCOUNT
// ========================================

let discount = 0;

if (subtotal >= 299) {

    discount = 100;

}


// ========================================
// TOTAL
// ========================================

let total =
    subtotal - discount;


// ========================================
// DISPLAY PRODUCTS
// ========================================

if (summaryContainer) {

    if (
        checkoutItems.length === 0
    ) {

        summaryContainer.innerHTML = `

            <p>
                No items to checkout.
            </p>

        `;

    }

    else {

        summaryContainer.innerHTML =

            checkoutItems.map(
                function (item) {

                    const price =
                        Number(item.price) || 0;

                    const quantity =
                        Number(item.quantity) || 1;

                    const itemTotal =
                        price * quantity;

                    return `

                        <div class="checkout-product">

                            <img
                                src="${item.image}"
                                alt="${item.name}"
                            >

                            <div>

                                <h4>
                                    ${item.name}
                                </h4>

                                <p>
                                    Quantity:
                                    ${quantity}
                                </p>

                                <p>
                                    ₹${price}
                                    ×
                                    ${quantity}
                                </p>

                                <strong>
                                    ₹${itemTotal}
                                </strong>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }

}


// ========================================
// DISPLAY BILL
// ========================================

if (subtotalElement) {

    subtotalElement.textContent =
        `₹${subtotal}`;

}


if (discountElement) {

    discountElement.textContent =
        `- ₹${discount}`;

}


if (totalElement) {

    totalElement.textContent =
        `₹${total}`;

}


// ========================================
// UPI QR
// ========================================

if (upiRadio) {

    upiRadio.addEventListener(
        "change",
        function () {

            if (this.checked) {

                if (upiSection) {

                    upiSection.style.display =
                        "block";

                }

                if (qrCode) {

                    const upiLink =
                        "upi://pay?pa=crocheva@upi" +
                        "&pn=CROCHEVA" +
                        "&am=" +
                        total +
                        "&cu=INR";

                    qrCode.src =
                        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
                        encodeURIComponent(
                            upiLink
                        );

                }

            }

        }
    );

}


// ========================================
// COD
// ========================================

if (codRadio) {

    codRadio.addEventListener(
        "change",
        function () {

            if (this.checked) {

                if (upiSection) {

                    upiSection.style.display =
                        "none";

                }

            }

        }
    );

}


// ========================================
// PLACE ORDER
// ========================================

if (placeOrderBtn) {

    placeOrderBtn.addEventListener(
        "click",
        async function () {


            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const address =
                addressInput
                    ? addressInput.value.trim()
                    : "";

            const toAddress =
                toAddressInput
                    ? toAddressInput.value.trim()
                    : address;


            // ========================================
            // PAYMENT
            // ========================================

            let paymentMethod = "";


            if (
                codRadio &&
                codRadio.checked
            ) {

                paymentMethod =
                    "COD";

            }


            if (
                upiRadio &&
                upiRadio.checked
            ) {

                paymentMethod =
                    "UPI";

            }


            // ========================================
            // VALIDATION
            // ========================================

            if (!name) {

                showMessage(
                    "Please enter your name."
                );

                return;

            }


            if (!phone) {

                showMessage(
                    "Please enter your phone number."
                );

                return;

            }


            if (!email) {

                showMessage(
                    "Please enter your email."
                );

                return;

            }


            if (!address) {

                showMessage(
                    "Please enter your address."
                );

                return;

            }


            if (!toAddress) {

                showMessage(
                    "Please enter TO address."
                );

                return;

            }


            if (!paymentMethod) {

                showMessage(
                    "Please select payment method."
                );

                return;

            }


            if (
                checkoutItems.length === 0
            ) {

                showMessage(
                    "Your cart is empty."
                );

                return;

            }


            if (total <= 0) {

                showMessage(
                    "Order total is ₹0. Please select a valid product."
                );

                return;

            }


            // ========================================
            // ORDER ID
            // ========================================

            const orderId =
                "CRV" +
                Date.now();


            // ========================================
            // BACKEND
            // ========================================

            try {

                const response =
                    await fetch(
                        "/api/orders",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    orderId:
                                        orderId,

                                    customerId:
                                        customer &&
                                        customer.id
                                            ? customer.id
                                            : null,

                                    customerName:
                                        name,

                                    phone:
                                        phone,

                                    email:
                                        email,

                                    address:
                                        toAddress,

                                    subtotal:
                                        subtotal,

                                    discount:
                                        discount,

                                    total:
                                        total,

                                    paymentMethod:
                                        paymentMethod,

                                    products:
                                        checkoutItems

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!data.success) {

                    showMessage(
                        data.message ||
                        "Order failed."
                    );

                    return;

                }


                // ========================================
                // LOCAL ORDER
                // ========================================

                const order = {

                    orderId:
                        orderId,

                    date:
                        new Date()
                            .toISOString(),

                    customer: {

                        name:
                            name,

                        phone:
                            phone,

                        email:
                            email,

                        address:
                            toAddress

                    },

                    from:
                        "CROCHEVA",

                    to:
                        toAddress,

                    products:
                        checkoutItems,

                    subtotal:
                        subtotal,

                    discount:
                        discount,

                    total:
                        total,

                    paymentMethod:
                        paymentMethod,

                    status:
                        "Order Placed"

                };


                // ========================================
                // SAVE ORDERS
                // ========================================

                let orders =
                    JSON.parse(
                        localStorage.getItem(
                            "crochevaOrders"
                        )
                    ) || [];


                orders.push(order);


                localStorage.setItem(
                    "crochevaOrders",
                    JSON.stringify(
                        orders
                    )
                );


                // ========================================
                // LAST ORDER
                // ========================================

                localStorage.setItem(
                    "crochevaLastOrder",
                    JSON.stringify(
                        order
                    )
                );


                // ========================================
                // CUSTOMER
                // ========================================

                localStorage.setItem(
                    "crochevaCustomer",
                    JSON.stringify({

                        ...(customer || {}),

                        name:
                            name,

                        phone:
                            phone,

                        email:
                            email,

                        address:
                            toAddress

                    })
                );


                // ========================================
                // CLEAR BUY NOW
                // ========================================

                localStorage.removeItem(
                    "crochevaBuyNow"
                );


                // ========================================
                // CLEAR CART
                // ========================================

                if (!buyNow) {

                    localStorage.removeItem(
                        "crochevaCart"
                    );

                }


                // ========================================
                // SUCCESS
                // ========================================

                window.location.href =
                    "order-success.html";

            }


            catch (error) {

                console.error(
                    "Order error:",
                    error
                );

                showMessage(
                    "Backend connection failed."
                );

            }

        }
    );

}


// ========================================
// MESSAGE
// ========================================

function showMessage(message) {

    let toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toast";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// ========================================
// YEAR
// ========================================

const yearElement =
    document.getElementById(
        "currentYear"
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}