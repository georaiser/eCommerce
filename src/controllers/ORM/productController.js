import { sequelize, Product } from '../../models/ORM/index.js';

// Get /products
const getProducts = async (req, res) => {
    try {
        const productsRaw = await Product.findAll({ order: [['id', 'ASC']] })
        //console.log(productsRaw)
        const products = productsRaw.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            stock:p.stock
        }))
        res.render("products_page", { pageName: "Products", products });
    }catch (error) {
        res.status(500).send(`Error getting products: ${error}`);
    }
};

// POST /products
const addProduct = async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;
        await Product.create({ name, category, price, stock });
        res.send(`Product ${name} added successfully!`);
    } catch (error) {
        res.status(500).send(`Error saving product: ${error}`);
    }
};

// DELETE /products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id: id }})
    res.send(`Product ${id} deleted successfully!`);
  } catch (error) {
    res.status(500).send(`Error deleting product: ${error}`);
  }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, category, price, stock } = req.body;

    // Fetch the existing product
    const existingProduct = await Product.findByPk(id); // Calls the model ORM!

    name = name || existingProduct.name;
    category = category || existingProduct.category;
    price = price || existingProduct.price;
    stock = stock || existingProduct.stock;

    // Save changes using Sequelize ORM syntax!
    await existingProduct.update({ name, category, price, stock });
    res.send(`Product ${name} updated successfully!`);
  } catch (error) {
    res.status(500).send(`Error updating product: ${error}`);
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id); // Calls the ORM model!
    res.render("products_page", { pageName: "Products", products: [product] });
  } catch (error) {
    res.status(500).send(`Error getting product: ${error}`);
  }
};



export { getProducts, addProduct, deleteProduct, updateProduct, getProductById };
