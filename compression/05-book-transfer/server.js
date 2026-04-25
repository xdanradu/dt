const fs = require("fs");
const path = require("path");
const http = require("http");
const zlib = require("zlib");

const PORT = 9090;
const bookPath = path.join(__dirname, "book.txt");
const bookBuffer = fs.readFileSync(bookPath);

function respondCompressed(res, encoding, payload) {
  if (encoding === "gzip") {
    return zlib.gzip(payload, (err, data) => finish(res, err, data, "gzip", payload.length));
  }
  if (encoding === "deflate") {
    return zlib.deflate(payload, (err, data) => finish(res, err, data, "deflate", payload.length));
  }
  if (encoding === "br") {
    return zlib.brotliCompress(payload, (err, data) => finish(res, err, data, "br", payload.length));
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Original-Bytes": payload.length,
    "Content-Length": payload.length,
  });
  res.end(payload);
}

function finish(res, err, data, encoding, originalBytes) {
  if (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Compression failed: " + err.message);
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Encoding": encoding,
    "X-Original-Bytes": originalBytes,
    "Content-Length": data.length,
  });
  res.end(data);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname !== "/book") {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Use /book?algo=identity|gzip|deflate|br");
    return;
  }

  const algo = (url.searchParams.get("algo") || "identity").toLowerCase();
  const allowed = new Set(["identity", "gzip", "deflate", "br"]);
  const selected = allowed.has(algo) ? algo : "identity";

  console.log("Request algo:", selected);
  respondCompressed(res, selected, bookBuffer);
});

server.listen(PORT, () => {
  console.log("Book transfer server running at http://localhost:" + PORT);
  console.log("Try /book?algo=identity|gzip|deflate|br");
});
