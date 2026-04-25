const http = require("http");
const zlib = require("zlib");

const algorithms = ["identity", "gzip", "deflate", "br"];

function requestAlgo(algo) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:9090/book?algo=${algo}`, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const transmitted = Buffer.concat(chunks);
        const encoding = (res.headers["content-encoding"] || "identity").toLowerCase();
        const originalBytes = Number(res.headers["x-original-bytes"] || 0);

        try {
          const decoded = decodeBody(transmitted, encoding);
          resolve({
            algo,
            encoding,
            transmittedBytes: transmitted.length,
            decodedBytes: decoded.length,
            originalBytes,
            ok: decoded.length === originalBytes,
          });
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on("error", reject);
  });
}

function decodeBody(buffer, encoding) {
  if (encoding === "gzip") return zlib.gunzipSync(buffer);
  if (encoding === "deflate") return zlib.inflateSync(buffer);
  if (encoding === "br") return zlib.brotliDecompressSync(buffer);
  return buffer;
}

(async function run() {
  for (const algo of algorithms) {
    const result = await requestAlgo(algo);
    const ratio = result.originalBytes / result.transmittedBytes;
    console.log("---", algo, "---");
    console.log("content-encoding:", result.encoding);
    console.log("transmitted bytes:", result.transmittedBytes);
    console.log("decoded bytes:", result.decodedBytes);
    console.log("original bytes:", result.originalBytes);
    console.log("compression ratio:", ratio.toFixed(3));
    console.log("decode validation:", result.ok);
  }
})().catch((err) => {
  console.error("Client error:", err.message);
  process.exit(1);
});
