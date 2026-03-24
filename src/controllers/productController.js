/**
 * productController.js — Server-side handlers for product operations.
 *
 * ROLE IN THE ARCHITECTURE
 * ─────────────────────────
 * This file runs on the SERVER (Node.js/Express).
 * It sits between the routes and the data layer (database).
 * It receives requests for product data, processes them, and sends a response.
 * It interacts with a database through the productModel.js (see models/productModel.js).
 *
 * REQUEST CYCLE
 * ──────────────
 *  HTTP request
 *    → productRoutes.js      (maps the URL + method to the right handler)
 *    → productController.js  (reads req, processes data, sends res)
 *    → products.json         (temporary file-based data store, replaces a DB for now)
 
 *
 * HOW IT CONNECTS TO productController.js (SERVER)
 * ──────────────────────────────────────────────────
 *  1. User fills in the form and clicks "Add Product".
 *  2. This script intercepts the submit event and calls fetch() with POST /products.
 *  3. Express routes the request to `addProduct` in productController.js.
 *  4. The controller reads the data from the body (req.body), appends the product to
 *     database, and responds with a success message.
 *  5. On success, this script reloads the page so the updated table is rendered
 *     fresh via `getproducts` (also in productController.js).
 *
 * SEPARATION OF CONCERNS
 * ───────────────────────
 *  • Browser (this file) : collects input, sends HTTP request, handles UI feedback.
 *  • Server (controller) : validates, persists data, sends HTTP response.
 *  They communicate only through the HTTP request/response cycle.
 */

import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../models/productModel.js";

// GET /db/products
const getProductsDB = async (req, res) => {
  try {
    const products = await getAllProducts(); // Calls the model!
    //console.log("Products from DB:", products); // Debug log
    res.render("products_page", { pageName: "Products", products });
  } catch (error) {
    res.status(500).send("Database error");
  }
};

// POST /db/products
const addProductDB = async (req, res) => {
  try {
    const { name, category, price, stock, isActive } = req.body;
    await addProduct(name, category, price, stock, isActive); // Calls the model!
    console.log(`Product ${name} added successfully!`); // Debug log
    res.send(`Product ${name} added successfully!`);
  } catch (error) {
    res.status(500).send("Error saving product");
  }
};

// DELETE /db/products/:id
const deleteProductDB = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id); // Calls the model!
    res.send(`Product ${id} deleted successfully!`);
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};

// PUT /db/products/:id
const updateProductDB = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, isActive } = req.body;
    await updateProduct(id, name, category, price, stock, isActive); // Calls the model!
    res.send(`Product ${name} updated successfully!`);
  } catch (error) {
    res.status(500).send("Error updating product");
  }
};

// GET /db/products/:id
const getProductByIdDB = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id); // Calls the model!
    res.render("products_page", { pageName: "Products", products: [product] });
  } catch (error) {
    res.status(500).send("Error getting product");
  }
};

export {
  getProductsDB,
  addProductDB,
  updateProductDB,
  deleteProductDB,
  getProductByIdDB,
};
