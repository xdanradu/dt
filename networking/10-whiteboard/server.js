const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Store all strokes so new users see the existing drawing.
// Without this, a late joiner would see a blank canvas.
let strokes = [];

const colors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c'];
let userCount = 0;

io.on('connection', (socket) => {
    const color = colors[userCount % colors.length];
    userCount++;
    console.log(`+ Artist connected  (${io.engine.clientsCount} online)`);

    // Send the assigned color and all existing strokes to the new client
    socket.emit('welcome', { color, strokes });
    io.emit('online-count', io.engine.clientsCount);

    // A 'draw' event contains a line segment: from (x0,y0) to (x1,y1).
    // Coordinates are percentages (0-100) for resolution independence.
    // We store it and broadcast to all other clients for real-time drawing.
    socket.on('draw', (data) => {
        strokes.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', () => {
        strokes = [];
        io.emit('clear');
        console.log('  Canvas cleared');
    });

    socket.on('disconnect', () => {
        console.log(`- Artist disconnected  (${io.engine.clientsCount} online)`);
        io.emit('online-count', io.engine.clientsCount);
    });
});

server.listen(3005, () => {
    console.log('');
    console.log('=== Shared Whiteboard ===');
    console.log('http://localhost:3005');
    console.log('');
});
