# Part 4: Lempel-Ziv-Welch (LZW) Dictionary Compression

## Objective

Build a dynamic dictionary compressor (LZW) and verify end-to-end lossless decoding.

## Concepts

- Dictionary initialized with single-byte symbols
- New phrases added while scanning input
- Code stream transmission

## Run

```bash
node lzw.js
```

## Exercises

1. Compare compression on repetitive vs non-repetitive text.
2. Print dictionary growth over time and analyze memory cost.
3. Limit dictionary size and observe behavior after saturation.
