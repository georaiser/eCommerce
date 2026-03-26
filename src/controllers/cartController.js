import { getShoppingCart, getCartItem, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } from '../models/cartModel.js';
import { getAllProducts, getProductById, updateProductStock } from "../models/productModel.js";
import { getUserById, updateUserCredit } from "../models/userModel.js";
import { pool } from '../config/db.js';

// GET /cart - render cart page
const shoppingCart = async (req, res) => {
    try {
        const userId = 1;
        const userResult = await getUserById(userId);
        const userCredit = userResult[0]?.credit || "0.00";
        const cart = await getShoppingCart(userId);
        const products = await getAllProducts();
        const totalResult = await getCartTotal(userId);
        const cartTotal = totalResult[0]?.total || 0;
        res.render("cart_page", { pageName: "Cart", cart, products, cartTotal, userCredit });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error}`);
    }
};

// POST /cart - add product to cart
const addProductToCart = async (req, res) => {
    const userId = 1;
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
    const userId = 1;
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
    const userId = 1;
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
    const userId = 1;

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
    const userId = 1;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const totalResult = await getCartTotal(userId, client);
        const total = parseFloat(totalResult[0]?.total || 0);
        if (total <= 0) throw new Error('Your cart is empty!');

        const userResult = await getUserById(userId, client);
        const user = userResult[0];
        const credit = parseFloat(user.credit);
        if (credit < total) throw new Error(`Insufficient funds! You have $${credit.toFixed(2)} but need $${total.toFixed(2)}.`);

        await updateUserCredit(userId, credit - total, client);
        await clearCart(userId, client);

        await client.query('COMMIT');
        res.send(`Purchase successful! You have $${(credit - total).toFixed(2)} remaining credit.`);
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
        const result = await getCartTotal(1);
        res.send(`Cart total: ${result[0]?.total || 0}`);
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

export { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart };