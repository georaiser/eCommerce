import { pool } from '../config/db.js';

// get all products
const getAllProducts = async () => {
    const {rows} = await pool.query('SELECT * FROM products');
    return rows[0];
};

//Add a new product
const addProduct = async (name, category, price, stock) => {
    const query = 'INSERT INTO products (name, category, price, stock) VALUES ($1, $2, $3, $4) RETURNING *'
    const data = [name, category, price, stock]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//Update a product by id
const updateProduct = async (id, name, category, price, stock) => {
    const query = 'UPDATE products SET name = $1, category = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *'
    const data = [name, category, price, stock, id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//Delete a product by id
const deleteProduct = async (id) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *'
    const data = [id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

//Get a product by id
const getProductById = async (id) => {
    const query = 'SELECT * FROM products WHERE id = $1'
    const data = [id]
    const {rows} = await pool.query(query, data);
    return rows[0];
};

export { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById };    