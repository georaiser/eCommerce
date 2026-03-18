import pg from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

const pool = new Pool({
    connectionString,
    allowExitOnIdle: true,
});
    
try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');
} catch (error) {
    console.error('Database connection error:', error);
}
