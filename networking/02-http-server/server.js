const express = require('express');
const path = require('path');




const app = express();

// express.json() is middleware that parses incoming JSON request bodies.
// Without this, req.body would be undefined for POST requests with JSON payloads.
app.use(express.json());

// Serve static files (index.html, style.css, app.js) from the 'public' folder.
// This is how the browser loads the frontend — Express acts as both
// a file server (static) and an API server (routes below).
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store. Using 'let' (not 'const') because we never reassign the
// array itself — we mutate it with push/splice. Data is lost when the server restarts,
// which is fine for a demo (a real app would use a database).
let users = [
    { name: 'Cristina', city: 'Sebes' },
    { name: 'Ion', city: 'Turda' },
    { name: 'Sebastian', city: 'Bistrita-Nasaud' }
];

// Middleware that intercepts all requests to /api/* and logs them.
// next() passes control to the actual route handler — without it,
// the request would hang and never respond. This is the middleware chain pattern.
app.use('/api', (req, res, next) => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${req.method} ${req.originalUrl}`);
    next();
});

// GET /api/users — returns the full user list as a JSON array.
// res.json() serializes the JavaScript object to JSON and sets Content-Type to application/json.
app.get('/api/users', (req, res) => {
    res.json(users);
});

// POST /api/users — creates a new user from the JSON body.
// Validates that both fields exist; returns 400 (Bad Request) if not.
// Returns the updated full list so the client can re-render without a second request.
app.put('/api/users', (req, res) => {
    const { name, city } = req.body;
    if (!name || !city) return res.status(400).json({ error: 'Name and city required' });
    users.push({ name, city });
    console.log(`  -> Added "${name}" from ${city}  (total: ${users.length})`);
    res.json(users);
});

//update
app.post('/api/users', (req, res) => {
    // const { name, city } = req.body;
    // to be implemented
    res.json(users);
});

// DELETE /api/users/:index — removes a user by array index.
// :index is a URL parameter (e.g. /api/users/2). parseInt converts the string to a number.
// splice(i, 1) removes exactly one element at position i and returns it.
app.delete('/api/users/:index', (req, res) => {
    const i = parseInt(req.params.index, 10);
    if (i < 0 || i >= users.length) return res.status(404).json({ error: 'Invalid index' });
    const removed = users.splice(i, 1);
    console.log(`  -> Removed "${removed[0].name}"  (total: ${users.length})`);
    res.json(users);
});

// Intentional slow endpoint — demonstrates non-blocking I/O.
// setTimeout is asynchronous: Node.js does NOT block while waiting.
// Other requests can still be served during the delay.
// This is the key advantage of Node's event loop over thread-per-request models.
app.get('/api/slow', (req, res) => {
    const delay = parseInt(req.query.ms, 10) || 2000;
    console.log(`  -> Simulating ${delay}ms network delay...`);
    setTimeout(() => res.json({ message: `Response after ${delay}ms`, timestamp: Date.now() }), delay);
});

// Start listening on port 3000. The callback fires once the server is ready.
// In HTTP, each client interaction is a separate request-response cycle:
// client connects -> sends request -> server processes -> sends response -> connection closes.
app.listen(3000, () => {
    console.log('');
    console.log('=== HTTP Demo Server ===');
    console.log('http://localhost:3000');
    console.log('');
    console.log('Watching for requests...');
    console.log('');
});
