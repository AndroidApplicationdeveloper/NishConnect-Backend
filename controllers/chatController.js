const User = require('../models/User');
const chatService = require('../services/chatService');
const Message = require('../models/Message');
const mongoose = require("mongoose");
const Chat = require('../models/Chat');

exports.checkUserExists = async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrGetRoom = async (req, res) => {
  const user1Id = req.user.userId;
  const { receiverId } = req.body;

  if (!receiverId) return res.status(400).json({ error: 'receiverId is required' });

  try {
    const chat = await chatService.getOrCreateChatRoom(user1Id, receiverId);
    res.json({ roomId: chat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, room, senderId } = req.body;

    if (!text || !room || !senderId) {
      return res.status(400).json({ error: 'text, room, and senderId are required' });
    }

    const sender = await User.findById(senderId);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    const username = `${sender.firstName || ''} ${sender.lastName || ''}`.trim();

    console.log('Sending message with details:', { text, room, senderId, username });

    const message = await chatService.sendMessage({
      text,
      room,
      senderId,
      username
    });

    res.status(200).json(message);
  } catch (err) {
    console.error('Error in sendMessage controller:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.sendMessageFromSocket = async (messageData, io, socket) => {
  try {
    const savedMessage = await chatService.sendMessageFromSocket(messageData);
    io.to(savedMessage.room).emit("chatMessage", savedMessage);
  } catch (err) {
    console.error("❌ Failed to process socket message:", err.message);
    socket.emit("error", { error: err.message });
  }
};
