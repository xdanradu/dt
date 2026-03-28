// server.js — Part 3: ARQ Receiver / ACK Server
// Listens for numbered packets on port 5000 and replies with ACKs.

const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PORT = 5000;
let expectedSeq = 0;

server.on("message", (msg, rinfo) => {
    const parts = msg.toString().split(":");
    const seq = parseInt(parts[0], 10);
    const data = parts.slice(1).join(":");

    console.log(`Received seq=${seq} data="${data}" from ${rinfo.address}:${rinfo.port}`);

    if (seq === expectedSeq) {
        console.log(`  ✅ In order — sending ACK:${seq}`);
        expectedSeq++;
    } else {
        console.log(`  ⚠️  Duplicate or out-of-order (expected ${expectedSeq}) — re-sending ACK:${seq}`);
    }

    // Always ACK the received sequence number so the sender can move on
    const ack = Buffer.from(`ACK:${seq}`);
    server.send(ack, rinfo.port, rinfo.address);
});

server.bind(PORT, () => {
    console.log(`ARQ Server listening on port ${PORT}`);
});
