const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require('../models/Message');
const mongoose = require("mongoose");

exports.getOrCreateChatRoom = async (user1Id, user2Id) => {
  let chat = await Chat.findOne({
    members: { $all: [user1Id, user2Id], $size: 2 },
    isGroupChat: false,
  });

  if (!chat) {
    chat = new Chat({ members: [user1Id, user2Id] });
    await chat.save();
  }

  return chat;
};

exports.sendMessage = async ({ text, room, senderId, username }) => {
  const chatRoom = await Chat.findById(room);

  if (!chatRoom || !chatRoom.members.some(memberId => memberId.equals(senderId))) {
    throw new Error('Invalid room or sender not in room');
  }

  let receiverId = null;
  if (!chatRoom.isGroupChat && chatRoom.members.length === 2) {
    receiverId = chatRoom.members.find(id => !id.equals(senderId));
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const formattedTime = now.toLocaleTimeString('en-GB'); // HH:MM:SS

  const message = new Message({
    username,
    text,
    room,
    senderId,
    receiverId,
    date: formattedDate,
    time: formattedTime,
    status: {
      sent: true,
      delivered: false,
      read: false
    }
  });

  await message.save();
  return message;
};

exports.sendMessageFromSocket = async ({ text, room, senderId }) => {
  if (!text || !room || !senderId) throw new Error("Missing fields");

  const sender = await User.findById(senderId);
  if (!sender) throw new Error("Sender not found");

  const chatRoom = await Chat.findById(room);
  if (!chatRoom || !chatRoom.members.some(id => id.equals(senderId))) {
    throw new Error("Invalid room or sender not in room");
  }

  let receiverId = null;
  if (!chatRoom.isGroupChat && chatRoom.members.length === 2) {
    receiverId = chatRoom.members.find(id => !id.equals(senderId));
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const formattedTime = now.toLocaleTimeString('en-GB'); // HH:MM:SS

  const username = `${sender.firstName || ''} ${sender.lastName || ''}`.trim();

  const message = new Message({
    username,
    text,
    room,
    senderId,
    receiverId,
    date: formattedDate,
    time: formattedTime,
    status: {
      sent: true,
      delivered: false,
      read: false
    }
  });

  await message.save();
  return message;
};

exports.markAsDelivered = async (messageId) => {
  await Message.findByIdAndUpdate(messageId, { "status.delivered": true });
};

exports.markAsRead = async (messageId) => {
  await Message.findByIdAndUpdate(messageId, {
    "status.read": true,
    "status.delivered": true // read implies delivered
  });
};
