import { sequelize, User, Product, Cart, Order, OrderItem } from '../../models/ORM/index.js';

// GET /cart - render cart page
const shoppingCart = async (req, res) => {
    try {
        const userId = 1;
        const user = await User.findByPk(userId); // user info
        const userCredit = user?.credit || "0.00";
        
        // Fetch cart items with associated products
        const cartItemsRaw = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product }],
            order: [['created_at', 'ASC']] // Try to keep consistent order
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
        const rawProducts = await Product.findAll({ order: [['id', 'ASC']] });
        const products = rawProducts.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price).toFixed(2),
            stock: p.stock
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
    const userId = 1;
    const { productId, quantity } = req.body;
    const requestedQty = parseInt(quantity);

    try {
        await sequelize.transaction(async (t) => {
            const product = await Product.findByPk(productId, { transaction: t });
            if (!product) throw new Error('Product not found');
            if (requestedQty > product.stock) throw new Error(`Only ${product.stock} units available in stock!`);

            const existingCartItem = await Cart.findOne({
                where: { user_id: userId, product_id: productId },
                transaction: t
            });

            if (existingCartItem) {
                await existingCartItem.update({ quantity: existingCartItem.quantity + requestedQty }, { transaction: t });
            } else {
                await Cart.create({ user_id: userId, product_id: productId, quantity: requestedQty }, { transaction: t });
            }

            await product.update({ stock: product.stock - requestedQty }, { transaction: t });
        });
        
        res.send(`Successfully added ${requestedQty}!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// PUT /cart/:id - update item quantity
const updateCartItemQuantity = async (req, res) => {
    const userId = 1;
    const productId = req.params.id;
    const newQty = parseInt(req.body.quantity);

    try {
        await sequelize.transaction(async (t) => {
            const product = await Product.findByPk(productId, { transaction: t });
            const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId }, transaction: t });
            
            if (!cartItem) throw new Error('Item not in cart!');

            const difference = newQty - cartItem.quantity; 
            if (difference > product.stock) throw new Error(`Only ${product.stock} more units available!`);

            await product.update({ stock: product.stock - difference }, { transaction: t });
            await cartItem.update({ quantity: newQty }, { transaction: t });
        });
        res.send(`Cart quantity updated!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// DELETE /cart/:id - remove one item
const removeCartItem = async (req, res) => {
    const userId = 1;
    const productId = req.params.id;

    try {
        await sequelize.transaction(async (t) => {
            const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId }, transaction: t });
            if (!cartItem) throw new Error('Item not in cart!');

            const product = await Product.findByPk(productId, { transaction: t });
            await product.update({ stock: product.stock + cartItem.quantity }, { transaction: t });
            
            await cartItem.destroy({ transaction: t });
        });
        res.send(`Product removed and returned to shelf!`);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// DELETE /cart - clear entire cart
const clearCartItems = async (req, res) => {
    const userId = 1;

    try {
        await sequelize.transaction(async (t) => {
            const cartItems = await Cart.findAll({ where: { user_id: userId }, transaction: t });
            if (cartItems.length === 0) throw new Error('Cart is already empty!');

            for (let item of cartItems) {
                const product = await Product.findByPk(item.product_id, { transaction: t });
                await product.update({ stock: product.stock + item.quantity }, { transaction: t });
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
    const userId = 1;

    try {
        let newCredit = 0;
        await sequelize.transaction(async (t) => {
            // Find user and cart
            const user = await User.findByPk(userId, { transaction: t });
            const cartItems = await Cart.findAll({ 
                where: { user_id: userId }, 
                include: [{ model: Product }],
                transaction: t 
            });

            if (cartItems.length === 0) throw new Error('Your cart is empty!');

            // Calculate total manually since we have the items eagerly loaded
            let total = 0;
            for (let item of cartItems) {
                total += item.quantity * parseFloat(item.product.price);
            }

            const credit = parseFloat(user.credit);
            if (credit < total) throw new Error(`Insufficient funds! You have $${credit.toFixed(2)} but need $${total.toFixed(2)}.`);

            newCredit = credit - total;
            await user.update({ credit: newCredit }, { transaction: t });

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
        const userId = 1;
        const cartItems = await Cart.findAll({ where: { user_id: userId }, include: [{ model: Product }] });
        let total = 0;
        for (let item of cartItems) {
            total += item.quantity * parseFloat(item.product.price);
        }
        res.send(`Cart total: ${total.toFixed(2)}`);
    } catch (error) {
        res.status(500).send(`Error getting cart total: ${error.message}`);
    }
};

// GET /cart/count
const getCartItemCount = async (req, res) => {
    try {
        const userId = 1;
        const count = await Cart.count({ where: { user_id: userId } });
        res.send(`Cart item count: ${count}`);
    } catch (error) {
        res.status(500).send(`Error getting cart item count: ${error.message}`);
    }
};

// GET /cart/history - render order history
const orderHistoryPage = async (req, res) => {
    try {
        const userId = 1;
        const user = await User.findByPk(userId);
        const userCredit = user?.credit || "0.00";
        
        // Fetch all orders for this user, including nested products!
        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [{ 
                model: Product,
                through: { attributes: ['quantity', 'price_at_purchase'] } // only pull what we need from OrderItem
            }],
            order: [['created_at', 'DESC']]
        });
        
        // Formatting for Handlebars
        // Handlebars expects: [{ order_id, total_paid, created_at, items: [ { product_name, quantity, price_at_purchase, item_total } ] }]
        const groupedOrders = orders.map(order => {
            return {
                order_id: order.id,
                total_paid: parseFloat(order.total_paid).toFixed(2),
                created_at: new Date(order.created_at).toLocaleString(),
                items: order.products.map(product => {
                    // product.orderItem contains the junction data!
                    const quantity = product.orderItem.quantity;
                    const priceAtPurchase = parseFloat(product.orderItem.price_at_purchase);
                    return {
                        product_name: product.name,
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
