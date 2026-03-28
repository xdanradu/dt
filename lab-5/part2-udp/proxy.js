// proxy.js — Part 2: Chaos Proxy
// Sits between sender and receiver, randomly dropping 30 % of UDP packets
// to simulate an unreliable network.

const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PROXY_PORT = 4000;
const DEST_PORT = 5000;
const DROP_RATE = 0.3; // up to 30 % packet loss

let total = 0;
let dropped = 0;

server.on("message", (msg, rinfo) => {
    total++;
    if (Math.random() > DROP_RATE) {
        console.log(
            `[${total}] Forwarding packet from ${rinfo.address}:${rinfo.port} → localhost:${DEST_PORT}`
        );
        server.send(msg, DEST_PORT, "localhost");
    } else {
        dropped++;
        console.log(`[${total}] 🔥 Packet dropped by Chaos Proxy! (${dropped}/${total} dropped)`);
    }
});

server.bind(PROXY_PORT, () => {
    console.log(`Chaos Proxy listening on port ${PROXY_PORT}`);
    console.log(`Forwarding to port ${DEST_PORT} with ${DROP_RATE * 100}% drop rate`);
});
