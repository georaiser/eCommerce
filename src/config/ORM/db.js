import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { seedDatabase } from "./seed_db.js";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DIALECT, DB_SYNC_MODE } = process.env;

// Shared configuration object
const dbOptions = { host: DB_HOST, port: DB_PORT, dialect: DB_DIALECT, logging: false };
const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, dbOptions);

const connectORM = async () => {
  // Step 1: Ensure database exists natively using an independent connection
  const adminSeq = new Sequelize(DB_DIALECT, DB_USER, DB_PASSWORD, dbOptions);
  try {
    const [res] = await adminSeq.query(`SELECT 1 FROM pg_database WHERE datname = '${DB_DATABASE}'`);
    if (res.length === 0) {
      await adminSeq.query(`CREATE DATABASE "${DB_DATABASE}"`);
      console.log(`Database "${DB_DATABASE}" created successfully!`);
    } else {
      console.log(`Database "${DB_DATABASE}" already exists.`);
    }
  } catch (err) {
    console.error("Error creating database natively:", err.message);
  } finally {
    await adminSeq.close();
  }

  // Step 2: Authenticate and Sync Models dynamically
  await sequelize.authenticate();
  console.log("ORM database connection successful!");

  const mode = DB_SYNC_MODE || 'SAFE';
  
  // Condense the sync options natively intercepting the Environment Variable
  await sequelize.sync({ force: mode === 'DROP', alter: mode === 'ALTER' });
  console.log(`ORM models synced successfully (${mode} Mode)!`);
  
  if (mode === 'DROP') await seedDatabase();
};

export { sequelize as default, connectORM };
