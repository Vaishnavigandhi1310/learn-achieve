const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User',
    required: true,
  },
  packages: [
    {
      packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      amount: {
        type: Number,
        required: false,
      },
      discountAmount: {
        type: Number,
        required: false,
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Carts', cartSchema);
