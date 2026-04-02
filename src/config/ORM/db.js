import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DIALECT } =
  process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false, // set to console.log to see the raw SQL Sequelize generates! // or false
});

import { seedDatabase } from "./seed_db.js";

// Mirrors the SQL boot sequence: verify connection + create/update tables
const connectORM = async () => {
  // Step 0: Ensure the database exists natively using Sequelize (Complete Independence from SQL!)
  const adminSequelize = new Sequelize(DB_DIALECT, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false,
  });

  try {
    const [results] = await adminSequelize.query(
      `SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE}'`,
    );
    if (results.length === 0) {
      await adminSequelize.query(
        `CREATE DATABASE "${process.env.DB_DATABASE}"`,
      );
      console.log(
        `Database "${process.env.DB_DATABASE}" created successfully!`,
      );
    } else {
      console.log(`Database "${process.env.DB_DATABASE}" already exists.`);
    }
  } catch (err) {
    console.error("Error creating database natively:", err);
  } finally {
    await adminSequelize.close(); // Clean up the admin connection
  }

  // Step 1: Verify the connection to the database
  await sequelize.authenticate();
  console.log("ORM database connection successful!");

  // Step 2: Sync all models and seed dynamically based on .env
  const syncMode = process.env.DB_SYNC_MODE || 'SAFE';

  if (syncMode === 'DROP') {
    await sequelize.sync({ force: true });
    console.log("ORM models synced successfully (Force Rebuilt!)");
    await seedDatabase();
  } else if (syncMode === 'ALTER') {
    await sequelize.sync({ alter: true });
    console.log("ORM models synced successfully (Altered!)");
  } else {
    // SAFE mode natively defaults to gentle table creation without dropping or altering existing schemas
    await sequelize.sync(); 
    console.log("ORM models synced successfully (Safe Mode!)");
  }
};

export { sequelize as default, connectORM };
