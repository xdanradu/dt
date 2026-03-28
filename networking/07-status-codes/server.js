const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Status code descriptions — maps numeric codes to human-readable explanations.
// HTTP defines 5 categories: 1xx informational, 2xx success, 3xx redirection,
// 4xx client error, 5xx server error.
const descriptions = {
    200: 'OK — The request succeeded. This is the standard response for successful requests.',
    201: 'Created — A new resource was successfully created (e.g. after a POST).',
    204: 'No Content — Success, but there is no body to return (e.g. after a DELETE).',
    301: 'Moved Permanently — This URL has permanently moved. Browser should use the new URL from now on.',
    302: 'Found — Temporary redirect. Browser should use the new URL just this once.',
    304: 'Not Modified — The cached version is still valid. Saves bandwidth.',
    400: 'Bad Request — The server cannot understand the request (e.g. malformed JSON).',
    401: 'Unauthorized — Authentication is required. The client must log in first.',
    403: 'Forbidden — The server understood the request but refuses to authorize it.',
    404: 'Not Found — The requested resource does not exist on this server.',
    405: 'Method Not Allowed — The HTTP method (GET/POST/etc.) is not supported for this URL.',
    418: "I'm a Teapot — An April Fools' joke in RFC 2324. The server refuses to brew coffee because it is a teapot.",
    429: 'Too Many Requests — Rate limit exceeded. The client is sending too many requests.',
    500: 'Internal Server Error — The server encountered an unexpected condition.',
    502: 'Bad Gateway — The server got an invalid response from an upstream server.',
    503: 'Service Unavailable — The server is temporarily overloaded or under maintenance.',
    504: 'Gateway Timeout — The upstream server did not respond in time.'
};

// Dynamic route: :code is a URL parameter that becomes req.params.code.
// This endpoint returns whatever HTTP status code the client asks for,
// letting students experiment with different codes and see browser behavior.
app.get('/api/status/:code', (req, res) => {
    const code = parseInt(req.params.code, 10);
    if (code < 100 || code > 599) {
        return res.status(400).json({ error: 'Status code must be between 100-599' });
    }
    const description = descriptions[code] || 'No description available for this code.';
    console.log(`  -> Responded with ${code}`);
    // res.status() sets the HTTP status code; .json() sends the body.
    // The browser/client reads the status code to decide how to handle the response.
    res.status(code).json({ code, description, category: getCategory(code) });
});

function getCategory(code) {
    if (code < 200) return 'Informational';
    if (code < 300) return 'Success';
    if (code < 400) return 'Redirection';
    if (code < 500) return 'Client Error';
    return 'Server Error';
}

app.listen(3002, () => {
    console.log('');
    console.log('=== Status Code Playground ===');
    console.log('http://localhost:3002');
    console.log('');
});
