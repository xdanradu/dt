const http = require("http");
const zlib = require("zlib");

const PORT = 8080;

function makePayload() {
  // Repetitive JSON makes compression effects easy to observe.
  const rows = [];
  for (let i = 0; i < 2500; i++) {
    rows.push({
      id: i + 1,
      sensor: "temp-east-1",
      status: "ok",
      message: "repeated data block for compression demo",
      timestamp: 1700000000 + i,
    });
  }
  return Buffer.from(JSON.stringify({ source: "lab-4", rows }));
}

function sendCompressed(res, payload, encoding) {
  // Compress according to negotiated algorithm, then set Content-Encoding.
  if (encoding === "br") {
    zlib.brotliCompress(payload, (err, compressed) => {
      if (err) return sendError(res, err);
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "br",
        "Content-Length": compressed.length,
      });
      res.end(compressed);
    });
    return;
  }

  if (encoding === "gzip") {
    zlib.gzip(payload, (err, compressed) => {
      if (err) return sendError(res, err);
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
        "Content-Length": compressed.length,
      });
      res.end(compressed);
    });
    return;
  }

  if (encoding === "deflate") {
    zlib.deflate(payload, (err, compressed) => {
      if (err) return sendError(res, err);
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "deflate",
        "Content-Length": compressed.length,
      });
      res.end(compressed);
    });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Content-Length": payload.length,
  });
  // identity means no compression.
  res.end(payload);
}

function sendError(res, err) {
  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end("Compression error: " + err.message);
}

function negotiateEncoding(header) {
  // Simple priority order for classroom clarity.
  const value = (header || "").toLowerCase();
  if (value.includes("br")) return "br";
  if (value.includes("gzip")) return "gzip";
  if (value.includes("deflate")) return "deflate";
  return "identity";
}

const server = http.createServer((req, res) => {
  // Lightweight health endpoint for quick checks.
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  // Keep the demo focused on one data endpoint.
  if (req.url !== "/data") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Use /data or /health");
    return;
  }

  const payload = makePayload();
  // Read client capability from Accept-Encoding.
  const encoding = negotiateEncoding(req.headers["accept-encoding"]);

  console.log(
    "Request Accept-Encoding:",
    req.headers["accept-encoding"] || "<none>",
    "-> using",
    encoding,
    "(raw bytes:",
    payload.length + ")"
  );

  sendCompressed(res, payload, encoding);
});

server.listen(PORT, () => {
  console.log("Compression demo server running on http://localhost:" + PORT);
  console.log("Try: curl -i -H \"Accept-Encoding: br\" http://localhost:8080/data");
});
