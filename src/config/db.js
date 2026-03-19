import pg from 'pg';
import dotenv from 'dotenv';
import createDatabase from './create_db.js';
import createTables from './create_tables.js';
dotenv.config();

const { Pool } = pg;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const config = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE, 
    allowExitOnIdle: true
};

// create database if not exists
await createDatabase(config);

// create pool to connect to the database
const pool = new Pool(config);
    
try {
    // create database connection
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    // Create tables right after a successful connection
    await createTables(pool);
} catch (error) {
    console.error('Database connection error:', error);
}

export { pool };
