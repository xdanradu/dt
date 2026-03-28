// client-ws.js — Part 4: WebSocket Client
// Connects to the WebSocket server, sends a greeting, and listens for echoes.

const WebSocket = require("ws");

const SERVER_URL = "ws://localhost:8080";

const ws = new WebSocket(SERVER_URL);

ws.on("open", () => {
    console.log(`Connected to ${SERVER_URL}`);

    // Send an initial message
    ws.send("Hello from WebSocket client!");
    console.log("Sent: Hello from WebSocket client!");
});

ws.on("message", (data) => {
    console.log(`Server says: "${data.toString()}"`);
});

ws.on("ping", () => {
    console.log("Received Ping from server (Pong sent automatically)");
});

ws.on("close", () => {
    console.log("Disconnected from server");
});

ws.on("error", (err) => {
    console.error("Connection error:", err.message);
});
