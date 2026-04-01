import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';

// General routes (no prefix)
import appRoutes  from './routes/SQL/appRoutes.js';

// SQL mode routes  →  /sql/*
import sqlAuthRoutes    from './routes/SQL/authRoutes.js';
import sqlUserRoutes    from './routes/SQL/userRoutes.js';
import sqlProductRoutes from './routes/SQL/productRoutes.js';
import sqlCartRoutes    from './routes/SQL/cartRoutes.js';

// ORM mode routes  →  /orm/*
import ormAuthRoutes    from './routes/ORM/authRoutes.js';
import ormUserRoutes    from './routes/ORM/userRoutes.js';
import ormProductRoutes from './routes/ORM/productRoutes.js';
import ormCartRoutes    from './routes/ORM/cartRoutes.js';

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Handlebars view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    extname: '.hbs'
}));

// Global middleware to set the active mode prefix for all Handlebars templates
app.use((req, res, next) => {
    res.locals.prefix = req.originalUrl.startsWith('/orm') ? '/orm' : '/sql';
    res.locals.isAuthenticated = !!req.cookies.jwt; // Tell the navbar if we are logged in!
    next();
});

// Routes — general
app.use('/', appRoutes);

// Routes — SQL mode  (/sql/users, /sql/cart, etc.)
app.use('/sql/auth', sqlAuthRoutes);
app.use('/sql', sqlUserRoutes);
app.use('/sql', sqlProductRoutes);
app.use('/sql', sqlCartRoutes);

// Routes — ORM mode  (/orm/users, /orm/cart, etc.)
app.use('/orm/auth', ormAuthRoutes);
app.use('/orm', ormUserRoutes);
app.use('/orm', ormProductRoutes);
app.use('/orm', ormCartRoutes);

export default app;
