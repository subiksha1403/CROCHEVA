const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file location
const dbPath = path.join(__dirname, "crocheva.db");

// Create / open database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("CROCHEVA SQLite Database Connected!");
    }
});

// Create tables
db.serialize(() => {

    // Customers table
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            dob TEXT,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            password TEXT NOT NULL,
            address TEXT
        )
    `);

    // Products table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            price REAL NOT NULL,
            image TEXT
        )
    `);

    // Orders table
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE NOT NULL,
            customer_id INTEGER,
            customer_name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            address TEXT NOT NULL,
            subtotal REAL NOT NULL,
            discount REAL DEFAULT 0,
            total REAL NOT NULL,
            payment_method TEXT NOT NULL,
            status TEXT DEFAULT 'Order Placed',
            order_date TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    `);

    // Order items table
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            product_id INTEGER,
            product_name TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            total REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `);

    // ========================================
// CROCHEVA PRODUCTS
// ========================================

const products = [

    // KEYCHAINS
    ["Bee Keychain", "Keychains", 149, "images/keychains/bee.jpg"],
    ["Bunny Keychain", "Keychains", 149, "images/keychains/bunny.jpg"],
    ["Flower Keychain", "Keychains", 129, "images/keychains/flower.jpg"],
    ["Heart Keychain", "Keychains", 129, "images/keychains/heart.jpg"],
    ["Strawberry Keychain", "Keychains", 149, "images/keychains/strawberry.jpg"],

    // PHONE CHARMS
    ["Butterfly Phone Charm", "Phone Charms", 159, "images/phone-charms/butterfly.jpg"],
    ["Cloud Phone Charm", "Phone Charms", 149, "images/phone-charms/cloud.jpg"],
    ["Mini Heart Phone Charm", "Phone Charms", 129, "images/phone-charms/mini-heart.jpg"],
    ["Pink Flower Phone Charm", "Phone Charms", 149, "images/phone-charms/pink-flower.jpg"],
    ["Cherry Phone Charm", "Phone Charms", 159, "images/phone-charms/cherry.jpg"],

    // FLOWERS
    ["Rose", "Flowers", 299, "images/flowers/rose.jpg"],
    ["Daisy", "Flowers", 279, "images/flowers/daisy.jpg"],
    ["Sunflower", "Flowers", 329, "images/flowers/sunflower.jpg"],
    ["Lavender", "Flowers", 299, "images/flowers/lavender.jpg"],
    ["Tulip", "Flowers", 299, "images/flowers/tulip.jpg"],

    // HAIR ACCESSORIES
    ["Hair Rope", "Hair Accessories", 99, "images/hair-accessories/hair-rope.jpg"],
    ["Bow Clip", "Hair Accessories", 129, "images/hair-accessories/bow-clip.jpg"],
    ["Scrunchies", "Hair Accessories", 149, "images/hair-accessories/scrunchies.jpg"],
    ["Clips", "Hair Accessories", 119, "images/hair-accessories/clips.jpg"],
    ["Hairband", "Hair Accessories", 139, "images/hair-accessories/hairband.jpg"],

    // TOYS
    ["Bunny Toy", "Toys", 499, "images/toys/bunny.jpg"],
    ["Teddy Toy", "Toys", 549, "images/toys/teddy.jpg"],
    ["Penguin Toy", "Toys", 499, "images/toys/penguin.jpg"],
    ["Barbie Toy", "Toys", 599, "images/toys/barbie.jpg"],
    ["Panda Toy", "Toys", 549, "images/toys/panda.jpg"]

];


// Insert products into database
products.forEach((product) => {

    db.get(
        "SELECT id FROM products WHERE name = ?",
        [product[0]],
        (err, row) => {

            if (err) {
                console.error(
                    "Product check error:",
                    err.message
                );
                return;
            }

            // Insert only if product does not exist
            if (!row) {

                db.run(
                    `
                    INSERT INTO products
                    (name, category, price, image)
                    VALUES (?, ?, ?, ?)
                    `,
                    product,
                    (err) => {

                        if (err) {
                            console.error(
                                "Product insert error:",
                                err.message
                            );
                        }

                    }
                );

            }

        }
    );

});

const imagePaths = [
    [1, "images/keychain/bee2.jpg"],
    [2, "images/keychain/bunny2.jpg"],
    [3, "images/keychain/flower.jpg"],
    [4, "images/keychain/heart.jpg"],
    [5, "images/keychain/strawberry2.jpg"],

    [6, "images/phonecharm/butterfly2.jpg"],
    [7, "images/phonecharm/cloud2.jpg"],
    [8, "images/phonecharm/miniheart2.jpg"],
    [9, "images/phonecharm/pinkflower2.jpg"],
    [10, "images/phonecharm/cherry3.jpg"],

    [11, "images/flowers/rose2.jpg"],
    [12, "images/flowers/daisy2.jpg"],
    [13, "images/flowers/sunflower2.jpg"],
    [14, "images/flowers/lavender2.jpg"],
    [15, "images/flowers/tulip3.jpg"],

    [16, "images/hairaccessories/band2.jpg"],
    [17, "images/hairaccessories/bowclip2.jpg"],
    [18, "images/hairaccessories/scrunchies2.jpg"],
    [19, "images/hairaccessories/clips2.jpg"],
    [20, "images/hairaccessories/hbands3.jpg"],

    [21, "images/toys/bunny.jpg"],
    [22, "images/toys/teddy.jpg"],
    [23, "images/toys/penguin.jpg"],
    [24, "images/toys/barbie.jpg"],
    [25, "images/toys/panda.jpg"]
];

imagePaths.forEach((item) => {

    db.run(
        "UPDATE products SET image = ? WHERE id = ?",
        [item[1], item[0]]
    );

});

imagePaths.forEach(function(item) {

    db.run(
        "UPDATE products SET image = ? WHERE id = ?",
        [item[0], item[1]]
    );

});

const correctCategories = [
    ["Bee Keychain", "Keychains"],
    ["Bunny Keychain", "Keychains"],
    ["Flower Keychain", "Keychains"],
    ["Heart Keychain", "Keychains"],
    ["Strawberry Keychain", "Keychains"],

    ["Butterfly Phone Charm", "Phone Charms"],
    ["Cloud Phone Charm", "Phone Charms"],
    ["Mini Heart Phone Charm", "Phone Charms"],
    ["Pink Flower Phone Charm", "Phone Charms"],
    ["Cherry Phone Charm", "Phone Charms"],

    ["Rose", "Flowers"],
    ["Daisy", "Flowers"],
    ["Sunflower", "Flowers"],
    ["Lavender", "Flowers"],
    ["Tulip", "Flowers"],

    ["Hair Rope", "Hair Accessories"],
    ["Bow Clip", "Hair Accessories"],
    ["Scrunchies", "Hair Accessories"],
    ["Clips", "Hair Accessories"],
    ["Hairband", "Hair Accessories"],

    ["Bunny Toy", "Toys"],
    ["Teddy Toy", "Toys"],
    ["Penguin Toy", "Toys"],
    ["Barbie Toy", "Toys"],
    ["Panda Toy", "Toys"]
];

correctCategories.forEach((item) => {

    db.run(
        "UPDATE products SET category = ? WHERE name = ?",
        [item[1], item[0]]
    );

});
    console.log("CROCHEVA Database Tables Ready!");
});

module.exports = db;
