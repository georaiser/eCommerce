import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// 1. Connect to the default 'postgres' database
// You must connect here because your target DB doesn't exist yet!
const client = new Client({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', 
});

const createDatabase = async () => {
    try {
        await client.connect();
        
        // 2. Check if your database already exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE}'`);
        
        if (res.rowCount === 0) {
            // 3. Create the database using raw SQL
            console.log(`Database "${DB_DATABASE}" not found. Creating it...`);
            await client.query(`CREATE DATABASE "${DB_DATABASE}"`);
            console.log(`Database "${DB_DATABASE}" created successfully!`);
        } else {
            console.log(`Database "${DB_DATABASE}" already exists. Skipping creation.`);
        }
    } catch (error) {
        console.error("Error creating database:", error);
    } finally {
        // 4. Close the temporary connection
        await client.end();
    }
};

export default createDatabase;
