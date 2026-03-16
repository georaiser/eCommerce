import express from 'express';
import appRoutes from './routes/appRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware — parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/', appRoutes);
app.use('/', userRoutes);

export default app;
