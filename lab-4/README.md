# Lab 4: Data Transmission Compression in JavaScript

Objective: build intuition for how text can be compressed before transmission, from basic symbol analysis to real HTTP compression.

This lab follows a part-based approach: each part is a small runnable application with its own README.

## Structure

| Part | Topic | Folder | Output |
|------|-------|--------|--------|
| 1 | Symbol frequency and entropy | `part1-symbol-frequency/` | Frequency table + entropy estimate |
| 2 | Bit packing and unpacking | `part2-bit-packing/` | Packed bytes from bit strings |
| 3 | Run-Length Encoding (RLE) | `part3-rle/` | RLE encode/decode and size ratio |
| 4 | LZW dictionary compression | `part4-lzw/` | LZW code stream + lossless round-trip |
| 5 | Huffman coding | `part5-huffman/` | Variable-length codes + decode check |
| 6 | HTTP gzip and Brotli | `part6-http-compression/` | Content negotiation on a Node server |

## Prerequisites

- Node.js v16+
- No external npm packages required

## How to Run

From `lab-4/`, run each example:

```bash
node part1-symbol-frequency/symbol-frequency.js
node part2-bit-packing/bit-pack.js
node part3-rle/rle.js
node part4-lzw/lzw.js
node part5-huffman/huffman.js
node part6-http-compression/server.js
```

For Part 6, open a second terminal and test:

```bash
curl -i -H "Accept-Encoding: gzip" http://localhost:8080/data
curl -i -H "Accept-Encoding: br" http://localhost:8080/data
curl -i http://localhost:8080/data
```

## Step-by-Step Learning Path

1. Start with Part 1 to understand why compression is possible.
2. Use Part 2 to see how codes become actual transmitted bytes.
3. Run Part 3 for repeated-pattern compression (RLE).
4. Run Part 4 for dictionary-based compression (LZW).
5. Run Part 5 for frequency-based optimal prefix coding (Huffman).
6. Finish with Part 6 to connect algorithms to real web transmission.

## Suggested Student Deliverables

1. Screenshot or logs of each part with input, output, and compression ratio.
2. Short comparison: where RLE, LZW, and Huffman perform best.
3. HTTP test evidence for identity vs gzip vs br in Part 6.
