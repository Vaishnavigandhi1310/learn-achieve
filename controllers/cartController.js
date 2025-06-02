const cartService = require('../services/cartService');

const addToCart = async (req, res) => {
  try {
    const { userId, packageId } = req.body;
    const cart = await cartService.addToCart(userId, packageId);
    res.status(201).json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { userId, packageId } = req.body;
    const cart = await cartService.deleteFromCart(userId, packageId);
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await cartService.getAllCartItems(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get cart items', error: error.message });
  }
};

module.exports = {
  addToCart,
  deleteFromCart,
  getCartItems
};
