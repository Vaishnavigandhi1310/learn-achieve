// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     // ref: 'User',
//   },
//   items: [
//     {
//       packageId: { type: mongoose.Schema.Types.ObjectId,
//          ref: 'Package', 
//          required: true
//          },
//       quantity:
//        { type: Number,
//          default: 1 
//         },
//       amount:
//        { type: Number, 
//         required: true 
//     },
//       discountAmount: {
//          type: Number
//          },
//     }
//   ],
//   totalAmount: { 
//     type: Number, 
//     required: true 
// },
//   status: {
//      type: String,
//      default: 'Pending' 
//     },
// }, {
//      timestamps: true
//      });

// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref: 'User',
  },
  items: [
    {
      packageId: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Package', 
         required: true
         },
      quantity:
       { type: Number,
         default: 1 
        },
      amount:
       { type: Number, 
        required: true 
    },
      discountAmount: {
         type: Number
         },
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
},
  status: {
     type: String,
     default: 'Pending' 
    },
}, {
     timestamps: true
     });

module.exports = mongoose.model('Order', orderSchema);
