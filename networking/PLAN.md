# Client-Server Demo — Presentation Script

## Before Class
```
cd demo/client-server
install.bat
```

---

## Demo 1 — Vue.js Reactivity (5 min)
**File:** `01-vue-basics/index.html` — just double-click, no server needed.

1. Type in the input → text, reversed text, uppercase, char count all update live
2. Type `123` → special "secret code" animation triggers
3. Click "Save to history" → pills accumulate at the bottom
4. **Takeaway:** Vue binds JS variables to HTML. Change data → UI updates. No DOM manipulation.

---

## Demo 2 — HTTP Client-Server (10 min)
```
cd 02-http-server && node server.js
```
Open `http://localhost:3000`

1. Users list loads via GET → log appears in the right panel
2. Add a user → POST appears in log with response time
3. Delete a user → DELETE in log
4. Click "Test slow request" → watch the 2s delay, discuss async
5. Point at the **terminal** — every request is logged there too
6. **Takeaway:** HTTP = client asks, server answers, done. Each action = separate request.

---

## Demo 3 — WebSocket Chat (10 min)
```
cd 03-websocket-chat && node server.js
```
Open `http://localhost:4000` in **two browsers** (Chrome + Firefox)

1. Both get auto-assigned names and colors
2. Type in Chrome → message appears instantly in Firefox (and vice versa)
3. Show "X is typing..." indicator appearing in the other browser
4. Change your name → system message broadcasts to everyone
5. Close one tab → "User left" message appears
6. Watch the **terminal** — connection/disconnection/messages all logged
7. **Takeaway:** WebSocket = persistent connection. Server pushes to clients. No polling.

---

## Demo 4 — HTTP vs WebSocket Comparison (10 min) ⭐
```
cd 04-http-vs-websocket && node server.js
```
Open `http://localhost:5000`

This is the **key conceptual demo** — side-by-side visual comparison:

1. Click "Increment Counter" a few times → WebSocket number updates instantly
2. Click "Start polling" on the HTTP side → it catches up, but with delay
3. Point out the stats:
   - **HTTP:** many requests sent, ~200 bytes each, update delay 0-1000ms
   - **WS:** fewer messages, ~20 bytes each, update delay <5ms
4. Click Increment rapidly → WS side is instant, HTTP side lags behind
5. **Takeaway:** Polling wastes bandwidth and is always late. WebSocket is real-time.

---

## Demo 5 — Terminal / Break It (5 min)
See `05-terminal-demo/README.md` for the full script.

With Demo 2 server running:
1. Run `curl http://localhost:3000/api/users` → same data as browser
2. Add a user via curl → refresh browser, it's there
3. **Break it:** Stop the server (Ctrl+C) → click Add in browser → ECONNREFUSED
4. **Lesson:** The browser is just one possible client. The server must be alive.

---

## Summary Slide Points
| | HTTP | WebSocket |
|---|---|---|
| Direction | Client → Server only | Bidirectional |
| Connection | New connection per request | Persistent |
| Use case | CRUD (read/write data) | Real-time (chat, live data) |
| Overhead | Headers on every request | Minimal after handshake |
