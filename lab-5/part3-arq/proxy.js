// proxy.js — Part 3: Bidirectional Chaos Proxy
// Sits between client and server, randomly dropping 30 % of packets
// in both directions to simulate an unreliable network.
// Unlike the Part 2 proxy, this one relays ACKs back to the client.

const dgram = require("dgram");
const proxy = dgram.createSocket("udp4");

const PROXY_PORT = 4000;
const DEST_PORT = 5000;
const DROP_RATE = 0.3; // up to 30 % packet loss

let total = 0;
let dropped = 0;

// Track the last client so we can relay ACKs back
let clientAddress = null;
let clientPort = null;

proxy.on("message", (msg, rinfo) => {
    total++;

    // Determine direction: if from the server (port 5000), relay back to client
    if (rinfo.port === DEST_PORT) {
        // This is an ACK from the server → forward to client
        if (!clientAddress) return;
        if (Math.random() > DROP_RATE) {
            console.log(
                `[${total}] Forwarding ACK from server → ${clientAddress}:${clientPort}`
            );
            proxy.send(msg, clientPort, clientAddress);
        } else {
            dropped++;
            console.log(`[${total}] 🔥 ACK dropped by Chaos Proxy! (${dropped}/${total} dropped)`);
        }
    } else {
        // This is a packet from the client → forward to server
        clientAddress = rinfo.address;
        clientPort = rinfo.port;
        if (Math.random() > DROP_RATE) {
            console.log(
                `[${total}] Forwarding packet from ${rinfo.address}:${rinfo.port} → localhost:${DEST_PORT}`
            );
            proxy.send(msg, DEST_PORT, "localhost");
        } else {
            dropped++;
            console.log(`[${total}] 🔥 Packet dropped by Chaos Proxy! (${dropped}/${total} dropped)`);
        }
    }
});

proxy.bind(PROXY_PORT, () => {
    console.log(`Bidirectional Chaos Proxy listening on port ${PROXY_PORT}`);
    console.log(`Forwarding to port ${DEST_PORT} with ${DROP_RATE * 100}% drop rate`);
});
