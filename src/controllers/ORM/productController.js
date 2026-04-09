import { sequelize, Product } from '../../models/ORM/index.js';

// Get /products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ raw: true, order: [['id', 'ASC']] });
        res.render("products_page", { pageName: "Products", products });
    }catch (error) {
        res.status(500).send(`Error getting products: ${error}`);
    }
};

// POST /products
const addProduct = async (req, res) => {
    try {
        const { name, category, price, stock } = req.body;
        let image_url = null;

        if (req.files && req.files.product_image) {
            const file = req.files.product_image;
            image_url = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
            await file.mv(`./uploads/${image_url}`);
        }

        await Product.create({ name, category, price, stock, image_url });
        res.redirect(req.originalUrl);
    } catch (error) {
        res.status(500).send(`Error saving product: ${error}`);
    }
};

// DELETE /product/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({ where: { id: id }})
    res.redirect(req.baseUrl + '/products');
  } catch (error) {
    res.status(500).send(`Error deleting product: ${error}`);
  }
};

// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Cleanly extract ONLY the provided fields bypassing blank inputs
    const updates = {};
    for (const key in req.body) {
        if (req.body[key] !== undefined && req.body[key] !== '') {
            updates[key] = req.body[key];
        }
    }

    // Perform a raw DB update directly. Returns array: [affectedCount]
    const [updatedRows] = await Product.update(updates, { where: { id } });
    
    if (updatedRows === 0) throw new Error("Product not found");

    res.send(`Product ${id} updated successfully!`);
  } catch (error) {
    res.status(500).send(`Error updating product: ${error.message}`);
  }
};

// GET /products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { raw: true }); // Calls the ORM model!
    res.render("products_page", { pageName: "Products", products: [product] });
  } catch (error) {
    res.status(500).send(`Error getting product: ${error}`);
  }
};

export { getProducts, addProduct, deleteProduct, updateProduct, getProductById };
