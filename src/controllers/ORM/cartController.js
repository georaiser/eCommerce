import { sequelize, User, Product, Cart, Order, OrderItem } from '../../models/ORM/index.js';

// GET /cart - render cart page
const shoppingCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId); // user info
        const userCredit = user?.credit || "0.00";
        
        // Fetch cart items with associated products
        const cartItemsRaw = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product }],
            order: [['created_at', 'ASC']], // Try to keep consistent order
            raw: true,
            nest: true // Re-nests the included Product object neatly without instance bloat!
        });

        // Format exactly how Handlebars expects: { id, quantity, created_at, product_id, name, category, price, total }
        let cartTotal = 0;
        const cart = cartItemsRaw.map(item => {
            const product = item.product; // Thanks to belongsTo
            const total = item.quantity * product.price;
            cartTotal += total;
            
            return {
                id: item.id,
                quantity: item.quantity,
                created_at: new Date(item.created_at).toLocaleString(),
                product_id: product.id,
                name: product.name,
                category: product.category,
                price: parseFloat(product.price).toFixed(2),
                total: parseFloat(total).toFixed(2)
            };
        });

        // Fetch all products for the store dropdown
        const rawProducts = await Product.findAll({ raw: true, order: [['id', 'ASC']] });
        const products = rawProducts.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price).toFixed(2),
            stock: p.stock,
            image_url: p.image_url // Explicitly retain the image URL dropping through the map!
        }));

        res.render("cart_page", { 
            pageName: "Cart", 
            cart, 
            products, 
            cartTotal: parseFloat(cartTotal).toFixed(2), 
            userCredit: parseFloat(userCredit).toFixed(2) 
        });
    } catch (error) {
        res.status(500).send(`Error loading cart page: ${error.message}`);
    }
};

// POST /cart - add product to cart
const addProductToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const requestedQty = parseInt(quantity);

    try {
        await sequelize.transaction(async (t) => {
            // Validate stock safely
            const product = await Product.findByPk(productId, { attributes: ['stock'], transaction: t });
            if (!product) throw new Error('Product not found');
            if (requestedQty > product.stock) throw new Error(`Only ${product.stock} units available in stock!`);

            // Find or strictly create to save an if/else block!
            const [cartItem, created] = await Cart.findOrCreate({
                where: { user_id: userId, product_id: productId },
                defaults: { quantity: requestedQty },
                transaction: t
            });
            // If already existed, increment it mathematically!
            if (!created) {
                await cartItem.increment('quantity', { by: requestedQty, transaction: t });
            }

            // Raw decrement the shelf stock directly bypassing memory saves!
            await Product.decrement('stock', { by: requestedQty, where: { id: productId }, transaction: t });
        });
        
        res.send(`Successfully added ${requestedQty}!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// PUT /cart/:id - update item quantity
const updateCartItemQuantity = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;
    const newQty = parseInt(req.body.quantity);

    try {
        await sequelize.transaction(async (t) => {
            const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId }, transaction: t });
            if (!cartItem) throw new Error('Item not in cart!');

            const product = await Product.findByPk(productId, { attributes: ['stock'], transaction: t });
            
            const difference = newQty - cartItem.quantity; 
            if (difference > product.stock) throw new Error(`Only ${product.stock} more units available!`);

            // Use decrement hook for negative or positive differences safely
            await Product.decrement('stock', { by: difference, where: { id: productId }, transaction: t });
            await cartItem.update({ quantity: newQty }, { transaction: t });
        });
        res.send(`Cart quantity updated!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// DELETE /cart/:id - remove one item
const removeCartItem = async (req, res) => {
    const userId = req.user.id;
    const productId = req.params.id;

    try {
        await sequelize.transaction(async (t) => {
            const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId }, transaction: t });
            if (!cartItem) throw new Error('Item not in cart!');

            // Increment strictly via math
            await Product.increment('stock', { by: cartItem.quantity, where: { id: productId }, transaction: t });
            
            await cartItem.destroy({ transaction: t });
        });
        res.send(`Product removed and returned to shelf!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// DELETE /cart - clear entire cart
const clearCartItems = async (req, res) => {
    const userId = req.user.id;

    try {
        await sequelize.transaction(async (t) => {
            const cartItems = await Cart.findAll({ where: { user_id: userId }, transaction: t });
            if (cartItems.length === 0) throw new Error('Cart is already empty!');

            for (let item of cartItems) {
                // Increment cleanly without loading Product mapping
                await Product.increment('stock', { by: item.quantity, where: { id: item.product_id }, transaction: t });
            }
            
            await Cart.destroy({ where: { user_id: userId }, transaction: t });
        });
        res.send(`Cart cleared and all items returned to shelf!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// POST /cart/checkout - buy everything in cart
const checkoutCart = async (req, res) => {
    const userId = req.user.id;

    try {
        let newCredit = 0;
        await sequelize.transaction(async (t) => {
            // Find user and cart
            const user = await User.findByPk(userId, { attributes: ['credit'], transaction: t });
            const cartItems = await Cart.findAll({ 
                where: { user_id: userId }, 
                include: [{ model: Product }],
                transaction: t 
            });

            if (cartItems.length === 0) throw new Error('Your cart is empty!');

            // Calculate exact total cleanly via single line ES6 array reducer
            const total = cartItems.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);

            const credit = parseFloat(user.credit);
            if (credit < total) throw new Error(`Insufficient funds! You have $${credit.toFixed(2)} but need $${total.toFixed(2)}.`);

            newCredit = credit - total;
            
            // Deduct using explicit DB-level decrement wrapper safely
            await User.decrement('credit', { by: total, where: { id: userId }, transaction: t });

            // Create Order
            const order = await Order.create({ user_id: userId, total_paid: total }, { transaction: t });

            // Build OrderItems array
            const orderItemsData = cartItems.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: item.product.price
            }));
            
            await OrderItem.bulkCreate(orderItemsData, { transaction: t });
            
            // Clear Cart
            await Cart.destroy({ where: { user_id: userId }, transaction: t });
        });
        
        res.send(`Purchase successful! You have $${newCredit.toFixed(2)} remaining credit.`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// GET /cart/total
const getCartItemsTotal = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({ where: { user_id: userId }, include: [{ model: Product }] });
        // Use clean ES6 Javascript reduction aggregations
        const total = cartItems.reduce((sum, item) => sum + (item.quantity * parseFloat(item.product.price)), 0);
        res.send(`Cart total: ${total.toFixed(2)}`);
    } catch (error) {
        res.status(500).send(`Error getting cart total: ${error.message}`);
    }
};

