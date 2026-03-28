const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
// Unlike Demo 2, we need a raw http.Server to attach Socket.IO alongside Express.
// Express alone only handles HTTP request-response; WebSocket needs a persistent
// TCP connection, so Socket.IO hooks into the underlying HTTP server to perform
// the WebSocket handshake (HTTP Upgrade).
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Color palette for distinguishing users visually in the chat.
// Modulo operator (%) cycles through colors so we never run out.
const colors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#e91e63'];
let colorIndex = 0;

// 'connection' fires each time a client opens a WebSocket connection.
// Unlike HTTP (one request = one handler call), this socket stays open
// and can exchange messages in both directions until the client disconnects.
io.on('connection', (socket) => {
    const color = colors[colorIndex % colors.length];
    colorIndex++;
    let username = 'User-' + colorIndex;

    console.log(`+ ${username} connected  (${io.engine.clientsCount} online)`);

    // socket.emit() — sends only to THIS client (private).
    // io.emit() — broadcasts to ALL connected clients (public).
    // This distinction is fundamental to WebSocket communication patterns.
    socket.emit('welcome', { name: username, color: color, online: io.engine.clientsCount });
    io.emit('online-count', io.engine.clientsCount);
    io.emit('system', username + ' joined the chat');

    // Event-driven messaging: the server listens for named events from the client.
    // No URL routing needed — events are identified by name strings.
    socket.on('set-name', (name) => {
        const old = username;
        // Truncate to 20 chars to prevent abuse from overly long names.
        username = name.substring(0, 20);
        console.log(`  ${old} renamed to ${username}`);
        io.emit('system', old + ' is now ' + username);
    });

    // When one client sends a message, the server immediately broadcasts it
    // to ALL clients via io.emit(). This is the "push" model — no polling needed.
    socket.on('chat-message', (msg) => {
        console.log(`  ${username}: ${msg}`);
        io.emit('chat-message', { user: username, color: color, text: msg, time: Date.now() });
    });

    // socket.broadcast.emit() sends to everyone EXCEPT the sender.
    // Used here so you don't see your own "is typing..." indicator.
    socket.on('typing', () => {
        socket.broadcast.emit('typing', username);
    });

    // 'disconnect' fires when the WebSocket connection closes.
    // Cleanup is important: we notify remaining users and update the count.
    socket.on('disconnect', () => {
        console.log(`- ${username} disconnected  (${io.engine.clientsCount} online)`);
        io.emit('system', username + ' left');
        io.emit('online-count', io.engine.clientsCount);
    });
});

// Note: we call server.listen(), NOT app.listen().
// app.listen() would create a new http.Server internally, bypassing Socket.IO.
server.listen(4000, () => {
    console.log('');
    console.log('=== WebSocket Chat Server ===');
    console.log('http://localhost:4000');
    console.log('');
    console.log('Waiting for connections...');
    console.log('');
});
