const Message = require('../models/Message');
const User = require('../models/User');


exports.getMessagesByRoom = async (roomId) => {
  return await Message.find({ room: roomId }).sort({ timestamp: 1 });
};

exports.getReceiverDetails = async (receiverId) => {
    if (!receiverId) throw new Error("receiverId is required");
  
    const user = await User.findById(receiverId).select('email phone');
  
    if (!user) throw new Error("User not found");
  
    return {
      email: user.email,
      phone: user.phone
    };
  };