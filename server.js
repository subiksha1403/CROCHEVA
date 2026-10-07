const express = require("express");
const cors = require("cors");
const db = require("./database/database");

const app = express();


// Allow frontend to connect
app.use(cors());

// Read JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("CROCHEVA Backend is Running!");
});

// Database test route
app.get("/database-test", (req, res) => {
    db.get(
        "SELECT name FROM sqlite_master WHERE type='table'",
        (err, row) => {
            if (err) {
                res.status(500).send("Database Error");
                return;
            }

            res.json({
                message: "CROCHEVA Database Connected!",
                firstTable: row ? row.name : "No tables found"
            });
        }
    );
});

// ========================================
// GET ALL PRODUCTS
// ========================================

// ========================================
// GET ALL PRODUCTS - CORRECT CATEGORY + IMAGE
// ========================================

app.get("/api/products", (req, res) => {

    const sql = `
        SELECT id, name, category, price, image
        FROM products
        ORDER BY id ASC
    `;

    db.all(sql, [], (err, products) => {

        if (err) {

            console.error(
                "Products fetch error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch products."
            });

        }


        // Correct category and image using PRODUCT NAME

        const correctProducts = products.map((product) => {

            const data = {

                "Bee Keychain": {
                    category: "Keychains",
                    image: "images/keychain/bee2.jpg"
                },

                "Bunny Keychain": {
                    category: "Keychains",
                    image: "images/keychain/bunny2.jpg"
                },

                "Flower Keychain": {
                    category: "Keychains",
                    image: "images/keychain/flower.jpg"
                },

                "Heart Keychain": {
                    category: "Keychains",
                    image: "images/keychain/heart.jpg"
                },

                "Strawberry Keychain": {
                    category: "Keychains",
                    image: "images/keychain/strawberry2.jpg"
                },


                "Butterfly Phone Charm": {
                    category: "Phone Charms",
                    image: "images/phonecharm/butterfly2.jpg"
                },

                "Cloud Phone Charm": {
                    category: "Phone Charms",
                    image: "images/phonecharm/cloud2.jpg"
                },

                "Mini Heart Phone Charm": {
                    category: "Phone Charms",
                    image: "images/phonecharm/miniheart2.jpg"
                },

                "Pink Flower Phone Charm": {
                    category: "Phone Charms",
                    image: "images/phonecharm/pinkflower2.jpg"
                },

                "Cherry Phone Charm": {
                    category: "Phone Charms",
                    image: "images/phonecharm/cherry3.jpg"
                },


                "Rose": {
                    category: "Flowers",
                    image: "images/flowers/rose2.jpg"
                },

                "Daisy": {
                    category: "Flowers",
                    image: "images/flowers/daisy2.jpg"
                },

                "Sunflower": {
                    category: "Flowers",
                    image: "images/flowers/sunflower2.jpg"
                },

                "Lavender": {
                    category: "Flowers",
                    image: "images/flowers/lavender2.jpg"
                },

                "Tulip": {
                    category: "Flowers",
                    image: "images/flowers/tulip3.jpg"
                },


                "Hair Rope": {
                    category: "Hair Accessories",
                    image: "images/hairaccessories/band2.jpg"
                },

                "Bow Clip": {
                    category: "Hair Accessories",
                    image: "images/hairaccessories/bowclip2.jpg"
                },

                "Scrunchies": {
                    category: "Hair Accessories",
                    image: "images/hairaccessories/scrunchies2.jpg"
                },

                "Clips": {
                    category: "Hair Accessories",
                    image: "images/hairaccessories/clips2.jpg"
                },

                "Hairband": {
                    category: "Hair Accessories",
                    image: "images/hairaccessories/hbands3.jpg"
                },


                "Bunny Toy": {
                    category: "Toys",
                    image: "images/toys/bunny.jpg"
                },

                "Teddy Toy": {
                    category: "Toys",
                    image: "images/toys/teddy.jpg"
                },

                "Penguin Toy": {
                    category: "Toys",
                    image: "images/toys/penguin.jpg"
                },

                "Barbie Toy": {
                    category: "Toys",
                    image: "images/toys/barbie.jpg"
                },

                "Panda Toy": {
                    category: "Toys",
                    image: "images/toys/panda.jpg"
                }

            };


            if (data[product.name]) {

                return {

                    ...product,

                    category:
                        data[product.name].category,

                    image:
                        data[product.name].image

                };

            }


            return product;

        });


        res.json({

            success: true,

            products: correctProducts

        });

    });

});

