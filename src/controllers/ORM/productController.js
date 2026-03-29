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


export { getProducts };
