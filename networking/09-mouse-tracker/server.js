const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#e91e63'];
let userCount = 0;

io.on('connection', (socket) => {
    const color = colors[userCount % colors.length];
    const name = 'User-' + (++userCount);

    console.log(`+ ${name} connected  (${io.engine.clientsCount} online)`);
    socket.emit('welcome', { name, color });
    io.emit('online-count', io.engine.clientsCount);

    // 'mouse-move' fires rapidly (every ~16ms at 60fps).
    // socket.broadcast.emit sends to all clients EXCEPT the sender —
    // the sender already knows their own cursor position.
    // This is the highest-frequency WebSocket use case: real-time position streaming.
    socket.on('mouse-move', (data) => {
        socket.broadcast.emit('mouse-move', { name, color, x: data.x, y: data.y });
    });

    socket.on('disconnect', () => {
        console.log(`- ${name} disconnected`);
        // Notify clients to remove this user's cursor from the canvas
        io.emit('user-left', name);
        io.emit('online-count', io.engine.clientsCount);
    });
});

server.listen(3004, () => {
    console.log('');
    console.log('=== Live Mouse Tracker ===');
    console.log('http://localhost:3004');
    console.log('');
});
