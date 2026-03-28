// sender.js — Part 2: UDP Sender
// Sends a batch of numbered messages to the Chaos Proxy on port 4000.

const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const PROXY_PORT = 4000;
const TOTAL_MESSAGES = 10;

let sent = 0;

function sendNext() {
    if (sent >= TOTAL_MESSAGES) {
        console.log(`\nAll ${TOTAL_MESSAGES} messages sent. Check the receiver to see how many arrived.`);
        client.close();
        return;
    }

    sent++;
    const message = `Message #${sent}`;
    client.send(message, PROXY_PORT, "localhost", (err) => {
        if (err) {
            console.error("Send error:", err);
        } else {
            console.log(`Sent: ${message}`);
        }
        // Small delay between sends so output is readable
        setTimeout(sendNext, 200);
    });
}

console.log(`Sending ${TOTAL_MESSAGES} messages through Chaos Proxy on port ${PROXY_PORT}...`);
sendNext();
