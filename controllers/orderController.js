const orderService = require('../services/orderService');

const invoiceService = require('../services/invoiceService');

const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const invoice = await invoiceService.generateInvoice(orderId);
    res.status(200).json({ message: 'Invoice generated', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate invoice', error: error.message });
  }
};



async function placeOrderFromCart(req, res) {
  try {
    const { userId } = req.body;
    const order = await orderService.createOrderFromCart(userId);
    res.status(201).json({ message: 'Order placed from cart', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


const placeDirectOrder = async (req, res) => {
  try {
    const { userId, packageId, quantity, amount, discountAmount } = req.body;

    const packages = [
      {
        packageId,
        quantity: Number(quantity),
        amount: Number(amount),
        discountAmount: Number(discountAmount),
      }
    ];

    const order = await orderService.createDirectOrder(userId, packages);
    res.status(201).json({ message: 'Direct order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place direct order', error: error.message });
  }
};


async function getOrderDetails(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { placeOrderFromCart, placeDirectOrder, getOrderDetails ,getInvoice};
