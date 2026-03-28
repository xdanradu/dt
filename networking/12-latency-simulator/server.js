const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Simulated latency endpoint — delays the response by the requested amount.
// In real networks, latency comes from physical distance (speed of light in fiber),
// routing hops, and processing time. This demo lets students *feel* those delays.
app.get('/api/ping', (req, res) => {
    const delay = parseInt(req.query.delay, 10) || 0;
    const start = Date.now();

    // setTimeout simulates network propagation delay.
    // The server is "ready" instantly — we're just holding the response.
    setTimeout(() => {
        res.json({
            requestedDelay: delay,
            actualDelay: Date.now() - start,
            timestamp: Date.now()
        });
    }, delay);
});

app.listen(3007, () => {
    console.log('');
    console.log('=== Latency Simulator ===');
    console.log('http://localhost:3007');
    console.log('');
});
