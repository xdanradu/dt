# Part 2: The Unreliable Network — UDP & Packet Loss

## Objective

Real networks are unreliable — packets get dropped, delayed, or corrupted. In this exercise you will:

1. Create a UDP **receiver** that listens for incoming datagrams.
2. Create a UDP **sender** that fires off messages.
3. Place a **Chaos Proxy** between them that randomly drops 30 % of packets.

## Key Concepts

| Term | Description |
|------|-------------|
| **UDP** | User Datagram Protocol — connectionless, no delivery guarantee |
| **dgram** | Node.js built-in module for UDP sockets |
| **Packet loss** | When a datagram never reaches its destination |
| **Chaos Proxy** | An intermediary that intentionally drops traffic for testing |

## Architecture

```
sender (port 3000)  ──▶  proxy (port 4000)  ──▶  receiver (port 5000)
                           🔥 30 % drop rate
```

## Running

Open **three** terminals:

```bash
# Terminal 1 — start the receiver
node receiver.js

# Terminal 2 — start the chaos proxy
node proxy.js

# Terminal 3 — send messages
node sender.js
```

## Exercises

1. Run all three scripts and observe which messages arrive and which are dropped.
2. Change the drop rate in `proxy.js` (e.g., 50 %) and compare results.
3. **Challenge:** Add a counter to `receiver.js` that reports how many packets were received out of the total sent.
