const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String },
  time: { type: String },
  status: {
    sent: { type: Boolean, default: true },
    delivered: { type: Boolean, default: false },
    read: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
