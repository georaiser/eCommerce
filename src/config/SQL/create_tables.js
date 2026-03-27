const createUsersTable = async (pool) => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                credit DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    console.log("User tables created successfully!");
  } catch (error) {
    console.error("Error creating user tables:", error);
  }
};

const createProductsTable = async (pool) => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR (255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INTEGER DEFAULT 0
            );
        `);
    console.log("Product tables created successfully!");
  } catch (error) {
    console.error("Error creating product tables:", error);
  }
};

const createCartTable = async (pool) => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS cart (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            product_id INTEGER,
            quantity SMALLINT NOT NULL,
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
            UNIQUE (user_id, product_id),
            
        CONSTRAINT cart_quantity_check
            CHECK (quantity > 0)
    );
        `);
    console.log("Cart tables created successfully!");
  } catch (error) {
    console.error("Error creating cart tables:", error);
  }
};

const createOrdersTable = async (pool) => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            total_paid DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT fk_order_user
            FOREIGN KEY (user_id)
            REFERENCES users(id)
            ON DELETE CASCADE
    );
        `);
    console.log("Orders table created successfully!");
  } catch (error) {
    console.error("Error creating orders table:", error);
  }
};

const createOrderItemsTable = async (pool) => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS order_items (
            order_id INTEGER,
            product_id INTEGER,
            quantity SMALLINT NOT NULL,
            price_at_purchase DECIMAL(10, 2) NOT NULL,
            PRIMARY KEY (order_id, product_id),

        CONSTRAINT fk_orderitem_order
            FOREIGN KEY (order_id)
            REFERENCES orders(id)
            ON DELETE CASCADE,

        CONSTRAINT fk_orderitem_product
            FOREIGN KEY (product_id)
            REFERENCES products(id)
            ON DELETE CASCADE,

        CONSTRAINT orderitem_quantity_check
            CHECK (quantity > 0)
    );
        `);
    console.log("Order items table created successfully!");
  } catch (error) {
    console.error("Error creating order items table:", error);
  }
};

export { createUsersTable, createProductsTable, createCartTable, createOrdersTable, createOrderItemsTable };
