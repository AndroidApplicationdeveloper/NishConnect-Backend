const express = require('express');
const router = express.Router();
const { renderPrivacyPolicy } = require('../controllers/staticController');

router.get('/privacy-policy', renderPrivacyPolicy);

module.exports = router;
