/**
 * productController.js — Server-side handlers for product operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). Controllers sit between the
 * routes and the data layer: they receive an HTTP request from a route, perform
 * the required operation (read/write), and send back an HTTP response.
 *
 * REQUEST CYCLE
 * ──────────────
 *  HTTP request
 *    → productRoutes.js      (maps the URL + method to the right handler)
 *    → productController.js  (reads req, processes data, sends res)
 *    → products.json         (temporary file-based data store, replaces a DB for now)
 *
 * NOTE: Currently uses the Node.js `fs` module as a simple data store.
 * In the next phase this will be replaced by a Sequelize model + PostgreSQL.
 */

import fs from 'fs';

/**
 * GET /products
 * Reads all products from the JSON file and renders the products view.
 * The HBS template receives the `products` array to build the table rows.
 */
const getProducts = (req, res) => {
    const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
    res.render('products', { pageName: 'Products', products: products.products });
};

/**
 * POST /products
 * Called when the client submits the Add Product form (via fetch in public/products.js).
 * Reads req.body (JSON payload), appends the new product to the file, and responds.
 * The client reloads the page on success, which triggers GET /products again.
 */
const addProduct = (req, res) => {
    const product = req.body;                                                      // JSON from the browser
    const products = JSON.parse(fs.readFileSync("./src/data/products.json", 'utf8')); // load current list
    products.products.push(product);                                               // append new product
    fs.writeFileSync("./src/data/products.json", JSON.stringify(products));        // persist to disk
    res.send(`Product ${product.name} added successfully!`);                       // signal success to fetch()
};

export { getProducts, addProduct };
