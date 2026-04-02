const seedDatabase = async (pool) => {
  try {
    // Clear tables before seeding to prevent duplicates
    await pool.query("TRUNCATE TABLE users, products RESTART IDENTITY CASCADE");
    console.log("Cleared existing tables.");

    // Hash standard '1234' mathematically before inserting into raw SQL
    const bcrypt = await import('bcryptjs');
    const pwd = bcrypt.default.hashSync('1234', 8);

    // Insert Users
    await pool.query(`
            INSERT INTO users (name, email, password, role, credit, created_at)
            VALUES 
                ('Admin', 'admin@example.com', '${pwd}', 'admin', 1500.00, '2024-01-17 09:45:00'),
                ('Jorge Antonio', 'jorge@example.com', '${pwd}', 'user', 500.00, '2026-03-12 09:45:00'),
                ('User', 'user@example.com', '${pwd}', 'user', 2500.00, '2026-03-26 19:45:00')
        `);
    console.log("Inserted users.");

    // Insert Products
    await pool.query(`
            INSERT INTO products (name, category, price, stock)
            VALUES
                ('Wireless Headphones', 'Electronics', 149.99, 85),
                ('Ergonomic Office Chair', 'Furniture', 349.00, 40),
                ('Stainless Steel Water Bottle', 'Kitchen', 34.95, 200),
                ('Mechanical Gaming Keyboard', 'Electronics', 119.99, 0),
                ('Running Shoes', 'Footwear', 89.99, 120)
        `);
    console.log("Inserted products.");

    // Insert Cart
    await pool.query(`
            INSERT INTO cart (user_id, product_id, quantity, created_at)
            VALUES 
                (1, 1, 2, '2026-03-25 09:45:00'),
                (1, 2, 1, '2026-03-25 09:47:00'),
                (1, 3, 3, '2026-03-25 09:50:00')
        `);
    console.log("Inserted cart.");
  } catch (error) {
    console.error("Error seeding database:", error.message);
  }
};

export { seedDatabase };
