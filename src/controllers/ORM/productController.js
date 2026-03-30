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

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    // Fetch the existing user first to protect blank fields like password
    const existingUser = await Product.findByPk(id); // Calls the model ORM!

    name = name || existingUser.name;
    category = category || existingUser.category;
    price = price || existingUser.price;
    stock = stock || existingUser.stock;

    await Product.update(id, name, category, price, stock); // Calls the model ORM!
    res.send(`Product ${name} updated successfully!`);
  } catch (error) {
    res.status(500).send(`Error updating product: ${error}`);
  }
};


export { getProducts, addProduct, updateProduct };
