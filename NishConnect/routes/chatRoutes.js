const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/check-user', chatController.checkUserExists);
router.post('/create-or-get-room', authMiddleware, chatController.createOrGetRoom);
router.post('/send-message', chatController.sendMessage);

module.exports = router;
