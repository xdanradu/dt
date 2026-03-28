const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// ── Rate Limiter Configuration ──
// In production, rate limiting prevents abuse (brute-force attacks, scraping,
// DDoS). Here we use a simple in-memory "sliding window" approach.
// Production systems use Redis or similar for distributed rate limiting.

let MAX_REQUESTS = 5;       // requests allowed per window
let WINDOW_MS = 60000;      // window size in milliseconds (1 minute)

// Map of IP → { count, resetTime }
// Each entry tracks how many requests an IP has made in the current window.
const rateLimitStore = new Map();

// Clean up expired entries every 30 seconds to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now > data.resetTime) rateLimitStore.delete(ip);
    }
}, 30000);

// Rate limit middleware — runs before the route handler.
// Checks if the client has exceeded MAX_REQUESTS in the current WINDOW_MS.
function rateLimitMiddleware(req, res, next) {
    // In this demo, all clients come from localhost (127.0.0.1).
    // We use a custom header so students can simulate different "users".
    const ip = req.headers['x-simulated-ip'] || req.ip;
    const now = Date.now();

    let record = rateLimitStore.get(ip);

    // If no record or window expired, start a fresh window
    if (!record || now > record.resetTime) {
        record = { count: 0, resetTime: now + WINDOW_MS, firstRequest: now };
        rateLimitStore.set(ip, record);
    }

    record.count++;

    // Standard rate-limit response headers (RFC 6585 / draft-ietf-httpapi-ratelimit-headers)
    // These tell the client how many requests remain and when the limit resets.
    res.set({
        'X-RateLimit-Limit': MAX_REQUESTS,
        'X-RateLimit-Remaining': Math.max(0, MAX_REQUESTS - record.count),
        'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000)
    });

    if (record.count > MAX_REQUESTS) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        res.set('Retry-After', retryAfter);

        console.log(`  BLOCKED ${ip} — ${record.count}/${MAX_REQUESTS} (retry in ${retryAfter}s)`);

        // HTTP 429 "Too Many Requests" — the standard status code for rate limiting
        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
            limit: MAX_REQUESTS,
            used: record.count,
            retryAfter
        });
    }

    console.log(`  OK ${ip} — ${record.count}/${MAX_REQUESTS}`);
    next();
}

// The protected endpoint — students spam this button
app.get('/api/resource', rateLimitMiddleware, (req, res) => {
    res.json({
        success: true,
        message: 'Here is your data!',
        data: { value: Math.floor(Math.random() * 1000), timestamp: new Date().toISOString() },
        rateLimit: {
            limit: MAX_REQUESTS,
            remaining: parseInt(res.get('X-RateLimit-Remaining')),
            resetsAt: new Date(parseInt(res.get('X-RateLimit-Reset')) * 1000).toISOString()
        }
    });
});

// Config endpoint — lets the demo UI adjust settings dynamically
app.get('/api/config', (req, res) => {
    res.json({ maxRequests: MAX_REQUESTS, windowMs: WINDOW_MS });
});

app.post('/api/config', express.json(), (req, res) => {
    if (req.body.maxRequests) MAX_REQUESTS = Math.max(1, Math.min(100, parseInt(req.body.maxRequests)));
    if (req.body.windowMs) WINDOW_MS = Math.max(5000, Math.min(300000, parseInt(req.body.windowMs)));
    // Clear existing records when config changes so the new limits take effect immediately
    rateLimitStore.clear();
    console.log(`  Config updated: ${MAX_REQUESTS} req / ${WINDOW_MS / 1000}s`);
    res.json({ maxRequests: MAX_REQUESTS, windowMs: WINDOW_MS });
});

// Resets the rate limit for the calling IP — "unblock yourself" button
app.post('/api/reset', (req, res) => {
    rateLimitStore.clear();
    console.log('  All rate limits cleared');
    res.json({ ok: true });
});

app.listen(3011, () => {
    console.log('');
    console.log('=== Rate Limiter Demo ===');
    console.log('http://localhost:3011');
    console.log(`  Limit: ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000}s`);
    console.log('');
});
