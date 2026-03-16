import express from 'express';
import { getUsers, addUser, deleteUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// Routes with controllers. CRUD operations
router.get('/users', getUsers);
router.post('/user', addUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id', updateUser)

export default router;