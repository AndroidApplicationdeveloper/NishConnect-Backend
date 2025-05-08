const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isGroupChat: { type: Boolean, default: false },
  groupName: { type: String, default: "" },
  groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
