import express from 'express';
import { login, home, getUsers, addUser } from '../controllers/userControllers.js';

const router = express.Router();

// Routes with controllers
router.get('/login', login);

router.get('/', home);

router.get('/users', getUsers);

router.post('/user', addUser)


export default router;