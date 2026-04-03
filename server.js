import app from './src/app.js';
import dotenv from 'dotenv';
import { connectORM } from './src/config/ORM/db.js';
import { connectSQL } from './src/config/SQL/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
    // Completely explicit Database Boot Sequence!

    // To natively test SQL table generation: set DB_SYNC_MODE to DROP in .env and turn off ORM boot!

    // await connectSQL();     // 1. Raw PostgreSQL Pool
    await connectORM();       // 2. Sequelize Engine

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Failed to boot application databases:', error);
    process.exit(1);
}
