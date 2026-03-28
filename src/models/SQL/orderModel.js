import { pool } from '../../config/SQL/db.js';

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

export { createOrder, insertOrderItems, getOrderHistory };
