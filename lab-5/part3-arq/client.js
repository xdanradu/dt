// client.js — Part 3: Reliable Client (Stop-and-Wait ARQ)
// Sends numbered packets through the Chaos Proxy and retransmits on timeout.

const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const PROXY_PORT = 4000;
const TIMEOUT_MS = 2000;

const messages = [
    "Crucial Data",
    "Important Payload",
    "Sensitive Info",
    "Final Packet"
];

let sequenceNumber = 0;
let currentTimeout = null;

function sendReliable() {
    if (sequenceNumber >= messages.length) {
        console.log("\n🎉 All messages delivered successfully!");
        client.close();
        return;
    }

    const data = messages[sequenceNumber];
    const packet = Buffer.from(`${sequenceNumber}:${data}`);
    console.log(`Sending seq=${sequenceNumber} → "${data}"`);

    client.send(packet, PROXY_PORT, "localhost");

    // Set a retransmission timeout
    currentTimeout = setTimeout(() => {
        console.log(`⏰ Timeout for seq=${sequenceNumber}! Retransmitting...`);
        sendReliable(); // retry the same packet
    }, TIMEOUT_MS);
}

client.on("message", (msg) => {
    const ack = msg.toString();
    const expectedAck = `ACK:${sequenceNumber}`;

    if (ack === expectedAck) {
        console.log(`🎯 ${ack} received! Moving to next packet.`);
        clearTimeout(currentTimeout);
        sequenceNumber++;
        sendReliable(); // send next message
    }
});

console.log(`Reliable client — sending ${messages.length} messages through proxy on port ${PROXY_PORT}`);
console.log(`Timeout: ${TIMEOUT_MS} ms\n`);
sendReliable();
