// server-ws.js — Part 4: WebSocket Server with Heartbeat
// Demonstrates a persistent full-duplex connection with ping/pong health checks.

const { WebSocketServer } = require("ws");

const PORT = 8080;
const HEARTBEAT_INTERVAL = 5000; // 5 seconds

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws, req) => {
    const clientAddr = req.socket.remoteAddress;
    console.log(`Client connected from ${clientAddr}`);

    ws.isAlive = true;

    // When we receive a pong, mark the connection as alive
    ws.on("pong", () => {
        ws.isAlive = true;
        console.log("  Received Pong!");
    });

    // Echo incoming messages back to the client
    ws.on("message", (data) => {
        const text = data.toString();
        console.log(`Received: "${text}"`);
        ws.send(`Echo: ${text}`);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Heartbeat: ping every client periodically and terminate dead connections
const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log("Terminating dead connection");
            return ws.terminate();
        }
        ws.isAlive = false;
        console.log("Sending Ping...");
        ws.ping();
    });
}, HEARTBEAT_INTERVAL);

wss.on("close", () => {
    clearInterval(interval);
});

console.log(`WebSocket server listening on ws://localhost:${PORT}`);
console.log(`Heartbeat interval: ${HEARTBEAT_INTERVAL} ms`);
