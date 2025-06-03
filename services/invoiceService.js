const Order = require('../models/Order');
const Package = require('../models/Package');

const generateInvoice = async (orderId) => {
  const order = await Order.findById(orderId).populate('items.packageId');

  if (!order) throw new Error('Order not found');

  const invoice = {
    invoiceId: `INV-${order._id.toString().slice(-6).toUpperCase()}`,
    date: order.createdAt,
    userId: order.userId,
    items: order.items.map(item => ({
      name: item.packageId.packageName|| 'Unknown Package',
      quantity: item.quantity,
      price: item.amount,
      discount: item.discountAmount || 0,
      total: (item.amount - (item.discountAmount || 0)) * item.quantity
    })),
    totalAmount: order.totalAmount,
    status: order.status
  };

  return invoice;
};

module.exports = {
  generateInvoice
};
