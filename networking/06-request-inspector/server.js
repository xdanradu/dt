const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Returns the raw HTTP headers the browser sent with this request.
// Every HTTP request includes headers automatically — the browser adds them
// without the user knowing. This endpoint exposes what's normally invisible.
app.get('/api/inspect', (req, res) => {
    res.json({
        // req.method and req.originalUrl show the HTTP request line (e.g. "GET /api/inspect")
        method: req.method,
        url: req.originalUrl,
        // req.httpVersion shows whether the browser used HTTP/1.1 or HTTP/2
        httpVersion: req.httpVersion,
        // req.headers is an object of ALL headers the browser sent.
        // Includes User-Agent (browser identity), Accept-Language (preferred language),
        // Accept-Encoding (compression support), Cookie, and more.
        headers: req.headers,
        // req.ip is the client's IP address — how the server knows who sent the request.
        ip: req.ip,
        // req.query contains parsed URL query parameters (e.g. ?foo=bar → { foo: "bar" })
        query: req.query
    });
});

app.listen(3001, () => {
    console.log('');
    console.log('=== Request Inspector ===');
    console.log('http://localhost:3001');
    console.log('');
});
