# Client-Server Architecture — Demo Collection

A set of 17 interactive demos for teaching client-server concepts, from basic Vue.js reactivity to authentication flows. Each demo is self-contained with its own server, HTML frontend, and separated CSS/JS files.

**Stack:** Node.js, Express, Socket.io, Vue.js 2 (CDN)

---

## Setup

```
cd demo/client-server
install.bat          # installs npm dependencies for all demos
npm run demo2        # start any demo by number (e.g., demo2, demo7, demo15)
```

---

## Demo Overview

| # | Demo | Port | Concept |
|---|------|------|---------|
| 01 | [Vue.js Reactivity](#demo-01--vue-js-reactivity) | — | Reactive data binding, no server needed |
| 02 | [HTTP Server](#demo-02--http-client-server) | 3000 | REST API, request/response cycle, CRUD |
| 03 | [WebSocket Chat](#demo-03--websocket-chat) | 4000 | Persistent connections, server push, real-time |
| 04 | [HTTP vs WebSocket](#demo-04--http-vs-websocket-comparison) | 5000 | Side-by-side polling vs push comparison |
| 05 | [Terminal / curl](#demo-05--terminal-exercises) | — | CLI as HTTP client, debugging network errors |
| 06 | [Request Inspector](#demo-06--request-inspector) | 3001 | Raw HTTP headers the browser sends automatically |
| 07 | [Status Codes](#demo-07--status-codes) | 3002 | HTTP status code categories and meanings |
| 08 | [File Upload](#demo-08--file-upload) | 3003 | Multipart/form-data encoding, MIME types |
| 09 | [Mouse Tracker](#demo-09--mouse-tracker) | 3004 | Real-time cursor sharing via WebSocket |
| 10 | [Whiteboard](#demo-10--shared-whiteboard) | 3005 | Collaborative drawing, stroke persistence |
| 11 | [Live Voting](#demo-11--live-voting) | 3006 | Real-time poll with animated bar chart |
| 12 | [Latency Simulator](#demo-12--latency-simulator) | 3007 | Artificial delay, round-trip time measurement |
| 13 | [DNS Lookup](#demo-13--dns-lookup) | 3008 | Domain resolution (A, AAAA, MX, NS, TXT, CNAME) |
| 14 | [Port Scanner](#demo-14--port-scanner) | 3009 | TCP port scanning on localhost, service discovery |
| 15 | [SSE Stream](#demo-15--server-sent-events) | 3010 | Server-Sent Events, one-way push, live monitoring |
| 16 | [Rate Limiter](#demo-16--rate-limiter) | 3011 | Request throttling, 429 status, rate-limit headers |
| 17 | [Auth Flow](#demo-17--authentication-flow) | 3012 | Login, cookies, sessions, role-based authorization |

---

## Demos by Category

### Foundations (Demos 1–5)

#### Demo 01 — Vue.js Reactivity
**No server needed** — just open `01-vue-basics/index.html`

Demonstrates reactive data binding: type in an input and watch text, reversed text, uppercase, and character count update live. Typing `123` triggers a secret animation. Introduces the idea that UI updates come from data changes, not DOM manipulation.

#### Demo 02 — HTTP Client-Server
```
cd 02-http-server && node server.js
```
Open `http://localhost:3000`
A REST API for managing users. Students see GET/POST/DELETE requests in a live log panel with response times. Includes a "slow request" button (2-second server delay) to discuss async behavior. Every request also appears in the terminal.

**Takeaway:** HTTP = client asks, server answers, connection closes. Each action is a separate request.

#### Demo 03 — WebSocket Chat
```
cd 03-websocket-chat && node server.js
```
Open `http://localhost:4000` in **two browsers** (Chrome + Firefox)
Open in two browsers. Both get auto-assigned names and colors. Messages appear instantly across browsers, with a typing indicator. Name changes and disconnections broadcast system messages.

**Takeaway:** WebSocket = persistent connection. Server pushes to all clients without being asked.

#### Demo 04 — HTTP vs WebSocket Comparison
```
cd 04-http-vs-websocket && node server.js
```
Open `http://localhost:5000`
Side-by-side shared counter. The WebSocket side updates instantly; the HTTP side polls and lags behind. Stats track request count, bytes transferred, and update delay to make the difference concrete.

**Takeaway:** Polling wastes bandwidth and is always late. WebSocket is real-time.

#### Demo 05 — Terminal Exercises
Uses Demo 02's server. Students run `curl` commands to show that the browser is just one possible client. Includes "break it" exercises: stop the server (ECONNREFUSED), wrong port, wrong HTTP method, bad JSON.

---

### HTTP Deep Dives (Demos 6–8)

#### Demo 06 — Request Inspector
```
cd 06-request-inspector && node server.js
```
Open `http://localhost:3001`
Shows the raw HTTP headers the browser sends automatically with every request: User-Agent, Accept-Language, Accept-Encoding, etc. Students discover how much metadata travels with each request.

#### Demo 07 — Status Codes
```
cd 07-status-codes && node server.js
```
Open `http://localhost:3002`
Enter any HTTP status code (100–599) and see its description and category (Informational, Success, Redirection, Client Error, Server Error). Quick-access buttons for the most common codes.

#### Demo 08 — File Upload
```
cd 08-file-upload && node server.js
```
Open `http://localhost:3003`
Upload a file and see the multipart/form-data encoding, MIME type detection, file size, and a hex dump of the first bytes. Shows what actually happens when a browser uploads a file.

---

### Real-Time Applications (Demos 9–11)

#### Demo 09 — Mouse Tracker
```
cd 09-mouse-tracker && node server.js
```
Open `http://localhost:3004`
All connected users see each other's colored cursor dots moving across the page in real-time. Coordinates are sent as percentages for resolution independence. Open multiple tabs to see the effect.

#### Demo 10 — Shared Whiteboard
```
cd 10-whiteboard && node server.js
```
Open `http://localhost:3005`
Collaborative canvas drawing via WebSocket. Strokes are stored server-side so late joiners see the full drawing. Each user gets a unique color. Includes brush size control and clear all.

#### Demo 11 — Live Voting
```
cd 11-live-voting && node server.js
```
Open `http://localhost:3006`
Real-time poll with animated bar chart. Students vote and see results update instantly across all browsers. Tracks votes per socket ID (allows changing vote, prevents double voting).

---

### Network Concepts (Demos 12–14)

#### Demo 12 — Latency Simulator
```
cd 12-latency-simulator && node server.js
```
Open `http://localhost:3007`
Slider adds artificial server delay (0–3000ms). Real-world presets show typical latencies: localhost (0ms), same city (5ms), EU↔US (100ms), satellite (600ms), Mars (3000ms). Measures actual round-trip time.

#### Demo 13 — DNS Lookup
```
cd 13-dns-lookup && node server.js
```
Open `http://localhost:3008`
Resolves domain names and displays A, AAAA, MX, NS, TXT, and CNAME records. Preset domains include google.com, github.com, and utcluj.ro. Uses Node.js built-in `dns.promises` module.

#### Demo 14 — Port Scanner
```
cd 14-port-scanner && node server.js
```
Open `http://localhost:3009`
Scans common ports on localhost (21, 22, 80, 443, 3000, 3306, 8080, etc.) and shows which services are listening. Start other demos first, then re-scan to see their ports appear as open.

---

### Advanced Patterns (Demos 15–17)

#### Demo 15 — Server-Sent Events
```
cd 15-sse-stream && node server.js
```
Open `http://localhost:3010`
Three live SSE streams: server clock (1s), CPU/memory stats (3s), and simulated log entries (random interval). Demonstrates the middle ground between HTTP and WebSocket — server push without full duplex. Uses the browser's `EventSource` API with automatic reconnection.

#### Demo 16 — Rate Limiter
```
cd 16-rate-limiter && node server.js
```
Open `http://localhost:3011`
Students spam a button until the server returns `429 Too Many Requests`. Configurable limit and time window. Shows standard `X-RateLimit-Remaining` and `Retry-After` headers. Includes a "Spam 8x" button to intentionally trigger blocking.

#### Demo 17 — Authentication Flow
```
cd 17-auth-flow && node server.js
```
Open `http://localhost:3012`
Login form with three accounts (admin/student/guest). Server creates a session, sets an httpOnly cookie, and the browser sends it automatically on future requests. Test protected endpoints (401 Unauthorized) and admin-only endpoints (403 Forbidden). Shows the difference between authentication ("who are you?") and authorization ("what can you do?").

**Accounts:** `admin`/`admin123`, `student`/`student123`, `guest`/`guest`

---

## Key Concepts Summary

| | HTTP | WebSocket | SSE |
|---|---|---|---|
| Direction | Client → Server | Bidirectional | Server → Client |
| Connection | New per request | Persistent | Persistent |
| Use case | CRUD, file upload | Chat, live collaboration | Dashboards, notifications |
| Overhead | Headers every request | Minimal after handshake | Minimal, plain HTTP |
| Browser API | `fetch()` / `XMLHttpRequest` | `WebSocket` | `EventSource` |

---

## File Structure

Each demo follows the same layout:
```
NN-demo-name/
├── package.json       # dependencies
├── server.js          # Express server with technical comments
└── public/
    ├── index.html     # Vue.js template
    ├── style.css      # separated styles
    └── app.js         # separated Vue logic
```

Demo 01 has no server (static HTML). Demo 05 is a README with curl commands.
