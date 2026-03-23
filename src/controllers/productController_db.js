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
    res.render("products", { pageName: "Products", products });
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
    res.render("products", { pageName: "Products", products: [product] });
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
