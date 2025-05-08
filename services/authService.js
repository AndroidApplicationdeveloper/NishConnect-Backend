const nodemailer = require("nodemailer");
const User = require("../models/User");

exports.sendOtp = async (email, phone) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const target = email || phone;
    global.otpStore = global.otpStore || {};
    global.otpStore[target] = { otp, expiresAt };

    console.log(`OTP for ${target}: ${otp}`);

    if (email) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "Your NishConnect OTP Code",
            text: `Your OTP code is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", email);
    }

    return { message: "OTP sent successfully" };
};

exports.verifyOtp = async (email, phone, otp) => {
    const target = email || phone;
    const record = global.otpStore?.[target];

    if (!record) throw new Error("No OTP sent or session expired");
    if (Date.now() > record.expiresAt) {
        delete global.otpStore[target];
        throw new Error("OTP expired");
    }
    if (record.otp !== otp) throw new Error("Incorrect OTP");

    // 🧠 Step 1: Try to find a user by email or phone
    let user = await User.findOne({
        $or: [
            email ? { email } : null,
            phone ? { phone } : null,
        ].filter(Boolean),
    });

    // 🛡️ Step 2: If no user exists, create one
    if (!user) {
        const userData = {};
        if (email) {
            userData.email = email;
            userData.emailVerified = true;
        }
        if (phone) {
            userData.phone = phone;
            userData.phoneVerified = true;
        }
        user = new User(userData);
    } else {
        // 🛑 Check if trying to bind an email or phone already used by another user
        if (email && user.email && user.email !== email) {
            throw new Error("Email already associated with another user");
        }
        if (phone && user.phone && user.phone !== phone) {
            throw new Error("Phone already associated with another user");
        }

        // ✅ Update verified flags
        if (email) user.emailVerified = true;
        if (phone) user.phoneVerified = true;

        // ✅ Fill missing data (email or phone if null)
        if (email && !user.email) user.email = email;
        if (phone && !user.phone) user.phone = phone;
    }

    await user.save();
    delete global.otpStore[target];

    return { message: "OTP verified successfully", user };
};

exports.completeRegistration = async ({ email, phone, firstName, lastName, dateOfBirth, userId }) => {
    if (!phone || !firstName || !lastName || !dateOfBirth) {
        throw new Error("First name, last name, date of birth, and phone number are required.");
    }

    // 1. Find current authenticated user
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // 2. Check for conflicts — ONLY if email/phone is provided
    const conflictConditions = [];

    if (email) {
        conflictConditions.push({ email });
    }

    if (phone) {
        conflictConditions.push({ phone });
    }

    if (conflictConditions.length) {
        const conflict = await User.findOne({
            _id: { $ne: user._id },
            $or: conflictConditions
        });

        if (conflict) {
            throw new Error("Email or phone is already linked to another account");
        }
    }

    // 3. Update fields safely
    if (email && !user.email) user.email = email;
    if (phone && !user.phone) user.phone = phone;

    user.firstName = firstName;
    user.lastName = lastName;
    user.dateOfBirth = dateOfBirth;

    await user.save();

    return user;
};
