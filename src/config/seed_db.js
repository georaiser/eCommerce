const seedDatabase = async (pool) => {
    try {
        // Clear tables before seeding to prevent duplicates
        await pool.query('TRUNCATE TABLE users, products RESTART IDENTITY CASCADE');
        console.log('Cleared existing tables.');

        // Insert Users
        await pool.query(`
            INSERT INTO users (name, email, password, role, created_at)
            VALUES 
                ('Bob Johnson', 'bob.johnson@example.com', '1234', 'user', '2024-01-17 09:45:00'),
                ('jorge antonio', 'jorge@example.com', '1234', 'user', '2026-03-12 09:45:00'),
                ('jorge', 'jorge1@example.com', '1234', 'user', '2026-03-12 09:45:00')
        `);
        console.log('Inserted users.');

        // Insert Products
        await pool.query(`
            INSERT INTO products (name, category, price, stock, is_active)
            VALUES
                ('Wireless Headphones', 'Electronics', 149.99, 85, true),
                ('Ergonomic Office Chair', 'Furniture', 349.00, 40, true),
                ('Stainless Steel Water Bottle', 'Kitchen', 34.95, 200, true),
                ('Mechanical Gaming Keyboard', 'Electronics', 119.99, 0, false),
                ('Running Shoes', 'Footwear', 89.99, 120, true)
        `);
        console.log('Inserted products.');

        // Insert Cart
        await pool.query(`
            INSERT INTO cart (user_id, product_id, quantity, created_at)
            VALUES 
                (1, 1, 2, '2026-03-25 09:45:00'),
                (1, 2, 1, '2026-03-25 09:47:00'),
                (1, 3, 3, '2026-03-25 09:50:00')
        `);
        console.log('Inserted cart.');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    }
};

export {seedDatabase};
