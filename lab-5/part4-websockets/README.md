# Part 4: Modern Full-Duplex — WebSockets

## Objective

WebSockets provide a persistent, full-duplex TCP connection between client and server — handling framing, checksums, and reliability at the protocol level. In this exercise you will:

1. Create a WebSocket **server** with a heartbeat (ping/pong) mechanism.
2. Create a WebSocket **client** that connects and exchanges messages.
3. Observe how the protocol handles connection health automatically.

## Key Concepts

| Term | Description |
|------|-------------|
| **WebSocket** | Full-duplex communication protocol over a single TCP connection |
| **ws** | Popular Node.js WebSocket library (`npm install ws`) |
| **Ping / Pong** | Built-in heartbeat frames used to detect dead connections |
| **Full-duplex** | Both sides can send and receive simultaneously |

## Prerequisites

```bash
cd ..   # back to lab/
npm install
```

This installs the `ws` package declared in `package.json`.

## Running

Open **two** terminals:

```bash
# Terminal 1 — start the WebSocket server
node server-ws.js

# Terminal 2 — start the WebSocket client
node client-ws.js
```

## Exercises

1. Run both scripts and watch the ping/pong heartbeat in the server console.
2. Close the client (Ctrl+C) and observe the server detecting the disconnect.
3. **Challenge:** Modify the client to send a message every 3 seconds and have the server echo it back.
4. **Bonus:** Add a second client and implement a simple broadcast — every message sent by one client is forwarded to all others.
