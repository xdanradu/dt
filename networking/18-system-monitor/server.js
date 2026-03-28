const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store of connected agents: { id -> { ip, hostname, cpu, platform, uptime, lastSeen } }
const agents = new Map();

// SSE clients (dashboard browser tabs)
const sseClients = new Set();

function broadcast() {
    const list = Array.from(agents.values()).map(a => ({
        ...a,
        ago: Math.round((Date.now() - a.lastSeen) / 1000)
    }));
    const data = `data: ${JSON.stringify(list)}\n\n`;
    for (const res of sseClients) {
        res.write(data);
    }
}

// Remove agents that haven't sent a heartbeat in 10 seconds
const TIMEOUT_MS = 10_000;

setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, agent] of agents) {
        if (now - agent.lastSeen > TIMEOUT_MS) {
            console.log(`- ${agent.hostname} (${agent.ip}) timed out`);
            agents.delete(id);
            changed = true;
        }
    }
    if (changed) broadcast();
}, 3_000);

// Agents POST their stats here every few seconds
app.post('/api/heartbeat', (req, res) => {
    const { id, hostname, ip, cpu, platform, uptime } = req.body;
    if (!id || !hostname) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const isNew = !agents.has(id);
    agents.set(id, { id, hostname, ip, cpu, platform, uptime, lastSeen: Date.now() });

    if (isNew) {
        console.log(`+ ${hostname} (${ip}) connected  — ${agents.size} online`);
    }

    broadcast();
    res.json({ ok: true, serverTime: Date.now() });
});

// SSE endpoint — dashboard subscribes here
app.get('/api/events', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');
    sseClients.add(res);

    // Send current state immediately
    const list = Array.from(agents.values()).map(a => ({
        ...a,
        ago: Math.round((Date.now() - a.lastSeen) / 1000)
    }));
    res.write(`data: ${JSON.stringify(list)}\n\n`);

    req.on('close', () => sseClients.delete(res));
});

// Find a local network IP to display
function getLocalIP() {
    const nets = os.networkInterfaces();
    for (const iface of Object.values(nets)) {
        for (const cfg of iface) {
            if (cfg.family === 'IPv4' && !cfg.internal) return cfg.address;
        }
    }
    return '127.0.0.1';
}

const PORT = process.env.PORT || 3018;
app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIP();
    console.log('');
    console.log('=== System Monitor Dashboard ===');
    console.log(`Dashboard:  http://localhost:${PORT}`);
    console.log(`Network:    http://${ip}:${PORT}`);
    console.log('');
    console.log(`Students run:  node agent.js ${ip}`);
    console.log('');
});
