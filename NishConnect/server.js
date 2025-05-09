require("dotenv").config();
const express = require("express");
const path = require('path');
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");
const socketHandler = require("./socket"); // Import socket setup
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const contactRoutes = require("./routes/contactRoutes");
const staticRoutes = require('./routes/staticRoutes');

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

app.set('view engine', 'ejs'); // Tells Express to use EJS
app.set('views', path.join(__dirname, 'templates')); 
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);
app.use('/', staticRoutes);

// Attach Socket.IO logic
socketHandler(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
