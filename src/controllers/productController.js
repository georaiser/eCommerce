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
    //console.log('Products from JSON file:', products); // Debug log
    // page in "res.render('products' ....)" is the name of the view file in views folder, not the URL path
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

// DELETE product from JSON file
const deleteProduct = (req, res) => {
    const { id } = req.params;
    let products = JSON.parse(fs.readFileSync("./src/data/products.json", 'utf8'));
    
    const filteredProducts = products.filter(product => product.id != id);
    if (filteredProducts.length === products.length) {
        return res.status(404).send('Product not found');
    }
    
    fs.writeFileSync("./src/data/products.json", JSON.stringify(filteredProducts));
    res.send(`Product ${id} deleted successfully!`);
};

// PUT product in JSON file
const updateProduct = (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const products = JSON.parse(fs.readFileSync("./src/data/products.json", 'utf8'));
    
    const productTarget = products.find(product => product.id == id);
    if (!productTarget) {
        return res.status(404).send('Product not found');
    }

    productTarget.name = updateData.name || productTarget.name;
    productTarget.category = updateData.category || productTarget.category;
    productTarget.price = updateData.price || productTarget.price;
    // stock could be 0, so we check for undefined
    productTarget.stock = updateData.stock !== undefined ? updateData.stock : productTarget.stock; 
    productTarget.isActive = updateData.isActive !== undefined ? updateData.isActive === 'true' : productTarget.isActive;

    fs.writeFileSync("./src/data/products.json", JSON.stringify(products));
    res.send(`Product ${id} updated successfully!`);
};

export { getProducts, addProduct, deleteProduct, updateProduct };
