import pg from 'pg';
import dotenv from 'dotenv';
import createDatabase from './create_db.js';
dotenv.config();

const { Pool } = pg;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// create database if not exists
await createDatabase();

// connect to database
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

export const pool = new Pool({
    connectionString,
    allowExitOnIdle: true,
});
    
try {
    await pool.query('SELECT 1');
    console.log('Database connection successful');
} catch (error) {
    console.error('Database connection error:', error);
}
