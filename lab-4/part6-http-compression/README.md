# Part 6: HTTP Compression with Gzip and Brotli

## Objective

Apply compression to actual transmission using HTTP content negotiation and Node's built-in `zlib`.

## Concepts

- `Accept-Encoding` negotiation
- `Content-Encoding` response header
- Real transfer-size impact for JSON payloads

## How This Implementation Works

1. Builds a repetitive JSON payload so compression differences are visible.
2. Reads `Accept-Encoding` and selects `br`, `gzip`, `deflate`, or `identity`.
3. Compresses response bytes using Node `zlib` when an algorithm is selected.
4. Sets `Content-Encoding` so clients decode correctly.
5. Includes `/health` and `/data` endpoints to keep testing simple.

## Run

```bash
node server.js
```

Server URL: `http://localhost:8080/data`

## Test

```bash
curl -i http://localhost:8080/data
curl -i "http://localhost:8080/data?pretty=1"
curl -i -H "Accept-Encoding: gzip" http://localhost:8080/data
curl -i -H "Accept-Encoding: br" http://localhost:8080/data
curl -i -H "Accept-Encoding: deflate" http://localhost:8080/data
```

Brief example:

- Compact JSON (default): `/data`
- Pretty JSON (indented): `/data?pretty=1` (also accepts `pretty=true`)

## Exercises

1. Compare response headers and observe `Content-Encoding` changes.
2. Increase payload size and compare transfer times under throttling.
3. Add a query parameter to switch between compact and pretty JSON.
