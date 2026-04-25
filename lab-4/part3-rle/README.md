# Part 3: Run-Length Encoding (RLE)

## Objective

Compress repeated symbols using count-value runs, then decode to verify lossless reconstruction.

## Concepts

- Run detection in linear time
- Trade-off: great for repetitive data, weak for high-entropy data
- Lossless round-trip validation

## How This Implementation Works

1. Scans input left-to-right and groups consecutive identical symbols into runs.
2. Stores each run as `{ symbol, count }`.
3. Flushes the final run after the loop.
4. Decodes by repeating each symbol `count` times and concatenating.
5. Uses a teaching size model of 1 byte for symbol + 1 byte for count per run.

## What Is a "Run"?

A run is one consecutive block of the same symbol.

Example input:

AAAAABBBBBBBBBCCCCCCDDDDDDDDDDDDDAAAAAA

Run breakdown:

1. `A` repeated 5 times
2. `B` repeated 9 times
3. `C` repeated 6 times
4. `D` repeated 13 times
5. `A` repeated 6 times

Encoded as:

```js
[
	{ symbol: "A", count: 5 },
	{ symbol: "B", count: 9 },
	{ symbol: "C", count: 6 },
	{ symbol: "D", count: 13 },
	{ symbol: "A", count: 6 }
]
```

Why there are two `A` runs: RLE only groups adjacent (consecutive) symbols. Once the symbol changes, a new run starts.

## Run

```bash
node rle.js
```

## Exercises

1. Test with highly repetitive text and note compression ratio.
2. Test with random-looking text and observe expansion.
3. Add support for run counts above 255 using multi-byte counts.
