# Compression Simple Apps Collection

A set of simple apps for teaching core compression ideas with minimal code.

## Setup

```bash
cd compression
npm install
```

No external dependencies are required. All apps use Node.js built-in modules only.

## App Overview

| # | App | Folder | Concept |
|---|-----|--------|---------|
| 01 | Entropy Playground | `01-entropy-playground/` | Symbol frequency and Shannon entropy |
| 02 | RLE Basics | `02-rle-basics/` | Run-Length Encoding and round-trip decode |
| 03 | LZW Basics | `03-lzw-basics/` | Dictionary-based lossless compression |
| 04 | Huffman Basics | `04-huffman-basics/` | Variable-length prefix coding |
| 05 | Book Transfer Client-Server | `05-book-transfer/` | Send text with identity/gzip/deflate/brotli |
| 06 | Image Compression Demo | `06-image-compression/` | Quantization + RLE on grayscale image data |

## Run

```bash
npm run app1
npm run app2
npm run app3
npm run app4
npm run app5-server
npm run app5-client
npm run app6
```

## Learning Path

1. Start with `app1` to understand when compression is possible.
2. Run `app2` for the simplest repeated-pattern algorithm.
3. Run `app3` and `app4` for dictionary and statistical coding.
4. Run `app5` to see compression in real transmission.
5. Run `app6` to see image-specific tradeoffs in practice.
