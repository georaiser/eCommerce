import { pool } from '../config/db.js';

// get all products in the cart
const getShoppingCart = async (userId) => {
    const query = `
        SELECT sc.id, sc.quantity, sc.created_at, p.id AS product_id, p.name, p.category, p.price, (sc.quantity * p.price) AS total
        FROM cart sc
        JOIN products p ON sc.product_id = p.id
        WHERE sc.user_id = $1
    `;
    const data = [userId];
    const {rows} = await pool.query(query, data);
    return rows;
};

// add product to cart
const addToCart = async (userId, productId, quantity) => {
    const query = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const data = [userId, productId, quantity];
    //console.log(data);
    const {rows} = await pool.query(query, data);
    return rows;
};

// update product quantity in cart
const updateCartQuantity = async (userId, productId, quantity) => {
    const query = `
        UPDATE cart
        SET quantity = $3
        WHERE user_id = $1 AND product_id = $2
        RETURNING *;
    `;
    const data = [userId, productId, quantity];
    const {rows} = await pool.query(query, data);
    return rows;
};

// remove product from cart
const removeFromCart = async (userId, productId) => {
    const query = `
        DELETE FROM cart
        WHERE user_id = $1 AND product_id = $2
        RETURNING *;
    `;
    const data = [userId, productId];
    const {rows} = await pool.query(query, data);
    return rows;
};

// clear cart
const clearCart = async (userId) => {
    const query = `
        DELETE FROM cart
        WHERE user_id = $1
        RETURNING *;
    `;
    const data = [userId];
    const {rows} = await pool.query(query, data);
    return rows;
};

// checkout: deduct user credit and clear cart 
// (runs inside a transaction client, not using a pool connection)
const processCheckout = async (client, userId, newCredit) => {
    await client.query('UPDATE users SET credit = $1 WHERE id = $2', [newCredit, userId]);
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);
};

// get cart total
const getCartTotal = async (userId) => {
    const query = `
        SELECT SUM(sc.quantity * p.price) AS total
        FROM cart sc
        JOIN products p ON sc.product_id = p.id
        WHERE sc.user_id = $1;
    `;
    const data = [userId];
    const {rows} = await pool.query(query, data);
    return rows;
};

// get cart item count
const getCartCount = async (userId) => {
    const query = `
        SELECT COUNT(*) AS count
        FROM cart
        WHERE user_id = $1;
    `;
    const data = [userId];
    const {rows} = await pool.query(query, data);
    return rows;
};
       
export {
    getShoppingCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    processCheckout
};