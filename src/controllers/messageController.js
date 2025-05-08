const messageService = require('../services/messageService');

exports.getMessagesByRoom = async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await messageService.getMessagesByRoom(room);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReceiverDetails = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const userDetails = await messageService.getReceiverDetails(receiverId);
    res.status(200).json(userDetails);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};