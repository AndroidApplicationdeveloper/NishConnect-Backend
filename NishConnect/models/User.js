const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    profilePic: String,
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


module.exports = mongoose.model("User", UserSchema);
