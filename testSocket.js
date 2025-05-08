const io = require("socket.io-client");

const socket = io("ws://localhost:5000", {
    transports: ["websocket"] // ✅ Ensure WebSocket transport is used
});

socket.on("connect", () => console.log("✅ Connected!"));
socket.on("disconnect", () => console.log("❌ Disconnected!"));
socket.on("connect_error", (err) => console.error("❌ Connection Error:", err));
