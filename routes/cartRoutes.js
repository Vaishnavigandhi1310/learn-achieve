const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.delete('/remove', cartController.deleteFromCart); 
router.get('/:userId', cartController.getCartItems);

module.exports = router;
