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

## What Do The LZW Codes Mean?

For this sample input:

ABABABABABABABABABABABABABABABAB

the encoder outputs:

```txt
[65, 66, 256, 258, 257, 260, 259, 262, 261, 264, 256]
```

How to read that:

1. `65` = `A` and `66` = `B` are the first single-character outputs.
2. As scanning continues, the encoder learns new phrases and gives them new codes starting at 256.
3. In this run, the first learned phrases are:
   - `256 -> AB`
   - `257 -> BA`
   - `258 -> ABA`
   - `259 -> ABAB`
   - `260 -> BAB`
4. So later codes like `256`, `258`, `260`, and `264` refer to multi-character phrases instead of single letters.

This is where compression comes from: one code can represent a longer phrase once it is in the dictionary.

## Run

```bash
node lzw.js
```

## Exercises

1. Compare compression on repetitive vs non-repetitive text.
2. Print dictionary growth over time and analyze memory cost.
3. Limit dictionary size and observe behavior after saturation.
