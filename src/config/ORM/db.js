import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false // set to console.log to see the raw SQL Sequelize generates! // or false
});

// Mirrors the SQL boot sequence: verify connection + create/update tables
const connectDB = async () => {
    // Step 1: Verify the connection to the database
    await sequelize.authenticate();
    console.log('ORM database connection successful!');

    // Step 2: Sync all models (create tables if they don't exist)
    // alter: true → safely updates columns without dropping data (safe for development)
    // force: true → DROPS and recreates tables every boot (wipes all data, use with caution!)
    await sequelize.sync({ alter: true });
    console.log('ORM models synced successfully!');
};

export { sequelize as default, connectDB };