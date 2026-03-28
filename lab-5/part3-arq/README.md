# Part 3: Implementing Reliability — Stop-and-Wait ARQ

## Objective

UDP alone provides no delivery guarantee. In this exercise you will add reliability on top of UDP using the **Stop-and-Wait ARQ** protocol:

1. The **client** sends a numbered packet and waits for an ACK.
2. If no ACK arrives within a timeout, the client **retransmits**.
3. The **server** receives packets, verifies the sequence number, and replies with an ACK.

## Key Concepts

| Term | Description |
|------|-------------|
| **ARQ** | Automatic Repeat reQuest — retransmit on missing ACK |
| **Sequence number** | Integer that uniquely identifies each packet |
| **ACK** | Acknowledgement sent by the receiver for a successfully received packet |
| **Timeout** | Duration after which the sender assumes the packet was lost |
| **Stop-and-Wait** | Send one packet, wait for ACK, then send the next |

## Architecture

```
client  ──▶  proxy (port 4000)  ──▶  server (port 5000)
   ◀── ACK ──────────────────────────┘
```

> **Tip:** Reuse the Chaos Proxy from Part 2 (`part2-udp/proxy.js`) to introduce packet loss.

## Running

Open **three** terminals:

```bash
# Terminal 1 — start the server (receiver + ACK sender)
node server.js

# Terminal 2 — start the chaos proxy
node ../part2-udp/proxy.js

# Terminal 3 — start the reliable client
node client.js
```

## Exercises

1. Run all three and observe retransmissions when the proxy drops packets.
2. Increase the proxy drop rate to 50 % and note how many retransmissions occur.
3. **Challenge:** Change the timeout from 2 s to 500 ms and observe the difference.
4. **Bonus:** Extend the client to send multiple messages in sequence (e.g., an array of strings).
