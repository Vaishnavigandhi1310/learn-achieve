const Order = require('../models/Order');
const Cart = require('../models/cartModel');

async function createOrderFromCart(userId) {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.packages.length === 0) throw new Error('Cart is empty');

  let totalAmount = 0;
  const items = cart.packages.map(item => {
    const price = item.discountAmount || item.amount || 0;
    totalAmount += price * item.quantity;
    return {
      packageId: item.packageId,
      quantity: item.quantity,
      amount: item.amount,
      discountAmount: item.discountAmount,
    };
  });

  const order = new Order({ userId, items, totalAmount });
  await order.save();

  // Clear cart after order
  cart.packages = [];
  await cart.save();

  return order;
}

async function createOrderDirect(userId, packageId, quantity, amount, discountAmount) {
  const totalAmount = (discountAmount || amount) * quantity;

  const order = new Order({
    userId,
    items: [{ packageId, quantity, amount, discountAmount }],
    totalAmount,
  });
  await order.save();
  return order;
}

async function getOrderById(orderId) {
  return Order.findById(orderId).populate('items.packageId').populate('userId');
}


const createDirectOrder = async (userId, items) => {
  const totalAmount = items.reduce((sum, item) => {
    const quantity = parseInt(item.quantity || 1);
    const price = parseFloat(item.amount || 0);
    const discount = parseFloat(item.discountAmount || 0);
    return sum + (price - discount) * quantity;
  }, 0);

  const order = new Order({
    userId,
    items,
    totalAmount,
    status: 'placed',
  });

  return await order.save();
};



module.exports = { 
    createOrderFromCart,
    createOrderDirect,
    createDirectOrder,
    getOrderById
     };
