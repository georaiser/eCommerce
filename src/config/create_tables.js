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
        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

const createProductTables = async (pool) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category varchar(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true
            );
        `);
        console.log('Product tables created successfully!');
    } catch (error) {
        console.error('Error creating product tables:', error);
    }
};



export { createUserTables, createProductTables };