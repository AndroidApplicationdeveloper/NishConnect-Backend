const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, contactController.createContact);
router.put('/:id', authMiddleware, contactController.updateContact);
router.delete('/:id', authMiddleware, contactController.deleteContact);
router.get('/', authMiddleware, contactController.getContacts);

module.exports = router;
