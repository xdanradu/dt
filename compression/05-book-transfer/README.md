# 05 Book Transfer Client-Server

A minimal HTTP client-server app that sends book text content with selectable compression.

Algorithms supported:

- identity (no compression)
- gzip
- deflate
- br (Brotli)

## Run

Terminal 1:

```bash
node server.js
```

Terminal 2:

```bash
node client.js
```

The client requests all algorithms and prints:

- transmitted bytes
- decoded byte length
- compression ratio
- decode validation result
