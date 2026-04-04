import { User } from '../../models/ORM/index.js';
import jwt from 'jsonwebtoken';

// GET /login
const loginPage = (req, res) => {
    res.render('login', { pageName: 'Login', layout: 'auth' });
};

// POST /login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } }); // finds one record in the database
        if (!user) return res.status(401).send('Invalid email or password.');

        const isValid = await user.validPassword(password); // validates the password using bcrypt
        if (!isValid) return res.status(401).send('Invalid email or password.');

        // Token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('jwt', token, { httpOnly: true, secure: false }); // sets the token in the cookie
        
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Login error: ' + err.message);
    }
};

// Not used because we have not yet created a public "Register / Create account" modal on the homepage.
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        await User.create({ name, email, password, role: 'user' });
        res.send('Registration successful!');
    } catch (err) {
        res.status(500).send('Error registering: ' + err.message);
    }
}

// GET /logout
const logout = (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
}

export { loginPage, login, register, logout };
