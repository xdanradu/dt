const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Poll state — single question with vote counts.
// Each connected user can only vote once (tracked by socket ID).
let poll = {
    question: 'What is the best transport protocol for real-time apps?',
    options: ['HTTP Polling', 'WebSocket', 'Server-Sent Events', 'Carrier Pigeon'],
    votes: [0, 0, 0, 0]
};

// Track which socket IDs have voted to prevent double voting.
// Using a Map: socketId -> optionIndex
const voters = new Map();

io.on('connection', (socket) => {
    console.log(`+ Voter connected  (${io.engine.clientsCount} online)`);

    // Send current poll state so the user sees existing results immediately
    socket.emit('poll-state', {
        question: poll.question,
        options: poll.options,
        votes: poll.votes,
        totalVoters: voters.size,
        hasVoted: false
    });
    io.emit('online-count', io.engine.clientsCount);

    socket.on('vote', (optionIndex) => {
        // Validate the vote index to prevent out-of-bounds access
        if (optionIndex < 0 || optionIndex >= poll.options.length) return;

        // If user already voted, remove their previous vote (allows changing vote)
        if (voters.has(socket.id)) {
            poll.votes[voters.get(socket.id)]--;
        }

        poll.votes[optionIndex]++;
        voters.set(socket.id, optionIndex);
        console.log(`  Vote: "${poll.options[optionIndex]}"  [${poll.votes.join(', ')}]`);

        // Broadcast updated results to ALL clients instantly
        io.emit('votes-updated', { votes: poll.votes, totalVoters: voters.size });
    });

    socket.on('disconnect', () => {
        console.log(`- Voter disconnected  (${io.engine.clientsCount} online)`);
        io.emit('online-count', io.engine.clientsCount);
    });
});

server.listen(3006, () => {
    console.log('');
    console.log('=== Live Voting ===');
    console.log('http://localhost:3006');
    console.log('');
});
