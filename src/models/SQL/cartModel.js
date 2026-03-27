import { pool } from '../../config/SQL/db.js';

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

// get cart total — returns plain numeric value (0 if empty)
const getCartTotal = async (userId, dbClient = pool) => {
    const query = `
        SELECT SUM(sc.quantity * p.price) AS total
        FROM cart sc
        JOIN products p ON sc.product_id = p.id
        WHERE sc.user_id = $1
    `;
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return parseFloat(rows[0]?.total || 0);
};

// get cart item count — returns plain integer
const getCartCount = async (userId, dbClient = pool) => {
    const query = 'SELECT COUNT(*) AS count FROM cart WHERE user_id = $1';
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return parseInt(rows[0]?.count || 0);
};

// create a new order
const createOrder = async (userId, totalPaid, dbClient = pool) => {
    const query = 'INSERT INTO orders (user_id, total_paid) VALUES ($1, $2) RETURNING id';
    const data = [userId, totalPaid];
    const { rows } = await dbClient.query(query, data);
    return rows[0].id;
};

// move cart items to order items and safely lock in the current price
const insertOrderItems = async (userId, orderId, dbClient = pool) => {
    const query = `
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        SELECT $1, c.product_id, c.quantity, p.price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $2
    `;
    const data = [orderId, userId];
    await dbClient.query(query, data);
};

// get user's order history
const getOrderHistory = async (userId, dbClient = pool) => {
    const query = `
        SELECT o.id AS order_id, o.total_paid, o.created_at, 
               json_agg(
                   json_build_object(
                       'product_name', p.name,
                       'quantity', oi.quantity,
                       'price_at_purchase', oi.price_at_purchase,
                       'item_total', (oi.quantity * oi.price_at_purchase)
                   )
               ) AS items
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `;
    const data = [userId];
    const { rows } = await dbClient.query(query, data);
    return rows;
};

export { getShoppingCart, getCartItem, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount, createOrder, insertOrderItems, getOrderHistory };