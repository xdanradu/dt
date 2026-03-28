const express = require('express');
const dns = require('dns');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// DNS lookup endpoint — resolves a domain name to its various record types.
// DNS is the "phone book of the internet": translates human-readable names
// (like google.com) into machine-readable IP addresses (like 142.250.74.206).
app.get('/api/dns/:domain', (req, res) => {
    const domain = req.params.domain;
    // Basic validation: only allow alphanumeric, dots, and hyphens
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
        return res.status(400).json({ error: 'Invalid domain name' });
    }

    console.log(`  Looking up: ${domain}`);
    const start = Date.now();
    const results = {};

    // dns.promises gives us Promise-based versions of Node's DNS functions.
    // We query multiple record types in parallel for efficiency.
    const lookups = [
        // A records: IPv4 addresses — the most fundamental DNS record
        dns.promises.resolve4(domain).then(r => { results.A = r; }).catch(() => { results.A = []; }),
        // AAAA records: IPv6 addresses — the newer 128-bit address format
        dns.promises.resolve6(domain).then(r => { results.AAAA = r; }).catch(() => { results.AAAA = []; }),
        // MX records: Mail exchange servers — where to deliver email for this domain
        dns.promises.resolveMx(domain).then(r => { results.MX = r; }).catch(() => { results.MX = []; }),
        // NS records: Name servers — which DNS servers are authoritative for this domain
        dns.promises.resolveNs(domain).then(r => { results.NS = r; }).catch(() => { results.NS = []; }),
        // TXT records: Arbitrary text — used for email verification (SPF, DKIM), domain ownership proof
        dns.promises.resolveTxt(domain).then(r => { results.TXT = r.map(t => t.join('')); }).catch(() => { results.TXT = []; }),
        // CNAME records: Canonical name aliases — one domain pointing to another
        dns.promises.resolveCname(domain).then(r => { results.CNAME = r; }).catch(() => { results.CNAME = []; })
    ];

    Promise.all(lookups).then(() => {
        res.json({ domain, records: results, time: Date.now() - start });
    });
});

app.listen(3008, () => {
    console.log('');
    console.log('=== DNS Lookup Visualizer ===');
    console.log('http://localhost:3008');
    console.log('');
});
