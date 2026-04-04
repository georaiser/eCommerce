import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, DB_DIALECT } = process.env;

const dbOptions = { host: DB_HOST, port: DB_PORT, dialect: DB_DIALECT, logging: false };

const createDatabase = async () => {
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
};

export default createDatabase;