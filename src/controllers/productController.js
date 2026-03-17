import fs from 'fs';

const getProducts = (req, res) => {
    const products = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf-8'));
    res.render('products', { pageName: 'Products', products: products.products });
}

export { getProducts }
