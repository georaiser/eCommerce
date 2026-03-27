import express from 'express';
const router = express.Router();

// TODO: import from ../../controllers/ORM/productController.js (Sequelize)
router.get('/products',       (req, res) => res.send('ORM: GET /orm/products — not yet implemented'));
router.post('/product',       (req, res) => res.send('ORM: POST /orm/product — not yet implemented'));
router.put('/product/:id',    (req, res) => res.send('ORM: PUT /orm/product/:id — not yet implemented'));
router.delete('/product/:id', (req, res) => res.send('ORM: DELETE /orm/product/:id — not yet implemented'));

export default router;
