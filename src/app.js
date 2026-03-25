import express from 'express';
// Importing the routes
import appRoutes from './routes/appRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';


// Importing the express-handlebars package for view rendering
import exphbs from 'express-handlebars'
import path from 'path'

const app = express();

const __dirname = path.resolve();

// Middleware — parse incoming JSON requests
app.use(express.json());

// Serve static files (CSS, images, etc.) using absolute path so it never breaks
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/', cartRoutes);

export default app;
