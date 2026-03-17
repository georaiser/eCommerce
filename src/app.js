import express from 'express';
// Importing the routes
import appRoutes from './routes/appRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Importing the express-handlebars package for view rendering
import exphbs from 'express-handlebars'
import path from 'path'

const app = express();

// Middleware — parse incoming JSON requests
app.use(express.json());

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

const __dirname =path.resolve();

// Set up Handlebars as the view engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/views'))

app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    extname: '.hbs'
}))

// Routes
app.use('/', appRoutes);
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', productRoutes);

export default app;
