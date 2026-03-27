import express from 'express';
const router = express.Router();

// TODO: import from ../../controllers/ORM/userController.js (Sequelize)
router.get('/users',      (req, res) => res.send('ORM: GET /orm/users — not yet implemented'));
router.post('/user',      (req, res) => res.send('ORM: POST /orm/user — not yet implemented'));
router.put('/user/:id',   (req, res) => res.send('ORM: PUT /orm/user/:id — not yet implemented'));
router.delete('/user/:id',(req, res) => res.send('ORM: DELETE /orm/user/:id — not yet implemented'));

export default router;
