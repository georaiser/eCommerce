import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

// General routes (no prefix)
import appRoutes  from './routes/SQL/appRoutes.js';
import authRoutes from './routes/SQL/authRoutes.js';

// SQL mode routes  →  /sql/*
import sqlUserRoutes    from './routes/SQL/userRoutes.js';
import sqlProductRoutes from './routes/SQL/productRoutes.js';
import sqlCartRoutes    from './routes/SQL/cartRoutes.js';

// ORM mode routes  →  /orm/*
import ormUserRoutes    from './routes/ORM/userRoutes.js';
import ormProductRoutes from './routes/ORM/productRoutes.js';
import ormCartRoutes    from './routes/ORM/cartRoutes.js';

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    extname: '.hbs'
}));

// Routes — general
app.use('/', appRoutes);
app.use('/', authRoutes);

// Routes — SQL mode  (/sql/users, /sql/cart, etc.)
app.use('/sql', sqlUserRoutes);
app.use('/sql', sqlProductRoutes);
app.use('/sql', sqlCartRoutes);

// Routes — ORM mode  (/orm/users, /orm/cart, etc.)
app.use('/orm', ormUserRoutes);
app.use('/orm', ormProductRoutes);
app.use('/orm', ormCartRoutes);

export default app;
