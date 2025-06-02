const Cart = require('../models/cartModel');
const Package = require('../models/Package');

const addToCart = async (userId, packageId) => {
 
  const pkg = await Package.findById(packageId);
  if (!pkg) throw new Error('Package not found');

  let cart = await Cart.findOne({ userId });

  if (!cart) {
   
    cart = new Cart({
      userId,
      packages: [{
        packageId: pkg._id,
        quantity: 1,
        amount: pkg.amount,
        discountAmount: pkg.discountAmount
      }]
    });
  } else {
  
    const existingPackage = cart.packages.find(p => p.packageId.toString() === packageId);

    if (existingPackage) {
      existingPackage.quantity += 1;
      existingPackage.amount = pkg.amount * existingPackage.quantity;
      existingPackage.discountAmount = pkg.discountAmount * existingPackage.quantity;

      cart.markModified('packages');  
    } else {
      
      cart.packages.push({
        packageId: pkg._id,
        quantity: 1,
        amount: pkg.amount,
        discountAmount: pkg.discountAmount
      });
    }
  }

  await cart.save();

  return cart;
};

const getAllCartItems = async (userId) => {
  return await Cart.findOne({ userId }).populate('packages.packageId');
};

const deleteFromCart = async (userId, packageId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Cart not found');

  cart.packages = cart.packages.filter(p => p.packageId.toString() !== packageId);
  await cart.save();
  return cart;
};

module.exports = {
  addToCart,
  getAllCartItems,
  deleteFromCart,
};
