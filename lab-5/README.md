# Lab: Data Transmission & Reliability in JavaScript

**Duration:** 4 parts  
**Objective:** Transition from raw byte manipulation to a reliable transmission protocol.

## Prerequisites

- Node.js installed (v16+)
- No external libraries for Parts 1–3
- `npm install` for Part 4 (installs `ws` for WebSockets)

## Setup

```bash
cd lab
npm install
```

## Lab Structure

| Part | Topic | Folder | Key Concepts |
|------|-------|--------|-------------|
| 1 | Data Link Layer — Framing & Checksums | `part1-framing/` | Buffer, SOF/EOF, XOR checksum |
| 2 | The Unreliable Network — UDP & Packet Loss | `part2-udp/` | UDP sockets, Chaos Proxy, packet loss simulation |
| 3 | Implementing Reliability — Stop-and-Wait ARQ | `part3-arq/` | Sequence numbers, timeouts, retransmission, ACK |
| 4 | Modern Full-Duplex — WebSockets | `part4-websockets/` | WebSocket server, heartbeat, ping/pong |

## How to Run Each Exercise

Each part folder contains its own `README.md` with instructions and a dedicated JavaScript file to run.

### Part 1
```bash
node part1-framing/framing.js
```

### Part 2
```bash
node part2-udp/proxy.js
# Then in a separate terminal:
node part3-arq/server.js
# Then in another terminal:
node part3-arq/client.js
```

### Part 3
Run the proxy from Part 2, then the server and client from `part3-arq/`.

### Part 4
```bash
node part4-websockets/server-ws.js
# In a separate terminal:
node part4-websockets/client-ws.js
```

## Summary of Learning

1. **Buffer** — Handles binary data directly in memory.
2. **UDP** — Fast but "Fire and Forget."
3. **ARQ** — Logic required to make UDP reliable (sequence numbers + timers).
4. **WebSockets** — An abstraction that handles all of the above automatically for the web.
