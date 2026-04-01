import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DIALECT } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false // set to console.log to see the raw SQL Sequelize generates! // or false
});

import { seedDatabase } from './seed_db.js';

// Mirrors the SQL boot sequence: verify connection + create/update tables
const connectDB = async () => {
    
    // Step 0: Ensure the database exists natively using Sequelize (Complete Independence from SQL!)
    const adminSequelize = new Sequelize('postgres', process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: process.env.DB_DIALECT, logging: false
    });

    try {
        const [results] = await adminSequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_DATABASE}'`);
        if (results.length === 0) {
            await adminSequelize.query(`CREATE DATABASE "${process.env.DB_DATABASE}"`);
            console.log(`Database "${process.env.DB_DATABASE}" created successfully!`);
        } else {
            console.log(`Database "${process.env.DB_DATABASE}" already exists.`);
        }
    } catch (err) {
        console.error('Error creating database natively:', err);
    } finally {
        await adminSequelize.close(); // Clean up the admin connection
    }

    // Step 1: Verify the connection to the database
    await sequelize.authenticate();
    console.log('ORM database connection successful!');

    // Step 2: Sync all models (create tables if they don't exist)
    // alter: true → safely updates columns without dropping data (safe for development)
    // force: true → DROPS and recreates tables every boot (wipes all data, use with caution!)
    await sequelize.sync({ alter: true });
    console.log('ORM models synced successfully!');

    // Step 3: Seed the database purely using ORM!
    await seedDatabase();
};

export { sequelize as default, connectDB };