/**
 * productController.js — Server-side handlers for product operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express). 
 * Controllers sit between the routes and the data layer: 
 * they receive an HTTP request from a route, perform
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

// read products from JSON file and render the products view
const getProducts = (req, res) => {
    const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
    res.render('products', { pageName: 'Products', products });
};

// add product to JSON file and send success response
const addProduct = (req, res) => {
    const product = req.body;   
    //Add a unique ID to the product
    product.id =  Date.now();                                                               
    const products = JSON.parse(fs.readFileSync("./src/data/products.json", 'utf8'));       
    products.push(product);                                                       
    fs.writeFileSync("./src/data/products.json", JSON.stringify(products));                 
    res.send(`Product ${product.name} added successfully!`);                               
};

// TODO: delete product from JSON file and send success response

// TODO: update product in JSON file and send success response

export { getProducts, addProduct };