// GET /cart/count
const getCartItemCount = async (req, res) => {
    try {
        const userId = req.user.id;
        // Use ORM raw SQL aggregator natively bypassing mapping entirely
        const count = await Cart.sum('quantity', { where: { user_id: userId } });
        res.send(`Cart item count: ${count || 0}`);
    } catch (error) {
        res.status(500).send(`Error getting cart item count: ${error.message}`);
    }
};

// GET /cart/history - render order history
const orderHistoryPage = async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';
        const user = await User.findByPk(userId);
        const userCredit = user?.credit || "0.00";
        
        const queryOptions = {
            include: [
                { model: User, attributes: ['name'] },
                { 
                    model: Product,
                    through: { attributes: ['quantity', 'price_at_purchase'] } // only pull what we need from OrderItem
                }
            ],
            order: [['created_at', 'DESC']]
        };

        if (!isAdmin) {
            queryOptions.where = { user_id: userId };
        }
        
        // Fetch conditionally
        const orders = await Order.findAll(queryOptions);
        
        // Formatting for Handlebars
        // Handlebars expects: [{ order_id, purchaser_name, total_paid, created_at, items: [ { product_name, quantity, price_at_purchase, item_total } ] }]
        const groupedOrders = orders.map(order => {
            return {
                order_id: order.id,
                purchaser_name: order.user?.name,
                total_paid: parseFloat(order.total_paid).toFixed(2),
                created_at: new Date(order.created_at).toLocaleString(),
                items: order.products.map(product => {
                    // product.orderItem contains the junction data!
                    const quantity = product.orderItem.quantity;
                    const priceAtPurchase = parseFloat(product.orderItem.price_at_purchase);
                    return {
                        product_name: product.name,
                        image_url: product.image_url,
                        quantity: quantity,
                        price_at_purchase: priceAtPurchase.toFixed(2),
                        item_total: (quantity * priceAtPurchase).toFixed(2)
                    };
                })
            };
        });

        res.render("order_history_page", { pageName: "Order History", groupedOrders, userCredit: parseFloat(userCredit).toFixed(2) });
    } catch (error) {
        res.status(500).send(`Error loading order history: ${error.message}`);
    }
};

export { shoppingCart, addProductToCart, updateCartItemQuantity, removeCartItem, clearCartItems, getCartItemsTotal, getCartItemCount, checkoutCart, orderHistoryPage };
