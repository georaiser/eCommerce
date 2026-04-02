import express from 'express';
import { getUsers, addUser, deleteUser, updateUser, getUserById } from '../../controllers/ORM/userController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Secure User Management (Admin Only)
router.get('/users', requireAuth, requireAdmin, getUsers);
router.post('/user', requireAuth, requireAdmin, addUser);
router.delete('/user/:id', requireAuth, requireAdmin, deleteUser);
router.put('/user/:id', requireAuth, requireAdmin, updateUser);
router.get('/user/:id', requireAuth, requireAdmin, getUserById);

export default router;
