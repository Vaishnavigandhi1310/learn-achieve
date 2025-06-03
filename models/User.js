const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    match: [/^[a-zA-Z\s]+$/, 'Please enter a valid name']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[6-9]\d{9}$/, 'Please enter a valid mobile number']
  },

  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: { type: Boolean, default: false } ,
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',  // Reference to Package model
  }

},

 { timestamps: true });

module.exports = mongoose.model('User', userSchema);
