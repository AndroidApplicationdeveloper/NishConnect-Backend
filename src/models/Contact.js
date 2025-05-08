const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
