const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/complete-registration", authMiddleware, authController.completeRegistration);
router.post("/refresh-token", authController.refreshToken);


module.exports = router;
