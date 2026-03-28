const express = require('express');
const net = require('net');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Well-known port descriptions — these are standardized by IANA.
// Port numbers 0-1023 are "well-known" and typically require root/admin privileges.
// Port numbers 1024-49151 are "registered" for specific applications.
const portInfo = {
    21: 'FTP — File Transfer Protocol',
    22: 'SSH — Secure Shell (remote login)',
    25: 'SMTP — Email sending',
    53: 'DNS — Domain Name System',
    80: 'HTTP — Web traffic (unencrypted)',
    110: 'POP3 — Email retrieval',
    143: 'IMAP — Email access',
    443: 'HTTPS — Web traffic (encrypted)',
    445: 'SMB — Windows file sharing',
    993: 'IMAPS — IMAP over SSL',
    995: 'POP3S — POP3 over SSL',
    3000: 'Dev server (Demo 2)',
    3306: 'MySQL — Database',
    3389: 'RDP — Remote Desktop',
    5432: 'PostgreSQL — Database',
    5000: 'Dev server (Demo 4)',
    6379: 'Redis — Cache/store',
    8080: 'HTTP Alt — Common dev port',
    8443: 'HTTPS Alt',
    27017: 'MongoDB — Database'
};

// Scans a single port on localhost by attempting a TCP connection.
// If the connection succeeds, the port is "open" (a service is listening).
// If it fails/times out, the port is "closed" (no service on that port).
// SECURITY: Only scans localhost (127.0.0.1) — never external hosts.
function scanPort(port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(500); // 500ms timeout — enough for localhost

        socket.on('connect', () => {
            socket.destroy();
            resolve({ port, open: true, service: portInfo[port] || 'Unknown' });
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve({ port, open: false, service: portInfo[port] || 'Unknown' });
        });

        socket.on('error', () => {
            resolve({ port, open: false, service: portInfo[port] || 'Unknown' });
        });

        // Only scan localhost for safety — scanning external hosts
        // without authorization would be unethical and potentially illegal.
        socket.connect(port, '127.0.0.1');
    });
}

app.get('/api/scan', async (req, res) => {
    // Default set of interesting ports to scan
    const defaultPorts = [21, 22, 25, 53, 80, 110, 143, 443, 445, 3000, 3306, 3389, 5000, 5432, 6379, 8080, 27017];
    const ports = req.query.ports
        ? req.query.ports.split(',').map(p => parseInt(p, 10)).filter(p => p > 0 && p <= 65535)
        : defaultPorts;

    console.log(`  Scanning ${ports.length} ports on localhost...`);
    const start = Date.now();

    // Scan all ports in parallel for speed
    const results = await Promise.all(ports.map(scanPort));

    console.log(`  Done in ${Date.now() - start}ms — ${results.filter(r => r.open).length} open`);
    res.json({ results, time: Date.now() - start });
});

app.listen(3009, () => {
    console.log('');
    console.log('=== Port Scanner (localhost only) ===');
    console.log('http://localhost:3009');
    console.log('');
});
