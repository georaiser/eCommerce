import { pool } from '../config/db.js';

// get all products
const getAllProducts = async () => {
    const {rows} = await pool.query('SELECT * FROM products');
    return rows;
};

//Add a new product
const addProduct = async (name, category, price, stock) => {
    const query = 'INSERT INTO products (name, category, price, stock) VALUES ($1, $2, $3, $4) RETURNING *'
    const data = [name, category, price, stock]
    const {rows} = await pool.query(query, data);
    //console.log(rows);
    return rows[0];
};

//Update a product by id
const updateProduct = async (id, name, category, price, stock, is_active) => {
    const query = 'UPDATE products SET name = $1, category = $2, price = $3, stock = $4, is_active = $5 WHERE id = $6 RETURNING *'
    const data = [name, category, price, stock, is_active, id]
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
const getProductById = async (id, dbClient = pool) => {
    const query = 'SELECT * FROM products WHERE id = $1'
    const data = [id]
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

//Update product stock by id
const updateProductStock = async (id, newStock, dbClient = pool) => {
    const query = 'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *'
    const data = [newStock, id]
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

export { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById, updateProductStock };    