// Register API
app.post("/api/register", (req, res) => {

    const { name, dob, email, phone, password, address } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    // Insert customer into database
    const sql = `
        INSERT INTO customers
        (name, dob, email, phone, password, address)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [name, dob, email, phone, password, address],
        function (err) {

            if (err) {

                // Duplicate email
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already registered."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Registration failed."
                });
            }

            res.status(201).json({
                success: true,
                message: "Account created successfully!",
                customerId: this.lastID
            });
        }
    );
});

// Login API
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password."
        });
    }

    const sql = `
        SELECT id, name, dob, email, phone, password, address
        FROM customers
        WHERE email = ?
    `;

    db.get(sql, [email], (err, customer) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Login failed."
            });
        }

        // Email not found
        if (!customer) {
            return res.status(401).json({
                success: false,
                message: "No account found with this email."
            });
        }

        // Password check
        if (customer.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        // Login successful
        res.json({
            success: true,
            message: "Login successful!",
            customer: {
                id: customer.id,
                name: customer.name,
                dob: customer.dob,
                email: customer.email,
                phone: customer.phone,
                address: customer.address
            }
        });
    });
});

// Update Customer API
app.put("/api/customers/:id", (req, res) => {

    const customerId = req.params.id;

    const {
        name,
        dob,
        email,
        phone,
        address
    } = req.body;

    // Check required fields
    if (!name || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }

    const sql = `
        UPDATE customers
        SET
            name = ?,
            dob = ?,
            email = ?,
            phone = ?,
            address = ?
        WHERE id = ?
    `;

    db.run(
        sql,
        [
            name,
            dob,
            email,
            phone,
            address,
            customerId
        ],
        function (err) {

            if (err) {

                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already registered."
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Profile update failed."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Customer not found."
                });
            }

            res.json({
                success: true,
                message: "Profile updated successfully!"
            });

        }
    );

});

// ========================================
// PLACE ORDER
// ========================================

app.post("/api/orders", (req, res) => {

    const {
        orderId,
        customerId,
        customerName,
        phone,
        email,
        address,
        subtotal,
        discount,
        total,
        paymentMethod,
        products
    } = req.body;

    const orderDate = new Date().toISOString();

    const sql = `
        INSERT INTO orders
        (
            order_id,
            customer_id,
            customer_name,
            phone,
            email,
            address,
            subtotal,
            discount,
            total,
            payment_method,
            status,
            order_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            orderId,
            customerId || null,
            customerName,
            phone,
            email,
            address,
            subtotal,
            discount,
            total,
            paymentMethod,
            "Order Placed",
            orderDate
        ],
        function (err) {

            if (err) {
                console.error("Order insert error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Order could not be placed."
                });
            }

            const databaseOrderId = this.lastID;

            const itemSql = `
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    product_name,
                    quantity,
                    price,
                    total
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            let completed = 0;

            if (!products || products.length === 0) {
                return res.json({
                    success: true,
                    message: "Order placed successfully.",
                    orderId: orderId
                });
            }

            products.forEach((product) => {

                db.run(
                    itemSql,
                    [
                        databaseOrderId,
                        product.id,
                        product.name,
                        product.quantity,
                        product.price,
                        product.price * product.quantity
                    ],
                    (err) => {

                        if (err) {
                            console.error(
                                "Order item error:",
                                err.message
                            );
                        }

                        completed++;

                        if (completed === products.length) {

                            res.json({
                                success: true,
                                message: "Order placed successfully.",
                                orderId: orderId
                            });

                        }

                    }
                );

            });

        }
    );

});

// ========================================
// GET ALL ORDERS
// ========================================

app.get("/api/orders", (req, res) => {

    const sql = `
        SELECT *
        FROM orders
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, orders) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch orders."
            });
        }

        res.json({
            success: true,
            orders: orders
        });

    });

});

// ========================================
// CANCEL ORDER
// ========================================

app.put("/api/orders/:orderId/cancel", (req, res) => {

    const orderId = req.params.orderId;

    db.run(
        `
        UPDATE orders
        SET status = 'Cancelled'
        WHERE order_id = ?
        `,
        [orderId],
        function (err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to cancel order."
                });
            }

            res.json({
                success: true,
                message: "Order cancelled successfully."
            });

        }
    );

});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CROCHEVA Backend running on port ${PORT}`);
});