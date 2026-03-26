import { getShoppingCart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartCount } from '../models/cartModel.js';
import { getAllProducts, getProductById, updateProductStock } from "../models/productModel.js";

// GET products list and shopping cart
const shoppingCart = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // 1. Fetch the user's cart
        const cart = await getShoppingCart(userId);
        
        // 2. Fetch all products available to add to the cart
        const products = await getAllProducts();
        
        // 3. Fetch the Grand Total of the entire cart!
        const totalResult = await getCartTotal(userId);
        const cartTotal = totalResult[0]?.total || 0;

        // 4. Render the page passing all data to Handlebars!
        res.render("cart_page", { pageName: "Cart", cart, products, cartTotal });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error}`);
    }
};

// POST /cart - add product to cart
const addProductToCart = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { productId, quantity } = req.body;
        const requestedQuantity = parseInt(quantity);
        
        // 1. Check shelf stock
        const product = await getProductById(productId);
        if (!product) return res.status(404).send("Product not found");
        
        if (requestedQuantity > product.stock) {
            return res.status(400).send(`Cannot add ${requestedQuantity}. There are only ${product.stock} units left on the shelf!`);
        }
        
        // 2. See if we already have it in the cart, so we can sum the new total internally
        const cartItems = await getShoppingCart(userId);
        const existingCartItem = cartItems.find(item => item.product_id == productId);
        const currentCartQuantity = existingCartItem ? parseInt(existingCartItem.quantity) : 0;
        const newTotalQuantity = currentCartQuantity + requestedQuantity;
        
        // 3. Deduct from shelf stock dynamically (Product Table)
        await updateProductStock(productId, product.stock - requestedQuantity);
        
        // 4. Upsert (Update if exists, Insert if new) into Cart Table
        if (existingCartItem) {
            await updateCartQuantity(userId, productId, newTotalQuantity); 
        } else {
            await addToCart(userId, productId, requestedQuantity); 
        }
        
        res.send(`Successfully added ${requestedQuantity}!`);
    } catch (error) {
        console.error("Cart Add Error:", error);
        res.status(500).send(`Error adding product to cart`);
    }
};

// PUT /cart/:id - update product quantity in cart
const updateCartItemQuantity = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { id } = req.params;
        const newRequestedQuantity = parseInt(req.body.quantity);
        
        // 1. Get shelf and cart sync
        const product = await getProductById(id);
        const cartItems = await getShoppingCart(userId);
        const existingCartItem = cartItems.find(item => item.product_id == id);
        
        if (!existingCartItem) return res.status(404).send("Item not in cart!");
        
        const currentCartQuantity = parseInt(existingCartItem.quantity);
        
        // Positive difference means they are ADDING more. Negative means returning to shelf.
        const difference = newRequestedQuantity - currentCartQuantity; 
        
        // 2. Check if we have enough shelf stock to fulfill the difference
        if (difference > product.stock) {
            return res.status(400).send(`Cannot add ${difference} more. There are only ${product.stock} units left on the shelf!`);
        }

        // 3. Update shelf stock
        await updateProductStock(id, product.stock - difference);

        // 4. Update product quantity in cart
        await updateCartQuantity(userId, id, newRequestedQuantity); 
        res.send(`Cart quantity updated successfully!`);
    } catch (error) {
        res.status(500).send(`Error updating product quantity in cart: ${error}`);
    }
};

// DELETE /cart/:id - remove product from cart
const removeCartItem = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const { id } = req.params;
        
        // 1. Find cart item to know exactly how much to return to shelf
        const cartItems = await getShoppingCart(userId);
        const existingCartItem = cartItems.find(item => item.product_id == id);
        if(!existingCartItem) return res.status(404).send("Item not in cart");

        const product = await getProductById(id);

        // 2. Return to shelf (Product Table)
        await updateProductStock(id, product.stock + parseInt(existingCartItem.quantity));
        
        // 3. Remove product from cart (Cart Table)
        await removeFromCart(userId, id);
        res.send(`Product removed and returned to shelf!`);
    } catch (error) {
        res.status(500).send(`Error removing product from cart: ${error}`);
    }
};

// DELETE /cart - clear cart
const clearCartItems = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        
        // 1. Return all active cart items back to the shelf 
        const cartItems = await getShoppingCart(userId);
        for(let item of cartItems) {
             const product = await getProductById(item.product_id);
             await updateProductStock(product.id, product.stock + parseInt(item.quantity));
        }
        
        // 2. Clear cart
        await clearCart(userId); 
        res.send(`Cart cleared and all items returned to shelf!`);
    } catch (error) {
        res.status(500).send(`Error clearing cart: ${error}`);
    }
};

// GET /cart/total - get cart total
const getCartItemsTotal = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const total = await getCartTotal(userId); 
        res.send(`Cart total: ${total}`);
    } catch (error) {
        res.status(500).send(`Error getting cart total: ${error}`);
    }
};

// GET /cart/count - get cart item count
const getCartItemCount = async (req, res) => {
    try {
        const userId = 1; // hardcoded for now
        const count = await getCartCount(userId); 
        res.send(`Cart item count: ${count}`);
    } catch (error) {
        res.status(500).send(`Error getting cart item count: ${error}`);
    }
};

export { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount };