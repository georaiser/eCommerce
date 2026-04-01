import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/ORM/db.js';
import { connectSQL } from './src/config/SQL/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
    // Completely explicit Database Boot Sequence!

    // To natively test SQL table generation: set { sync: true } below and turn off ORM boot!
    //await connectSQL({ sync: false }); // 1. Raw PostgreSQL Pool
    
    await connectDB();  // 2. Sequelize Engine

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Failed to boot application databases:', error);
    process.exit(1);
}
