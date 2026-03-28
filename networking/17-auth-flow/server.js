const express = require('express');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-Memory User Store ──
// In production, passwords would be hashed with bcrypt and stored in a database.
// Here we keep it simple for the demo — the focus is on the auth FLOW, not storage.
const users = {
    admin: { password: 'admin123', role: 'admin', name: 'Administrator' },
    student: { password: 'student123', role: 'user', name: 'Student' },
    guest: { password: 'guest', role: 'guest', name: 'Guest User' }
};

// ── Session Store ──
// Maps session tokens → user info. In production, use Redis or a database.
// Sessions are server-side state — the client only holds the token.
const sessions = new Map();

// Generate a cryptographically secure random token.
// crypto.randomBytes is preferred over Math.random for security tokens
// because Math.random is predictable (not cryptographically secure).
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// ── Authentication Middleware ──
// Checks for a valid session, first in cookies, then in Authorization header.
// This demonstrates two common auth transport mechanisms:
//   1. Cookies: browser sends automatically with every request (stateful)
//   2. Bearer tokens: client must send explicitly in headers (stateless-friendly)
function authMiddleware(req, res, next) {
    const token = req.cookies.session_token || extractBearerToken(req);

    if (!token || !sessions.has(token)) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'You must log in to access this resource.'
        });
    }

    // Attach user info to the request object for downstream handlers
    req.user = sessions.get(token);
    req.token = token;
    next();
}

function extractBearerToken(req) {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
        return auth.slice(7);
    }
    return null;
}

// ── Login Endpoint ──
// Accepts username + password, validates, creates a session, sets a cookie.
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users[username];

    // Constant-time comparison would be better for production to avoid timing attacks,
    // but for this educational demo, a simple comparison is sufficient.
    if (!user || user.password !== password) {
        console.log(`  LOGIN FAILED: ${username}`);
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create session
    const token = generateToken();
    const sessionData = {
        username,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
    };
    sessions.set(token, sessionData);

    // Set HTTP-only cookie — the browser stores this and sends it
    // automatically with every subsequent request to this domain.
    // httpOnly: true means JavaScript can't read it (prevents XSS token theft).
    // In production, also set: secure: true (HTTPS only), sameSite: 'strict'
    res.cookie('session_token', token, {
        httpOnly: true,
        maxAge: 3600000,      // 1 hour expiry
        sameSite: 'strict'
    });

    console.log(`  LOGIN OK: ${username} (${user.role})`);

    res.json({
        success: true,
        user: sessionData,
        token,  // Also return the token so the UI can show it
        cookie: 'session_token=' + token.substring(0, 16) + '...',
        explanation: {
            step1: 'Server validated your credentials',
            step2: 'Server generated a random 64-char session token',
            step3: 'Token stored server-side in sessions Map',
            step4: 'Token sent to browser as httpOnly cookie',
            step5: 'Browser will auto-attach cookie to future requests'
        }
    });
});

// ── Logout Endpoint ──
app.post('/api/logout', (req, res) => {
    const token = req.cookies.session_token;
    if (token) {
        sessions.delete(token);
    }
    // Clear the cookie by setting it to expire in the past
    res.clearCookie('session_token');
    console.log('  LOGOUT');
    res.json({ success: true, message: 'Session destroyed' });
});

// ── Protected Resource ──
// Requires authentication — returns 401 if not logged in
app.get('/api/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'This is protected data — you are authenticated!',
        user: req.user,
        tokenPreview: req.token.substring(0, 16) + '...',
        activeSessions: sessions.size
    });
});

// ── Admin-Only Resource ──
// Requires authentication AND admin role — demonstrates authorization
app.get('/api/admin', authMiddleware, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Forbidden',
            message: `Role "${req.user.role}" cannot access admin resources. Only "admin" role allowed.`,
            yourRole: req.user.role,
            requiredRole: 'admin'
        });
    }

    res.json({
        message: 'Welcome to the admin panel!',
        allSessions: Array.from(sessions.entries()).map(function (entry) {
            return { token: entry[0].substring(0, 12) + '...', user: entry[1] };
        }),
        totalUsers: Object.keys(users).length
    });
});

// ── Session Info (unauthenticated) ──
// Shows what the server sees about this request
app.get('/api/session-info', (req, res) => {
    const token = req.cookies.session_token;
    res.json({
        hasCookie: !!token,
        cookiePreview: token ? token.substring(0, 16) + '...' : null,
        isValidSession: token ? sessions.has(token) : false,
        authHeader: req.headers.authorization || null,
        totalActiveSessions: sessions.size
    });
});

app.listen(3012, () => {
    console.log('');
    console.log('=== Auth Flow Demo ===');
    console.log('http://localhost:3012');
    console.log('');
    console.log('  Available accounts:');
    console.log('    admin / admin123   (admin role)');
    console.log('    student / student123 (user role)');
    console.log('    guest / guest      (guest role)');
    console.log('');
});
