import express from 'express';
const router = express.Router();

// TODO: import from ../../controllers/ORM/cartController.js (Sequelize)
router.get('/cart',             (req, res) => res.send('ORM: GET /orm/cart — not yet implemented'));
router.post('/cart',            (req, res) => res.send('ORM: POST /orm/cart — not yet implemented'));
router.post('/cart/checkout',   (req, res) => res.send('ORM: POST /orm/cart/checkout — not yet implemented'));
router.put('/cart/:id',         (req, res) => res.send('ORM: PUT /orm/cart/:id — not yet implemented'));
router.delete('/cart/:id',      (req, res) => res.send('ORM: DELETE /orm/cart/:id — not yet implemented'));
router.delete('/cart',          (req, res) => res.send('ORM: DELETE /orm/cart — not yet implemented'));

export default router;
