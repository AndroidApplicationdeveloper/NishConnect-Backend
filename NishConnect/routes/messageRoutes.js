const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/:room', messageController.getMessagesByRoom);
router.get('/receiver/:receiverId', messageController.getReceiverDetails);

module.exports = router;
