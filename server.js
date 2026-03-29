import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/ORM/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

try {
    // Boot the ORM (authenticate + sync tables) then start the server
    await connectDB(); // Sequelize
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Failed to connect ORM database:', error);
    process.exit(1);
}
