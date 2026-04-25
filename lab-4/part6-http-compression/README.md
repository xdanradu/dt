# Part 6: HTTP Compression with Gzip and Brotli

## Objective

Apply compression to actual transmission using HTTP content negotiation and Node's built-in `zlib`.

## Concepts

- `Accept-Encoding` negotiation
- `Content-Encoding` response header
- Real transfer-size impact for JSON payloads

## Run

```bash
node server.js
```

Server URL: `http://localhost:8080/data`

## Test

```bash
curl -i http://localhost:8080/data
curl -i -H "Accept-Encoding: gzip" http://localhost:8080/data
curl -i -H "Accept-Encoding: br" http://localhost:8080/data
curl -i -H "Accept-Encoding: deflate" http://localhost:8080/data
```

## Exercises

1. Compare response headers and observe `Content-Encoding` changes.
2. Increase payload size and compare transfer times under throttling.
3. Add a query parameter to switch between compact and pretty JSON.
