const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Shared state — both HTTP and WebSocket sides read the same counter.
// This makes the comparison fair: both approaches see the same data,
// but the delivery mechanism (poll vs push) is what differs.
let counter = 0;
let httpRequests = 0;  // Tracks how many HTTP GET requests the client made (polling overhead)
let wsMessages = 0;    // Tracks how many WebSocket messages were sent (push efficiency)

// HTTP endpoint — the client must call this repeatedly (polling) to detect changes.
// Each call is a full HTTP request-response cycle: TCP handshake + headers + body.
// This is ~200 bytes overhead per poll, even when nothing changed.
app.get('/api/counter', (req, res) => {
    httpRequests++;
    res.json({ counter, httpRequests, wsMessages });
});

// WebSocket — the server pushes data to clients the instant something changes.
// No polling needed. The connection stays open, and each push is only ~20 bytes
// (just the WebSocket frame + payload, no HTTP headers).
io.on('connection', (socket) => {
    console.log('WS client connected');
    // Send current state immediately so the WebSocket side is in sync on connect.
    socket.emit('counter', { counter, httpRequests, wsMessages });

    socket.on('increment', () => {
        counter++;
        wsMessages++;
        console.log(`Counter: ${counter}  (HTTP polls: ${httpRequests}, WS msgs: ${wsMessages})`);
        // io.emit() pushes to ALL connected clients instantly.
        // Compare: the HTTP side won't see this change until its next poll cycle.
        io.emit('counter', { counter, httpRequests, wsMessages });
    });

    socket.on('disconnect', () => console.log('WS client disconnected'));
});

server.listen(5000, () => {
    console.log('');
    console.log('=== HTTP vs WebSocket Comparison ===');
    console.log('http://localhost:5000');
    console.log('');
});
