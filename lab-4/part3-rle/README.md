# Part 3: Run-Length Encoding (RLE)

## Objective

Compress repeated symbols using count-value runs, then decode to verify lossless reconstruction.

## Concepts

- Run detection in linear time
- Trade-off: great for repetitive data, weak for high-entropy data
- Lossless round-trip validation

## Run

```bash
node rle.js
```

## Exercises

1. Test with highly repetitive text and note compression ratio.
2. Test with random-looking text and observe expansion.
3. Add support for run counts above 255 using multi-byte counts.
