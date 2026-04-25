# Part 4: Lempel-Ziv-Welch (LZW) Dictionary Compression

## Objective

Build a dynamic dictionary compressor (LZW) and verify end-to-end lossless decoding.

## Concepts

- Dictionary initialized with single-byte symbols
- New phrases added while scanning input
- Code stream transmission

## How This Implementation Works

1. Starts with a dictionary containing all single-byte symbols (codes 0-255).
2. Extends the current phrase while it already exists in the dictionary.
3. Emits the current phrase code when the extended phrase is new.
4. Adds the new phrase to the dictionary and continues scanning.
5. Decoder mirrors dictionary growth and handles the LZW edge case `k === nextCode`.

## Run

```bash
node lzw.js
```

## Exercises

1. Compare compression on repetitive vs non-repetitive text.
2. Print dictionary growth over time and analyze memory cost.
3. Limit dictionary size and observe behavior after saturation.
