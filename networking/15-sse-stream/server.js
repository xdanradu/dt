const express = require('express');
const path = require('path');
const os = require('os');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Server-Sent Events (SSE) is a W3C standard where the server keeps
// an HTTP response open and pushes text events to the client.
// Unlike WebSocket, SSE is:
//   - One-directional: server → client only
//   - Uses plain HTTP — works through proxies, no special protocol
//   - Automatic reconnection built into the browser API (EventSource)
//   - Simpler than WebSocket when you only need server push

// Track connected SSE clients so we can show the count
let sseClients = [];

// Main SSE endpoint — the client calls new EventSource('/api/stream')
// and the browser keeps this connection open indefinitely.
app.get('/api/stream', (req, res) => {
    // These three headers are the SSE magic:
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',   // tells browser it's SSE
        'Cache-Control': 'no-cache',            // don't cache the stream
        'Connection': 'keep-alive'              // keep TCP connection open
    });

    // SSE message format: "data: <payload>\n\n"
    // Optional fields: "event:", "id:", "retry:"
    // The double newline marks the end of a message.

    const clientId = Date.now();
    sseClients.push({ id: clientId, res });
    console.log(`  Client ${clientId} connected (${sseClients.length} total)`);

    // Send initial connection confirmation
    res.write(`event: connected\ndata: ${JSON.stringify({ clientId, total: sseClients.length })}\n\n`);

    // Server clock — push the server's clock every second.
    // This shows SSE's strength: the server decides when to push.
    const clockInterval = setInterval(() => {
        const now = new Date();
        res.write(`event: clock\ndata: ${JSON.stringify({
            time: now.toLocaleTimeString(),
            iso: now.toISOString()
        })}\n\n`);
    }, 1000);

    // System stats — push CPU and memory usage every 3 seconds.
    // Shows a realistic use case: live server monitoring.
    const statsInterval = setInterval(() => {
        const cpus = os.cpus();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMemPct = ((1 - freeMem / totalMem) * 100).toFixed(1);

        // CPU usage: average across all cores
        const cpuAvg = cpus.reduce((acc, cpu) => {
            const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
            const idle = cpu.times.idle;
            return acc + ((total - idle) / total) * 100;
        }, 0) / cpus.length;

        res.write(`event: stats\ndata: ${JSON.stringify({
            cpuPct: cpuAvg.toFixed(1),
            memPct: usedMemPct,
            memUsed: ((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(2),
            memTotal: (totalMem / 1024 / 1024 / 1024).toFixed(2),
            uptime: Math.floor(os.uptime()),
            platform: os.platform(),
            hostname: os.hostname()
        })}\n\n`);
    }, 3000);

    // Simulated log entries — push a random "log" message every 2-5 seconds.
    // Demonstrates that SSE can push irregular, event-driven data.
    const logMessages = [
        'User login from 192.168.1.42',
        'Database query completed (12ms)',
        'Cache miss for key "session:abc"',
        'File uploaded: report.pdf (2.3MB)',
        'API rate limit check passed',
        'Background job #42 completed',
        'New connection from 10.0.0.5',
        'Certificate renewal scheduled',
        'Health check passed (all services OK)',
        'Backup snapshot created'
    ];

    function sendRandomLog() {
        const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
        const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'DEBUG'];
        const level = levels[Math.floor(Math.random() * levels.length)];
        res.write(`event: log\ndata: ${JSON.stringify({
            level,
            message: msg,
            timestamp: new Date().toISOString()
        })}\n\n`);

        // Schedule next log at a random 2-5 second interval
        logTimeout = setTimeout(sendRandomLog, 2000 + Math.random() * 3000);
    }
    let logTimeout = setTimeout(sendRandomLog, 1000);

    // When the client disconnects (browser tab closed, EventSource.close()),
    // clean up intervals to prevent memory leaks.
    req.on('close', () => {
        clearInterval(clockInterval);
        clearInterval(statsInterval);
        clearTimeout(logTimeout);
        sseClients = sseClients.filter(c => c.id !== clientId);
        console.log(`  Client ${clientId} disconnected (${sseClients.length} remaining)`);
    });
});

app.listen(3010, () => {
    console.log('');
    console.log('=== SSE Live Stream ===');
    console.log('http://localhost:3010');
    console.log('');
});
