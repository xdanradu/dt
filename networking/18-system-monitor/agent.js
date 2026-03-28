/**
 * System Monitor Agent — zero dependencies, runs on Node.js only.
 *
 * Usage:  node agent.js <server-ip> [port]
 * Example: node agent.js 192.168.1.50
 *          node agent.js 192.168.1.50 3018
 */

const os = require('os');
const http = require('http');
const crypto = require('crypto');

const SERVER_HOST = process.argv[2] || 'localhost';
const SERVER_PORT = process.argv[3] || 3018;
const INTERVAL_MS = 3_000;

// Unique ID for this agent (persists across heartbeats)
const AGENT_ID = crypto.randomBytes(6).toString('hex');

// ── helpers ──────────────────────────────────────────────

function getLocalIP() {
    const nets = os.networkInterfaces();
    for (const iface of Object.values(nets)) {
        for (const cfg of iface) {
            if (cfg.family === 'IPv4' && !cfg.internal) return cfg.address;
        }
    }
    return '127.0.0.1';
}

// Measure CPU usage over a short sample window
function getCPUUsage() {
    return new Promise(resolve => {
        const start = os.cpus().map(c => ({ idle: c.times.idle, total: Object.values(c.times).reduce((a, b) => a + b, 0) }));
        setTimeout(() => {
            const end = os.cpus().map(c => ({ idle: c.times.idle, total: Object.values(c.times).reduce((a, b) => a + b, 0) }));
            let idleDelta = 0, totalDelta = 0;
            for (let i = 0; i < start.length; i++) {
                idleDelta += end[i].idle - start[i].idle;
                totalDelta += end[i].total - start[i].total;
            }
            resolve(totalDelta === 0 ? 0 : Math.round((1 - idleDelta / totalDelta) * 100));
        }, 500);
    });
}

// ── heartbeat ────────────────────────────────────────────

async function sendHeartbeat() {
    const cpu = await getCPUUsage();
    const payload = JSON.stringify({
        id: AGENT_ID,
        hostname: os.hostname(),
        ip: getLocalIP(),
        cpu,
        platform: `${os.type()} ${os.arch()}`,
        uptime: Math.round(os.uptime())
    });

    const req = http.request({
        hostname: SERVER_HOST,
        port: SERVER_PORT,
        path: '/api/heartbeat',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
        timeout: 5000
    }, res => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            process.stdout.write(`\r  ✓ sent  cpu=${cpu}%  →  ${SERVER_HOST}:${SERVER_PORT}  `);
        });
    });

    req.on('error', err => {
        process.stdout.write(`\r  ✗ failed: ${err.message}                  `);
    });

    req.write(payload);
    req.end();
}

// ── main ─────────────────────────────────────────────────

console.log('');
console.log('=== System Monitor Agent ===');
console.log(`Agent ID:   ${AGENT_ID}`);
console.log(`Hostname:   ${os.hostname()}`);
console.log(`Local IP:   ${getLocalIP()}`);
console.log(`Server:     ${SERVER_HOST}:${SERVER_PORT}`);
console.log(`Interval:   ${INTERVAL_MS / 1000}s`);
console.log('');

sendHeartbeat();
setInterval(sendHeartbeat, INTERVAL_MS);
