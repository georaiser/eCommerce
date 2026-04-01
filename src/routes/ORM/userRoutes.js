import express from 'express';
import { getUsers, addUser, deleteUser, updateUser, getUserById } from '../../controllers/ORM/userController.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Secure User Management (Admin Only)
router.use(requireAuth, requireAdmin);

router.get('/users', getUsers);
router.post('/user', addUser);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', updateUser);
router.get('/user/:id', getUserById);

export default router;
