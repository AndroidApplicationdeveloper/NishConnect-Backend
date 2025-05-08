const jwt = require("jsonwebtoken");
const AuthService = require("../services/authService");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

exports.sendOtp = async (req, res) => {
    try {
        const { email, phone } = req.body;
        const result = await AuthService.sendOtp(email, phone);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        const { user } = await AuthService.verifyOtp(email, phone, otp);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const { _id, ...userWithoutId } = user.toObject();

        res.status(200).json({
            message: "OTP verified successfully",
            accessToken,
            refreshToken,
            requiresRegistration: !(user.firstName && user.lastName && user.dateOfBirth),
            user: { id: _id, ...userWithoutId },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.completeRegistration = async (req, res) => {
    try {
        const user = await AuthService.completeRegistration({ ...req.body, userId: req.user.userId });
        res.status(200).json({ message: "Profile completed", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.refreshToken = (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ error: "Refresh token required" });

        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

        if (payload.tokenType !== "refresh") {
            return res.status(403).json({ error: "Invalid token type" });
        }

        const newAccessToken = jwt.sign(
            { userId: payload.userId, tokenType: 'access' },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Session expired. Please login again." });
        }
        res.status(403).json({ error: "Invalid refresh token" });
    }
};