import express from 'express';
import { getUsers, addUser, deleteUser, updateUser, getUserById } from '../../controllers/ORM/userController.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/user', addUser);
router.delete('/user/:id', deleteUser);
router.put('/user/:id', updateUser);
router.get('/user/:id', getUserById);

export default router;
