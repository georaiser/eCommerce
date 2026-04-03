import { User, Product, Cart, Order, OrderItem } from '../../models/ORM/index.js';

const seedDatabase = async () => {
    await User.truncate({ cascade: true, restartIdentity: true }); // clean table
    await Product.truncate({ cascade: true, restartIdentity: true }); // clean table
    await Cart.truncate({ cascade: true, restartIdentity: true }); // clean table
    await Order.truncate({ cascade: true, restartIdentity: true }); 
    await OrderItem.truncate({ cascade: true, restartIdentity: true });
    
    try {
        // Wait, checking if the tables are completely empty before seeding
        // so we don't accidentally insert duplicates if the server restarts
        const userCount = await User.count();
        if (userCount > 0) {
            console.log("ORM Database already seeded. Skipping seed.");
            return;
        }

        // Insert Users using bulkCreate (the ORM equivalent of INSERT INTO ... VALUES)
        // individualHooks MUST be true so the User.js 'beforeCreate' password hashing hook fires for every row!
        await User.bulkCreate([
            { name: 'Admin', email: 'admin@example.com', password: '1234', role: 'admin', credit: 1500.00, created_at: '2024-01-17 09:45:00' },
            { name: 'Jorge Antonio', email: 'jorge@example.com', password: '1234', role: 'user', credit: 500.00, created_at: '2026-03-12 09:45:00' },
            { name: 'User', email: 'user@example.com', password: '1234', role: 'user', credit: 2500.00, created_at: '2026-03-26 19:45:00' }
        ], { individualHooks: true });
        console.log("ORM Seed: Inserted users.");

        // Insert Products
        await Product.bulkCreate([
            { name: 'Wireless Headphones', category: 'Electronics', price: 149.99, stock: 85, image_url: 'WirelessHeadphones.webp' },
            { name: 'Ergonomic Office Chair', category: 'Furniture', price: 349.00, stock: 40, image_url: 'WirelessHeadphones.webp' },
            { name: 'Stainless Steel Water Bottle', category: 'Kitchen', price: 34.95, stock: 200, image_url: 'WirelessHeadphones.webp' },
            { name: 'Mechanical Gaming Keyboard', category: 'Electronics', price: 119.99, stock: 0, image_url: 'WirelessHeadphones.webp' },
            { name: 'Running Shoes', category: 'Footwear', price: 89.99, stock: 120, image_url: 'WirelessHeadphones.webp' }
        ]);
        console.log("ORM Seed: Inserted products.");

        // Insert Cart Items (Map them to normal User ID=3, not Admin!)
        await Cart.bulkCreate([
            { user_id: 3, product_id: 1, quantity: 2, created_at: '2026-03-25 09:45:00' },
            { user_id: 3, product_id: 2, quantity: 1, created_at: '2026-03-25 09:47:00' },
            { user_id: 3, product_id: 3, quantity: 3, created_at: '2026-03-25 09:50:00' }
        ]);
        console.log("ORM Seed: Inserted cart.");

        // Insert Past Orders natively to populate the Admin global dashboard
        await Order.bulkCreate([
            { user_id: 2, total_paid: 498.99, created_at: '2026-03-20 10:00:00' },
            { user_id: 3, total_paid: 34.95, created_at: '2026-03-27 12:00:00' }
        ]);
        await OrderItem.bulkCreate([
            { order_id: 1, product_id: 1, quantity: 1, price_at_purchase: 149.99 },
            { order_id: 1, product_id: 2, quantity: 1, price_at_purchase: 349.00 },
            { order_id: 2, product_id: 3, quantity: 1, price_at_purchase: 34.95 }
        ]);
        console.log("ORM Seed: Inserted past orders.");

    } catch (error) {
        console.error("Error seeding ORM database:", error.message);
    }
};

export { seedDatabase };
