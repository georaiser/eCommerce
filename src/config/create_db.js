import { Client } from 'pg';

export default async function createDatabase(config) {
    // Override the target database to 'postgres' just for the initial connection
    const client = new Client({ ...config, database: 'postgres', allowExitOnIdle: true });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${config.database}'`);
        
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${config.database}"`);
            console.log(`Database "${config.database}" created.`);
        } else {
            console.log(`Database "${config.database}" already exists.`);
        }
    } catch (err) {
        console.error("DB Creation Error:", err.message);
    } finally {
        await client.end();
    }
}
