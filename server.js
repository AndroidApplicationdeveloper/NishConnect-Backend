require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./src/config/db");
const socketHandler = require("./src/socket"); // Import socket setup
const authRoutes = require("./src/routes/authRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const contactRoutes = require("./src/routes/contactRoutes");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());
app.use(express.json());
// ✅ Add this line below cors() and above routes:
app.use(express.static("public")); // <-- Serve static files like socket.io.js

// Example test route
app.get("/", (req, res) => {
  res.send("🟢 Socket.IO v2 backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);

// Attach Socket.IO logic
socketHandler(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
