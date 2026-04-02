import { getShoppingCart, getCartItem, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } from '../../models/SQL/cartModel.js';
import { createOrder, insertOrderItems, getOrderHistory } from '../../models/SQL/orderModel.js';
import { getAllProducts, getProductById, updateProductStock } from "../../models/SQL/productModel.js";
import { getUserById, updateUserCredit } from "../../models/SQL/userModel.js";
import { pool } from '../../config/SQL/db.js';

// GET /cart - render cart page
const shoppingCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const userResult = await getUserById(userId); // user info
        const userCredit = userResult[0]?.credit || "0.00";
        const cart = await getShoppingCart(userId);
        const products = await getAllProducts();
        const cartTotal = await getCartTotal(userId);
        res.render("cart_page", { pageName: "Cart", cart, products, cartTotal, userCredit });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error}`);
    }
};

// POST /cart - add product to cart
const addProductToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const requestedQty = parseInt(quantity);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const product = await getProductById(productId, client);
        if (!product) throw new Error('Product not found');
        if (requestedQty > product.stock) throw new Error(`Only ${product.stock} units available in stock!`);

        const existing = await getCartItem(userId, productId, client);
        if (existing) {
            await updateCartQuantity(userId, productId, existing.quantity + requestedQty, client);
        } else {
            await addToCart(userId, productId, requestedQty, client);
        }
        await updateProductStock(productId, product.stock - requestedQty, client);

        await client.query('COMMIT');
        res.send(`Successfully added ${requestedQty}!`);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).send(err.message);
    } finally {
        client.release();
    }
};

// PUT /cart/:id - update item quantity
const updateCartItemQuantity = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const newQty = parseInt(req.body.quantity);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const product = await getProductById(id, client);
        const cartItem = await getCartItem(userId, id, client);
        if (!cartItem) throw new Error('Item not in cart!');

        const difference = newQty - cartItem.quantity; // positive = adding more, negative = returning
        if (difference > product.stock) throw new Error(`Only ${product.stock} more units available!`);

        await updateProductStock(id, product.stock - difference, client);
        await updateCartQuantity(userId, id, newQty, client);

        await client.query('COMMIT');
        res.send(`Cart quantity updated!`);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).send(err.message);
    } finally {
        client.release();
    }
};

// DELETE /cart/:id - remove one item
const removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const cartItem = await getCartItem(userId, id, client);
        if (!cartItem) throw new Error('Item not in cart!');

        const product = await getProductById(id, client);
        await updateProductStock(id, product.stock + cartItem.quantity, client);
        await removeFromCart(userId, id, client);

        await client.query('COMMIT');
        res.send(`Product removed and returned to shelf!`);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).send(err.message);
    } finally {
        client.release();
    }
};

// DELETE /cart - clear entire cart
const clearCartItems = async (req, res) => {
    const userId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const cartItems = await getShoppingCart(userId, client);
        if (cartItems.length === 0) throw new Error('Cart is already empty!');

        for (let item of cartItems) {
            const product = await getProductById(item.product_id, client);
            await updateProductStock(item.product_id, product.stock + item.quantity, client);
        }
        await clearCart(userId, client);

        await client.query('COMMIT');
        res.send(`Cart cleared and all items returned to shelf!`);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).send(err.message);
    } finally {
        client.release();
    }
};

// POST /cart/checkout - buy everything in cart
const checkoutCart = async (req, res) => {
    const userId = req.user.id;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const total = await getCartTotal(userId, client);
        if (total <= 0) throw new Error('Your cart is empty!');

        const userResult = await getUserById(userId, client);
        const credit = parseFloat(userResult[0].credit);
        if (credit < total) throw new Error(`Insufficient funds! You have $${credit.toFixed(2)} but need $${total.toFixed(2)}.`);

        const newCredit = parseFloat((credit - total).toFixed(2)); // round to avoid float drift
        await updateUserCredit(userId, newCredit, client);

        const orderId = await createOrder(userId, total, client);
        await insertOrderItems(userId, orderId, client);
        
        await clearCart(userId, client);

        await client.query('COMMIT');
        res.send(`Purchase successful! You have $${newCredit.toFixed(2)} remaining credit.`);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).send(err.message);
    } finally {
        client.release();
    }
};

// GET /cart/total
const getCartItemsTotal = async (req, res) => {
    try {
        const total = await getCartTotal(1);
        res.send(`Cart total: ${total}`);
    } catch (error) {
        res.status(500).send(`Error getting cart total: ${error}`);
    }
};

// GET /cart/count
const getCartItemCount = async (req, res) => {
    try {
        const count = await getCartCount(1);
        res.send(`Cart item count: ${count}`);
    } catch (error) {
        res.status(500).send(`Error getting cart item count: ${error}`);
    }
};

// GET /cart/history - render order history
const orderHistoryPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const userResult = await getUserById(userId);
        const userCredit = userResult[0]?.credit || "0.00";
        
        // Route Admin identically to a Global History map
        const orders = isAdmin ? await getOrderHistory(null) : await getOrderHistory(userId);
        
        // Format the grouped JSON directly from PostgreSQL for Handlebars
        const groupedOrders = orders.map(order => ({
            order_id: order.order_id,
            purchaser_name: order.purchaser_name,
            total_paid: order.total_paid,
            created_at: new Date(order.created_at).toLocaleString(),
            items: order.items.map(item => ({
                product_name: item.product_name,
                quantity: item.quantity,
                price_at_purchase: parseFloat(item.price_at_purchase).toFixed(2),
                item_total: parseFloat(item.item_total).toFixed(2)
            }))
        }));

        res.render("order_history_page", { pageName: "Order History", groupedOrders, userCredit });
    } catch (error) {
        res.status(500).send(`Error loading order history: ${error}`);
    }
};

export { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage };