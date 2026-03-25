const createUserTables = async (pool) => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("User tables created successfully!");
  } catch (error) {
    console.error("Error creating user tables:", error);
  }
};

const createProductTables = async (pool) => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR (255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true
            );
        `);
    console.log("Product tables created successfully!");
  } catch (error) {
    console.error("Error creating product tables:", error);
  }
};

const createCartTables = async (pool) => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS shopping_cart (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            product_id INTEGER,
            quantity INTEGER NOT NULL CHECK (quantity > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_cart_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,

        CONSTRAINT fk_cart_product
            FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE CASCADE,

        CONSTRAINT uq_cart_user_product
            UNIQUE (user_id, product_id)
    );
        `);
    console.log("Cart tables created successfully!");
  } catch (error) {
    console.error("Error creating cart tables:", error);
  }
};

export { createUserTables, createProductTables, createCartTables };
