const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/from-cart', orderController.placeOrderFromCart);
router.post('/direct', orderController.placeDirectOrder);
router.get('/:orderId', orderController.getOrderDetails);
router.get('/invoice/:orderId', orderController.getInvoice);


module.exports = router;
