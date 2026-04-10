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

// GET /product-edit/:id
const renderEditProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findByPk(id, { raw: true });
    res.render("products_edit", { pageName: "Product Edit", products: [existingProduct] });

  } catch (error) {
    res.status(500).send(`Error updating product: ${error.message}`);
  }
};

// POST /product-update/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, category, price, stock } = req.body;
    await Product.update({ name, category, price, stock }, { where: { id } });
    res.redirect(req.baseUrl + '/products');
  } catch (error) {
    res.status(500).send(`Error updating product: ${error.message}`);
  }
};

// GET /product/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { raw: true }); // Calls the ORM model!
    res.render("products_page", { pageName: "Products", products: [product] });
  } catch (error) {
    res.status(500).send(`Error getting product: ${error}`);
  }
};

export { getProducts, addProduct, deleteProduct, renderEditProduct, updateProduct, getProductById };
