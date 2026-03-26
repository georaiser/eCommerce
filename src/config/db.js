import pg from 'pg';
import dotenv from 'dotenv';
import createDatabase from './create_db.js';
import {createUserTables, createProductTables, createCartTables} from './create_tables.js';
import {seedDatabase} from './seed_db.js';
dotenv.config();

const { Pool } = pg;

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// URI Alternative way to connect to the database
// const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
// console.log(connectionString)

const config = {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE, 
    allowExitOnIdle: true
};

// create database if not exists (using Client)
await createDatabase(config);

// create pool to connect to the database and make queries
const pool = new Pool({...config, 
    max: 10, // max number of connections
    idleTimeoutMillis: 30000, // max time a connection can be idle before closing
    connectionTimeoutMillis: 2000 // max time to try to connect
});
    
try {
    // verify database connection
    const {rows} = await pool.query('SELECT NOW()');
    console.log('Database connection successful at:', rows[0].now);
    
    // Create tables right after a successful connection
    await createUserTables(pool);
    await createProductTables(pool);
    await createCartTables(pool);
    await seedDatabase(pool);

} catch (error) {
    console.error('Database connection error:', error);
}

export { pool };