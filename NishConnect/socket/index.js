const socketIo = require("socket.io");
const chatService = require('../services/chatService');
const User = require('../models/User'); // Required to get sender's name

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📥 ${socket.id} joined room: ${roomId}`);
    });

    socket.on("ping", () => {
      console.log("📡 Got ping from", socket.id);
    });

    socket.on("pong", () => {
      console.log("📡 Got pong from", socket.id);
    });

    socket.on("chatMessage", async (messageData) => {
      console.log("💬 Message received:", messageData);
      try {
        const savedMessage = await chatService.sendMessageFromSocket(messageData);
        io.to(savedMessage.room.toString()).emit("chatMessage", savedMessage);
        if (
          savedMessage.receiverId &&
          savedMessage.receiverId.toString() !== messageData.senderId
        ) {
          await chatService.markAsDelivered(savedMessage._id);
        }
      } catch (err) {
        console.error("❌ Failed to process message:", err.message);
        socket.emit("error", { error: err.message });
      }
    });

    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('userTyping'); // Broadcast to others in room
    });
  
    socket.on('stopTyping', (roomId) => {
      socket.to(roomId).emit('userStopTyping'); // Broadcast to others in room
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 User disconnected", socket.id, "Reason:", reason);
    });
  });

  return io;
};
