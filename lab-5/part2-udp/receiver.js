// receiver.js — Part 2: UDP Receiver
// Listens on port 5000 for datagrams forwarded through the Chaos Proxy.

const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PORT = 5000;
let count = 0;

server.on("message", (msg, rinfo) => {
    count++;
    console.log(`[${count}] Received from ${rinfo.address}:${rinfo.port} → "${msg.toString()}"`);
});

server.bind(PORT, () => {
    console.log(`Receiver listening on port ${PORT}`);
});
