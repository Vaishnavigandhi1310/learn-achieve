const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
    mockTestName: {
         type: String,
          required: true 
        },
    medium: { 
        type: String,
         required: true
        },
    className: {
         type: String, 
         required: true
         },
    duration: {
         type: Number, 
         required: true 
        },
    subjects: [{
        subject: {
             type: String, 
             required: true
             },
        noOfQuestions: {
             type: Number, 
             required: true 
            }
    }]
}, { timestamps: true });

module.exports = mongoose.model('MockTest', mockTestSchema);
