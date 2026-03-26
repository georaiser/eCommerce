import { pool } from '../config/db.js';

// get all products in the cart
const getShoppingCart = async (userId, dbClient = pool) => {
    const query = `
        SELECT sc.id, sc.quantity, sc.created_at, p.id AS product_id, p.name, p.category, p.price, (sc.quantity * p.price) AS total
        FROM cart sc
        JOIN products p ON sc.product_id = p.id
        WHERE sc.user_id = $1
    `;
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return rows;
};

// get a single cart item
const getCartItem = async (userId, productId, dbClient = pool) => {
    const query = 'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2';
    const data = [userId, productId];
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

// add product to cart
const addToCart = async (userId, productId, quantity, dbClient = pool) => {
    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    const data = [userId, productId, quantity];
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

// update product quantity in cart
const updateCartQuantity = async (userId, productId, quantity, dbClient = pool) => {
    const query = 'UPDATE cart SET quantity = $3 WHERE user_id = $1 AND product_id = $2 RETURNING *';
    const data = [userId, productId, quantity];
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

// remove product from cart
const removeFromCart = async (userId, productId, dbClient = pool) => {
    const query = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *';
    const data = [userId, productId];
    const { rows } = await dbClient.query(query, data);
    return rows[0];
};

// clear entire cart
const clearCart = async (userId, dbClient = pool) => {
    const query = 'DELETE FROM cart WHERE user_id = $1 RETURNING *';
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return rows;
};

// get cart total
const getCartTotal = async (userId, dbClient = pool) => {
    const query = `
        SELECT SUM(sc.quantity * p.price) AS total
        FROM cart sc
        JOIN products p ON sc.product_id = p.id
        WHERE sc.user_id = $1
    `;
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return rows;
};

// get cart item count
const getCartCount = async (userId, dbClient = pool) => {
    const query = 'SELECT COUNT(*) AS count FROM cart WHERE user_id = $1';
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return rows;
};

export { getShoppingCart, getCartItem, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount };