# Part 1: Symbol Frequency and Entropy

## Objective

Measure symbol frequencies and estimate entropy to understand the theoretical lower bound of compression.

## Concepts

- Frequency table for byte values (0-255)
- Probability distribution
- Shannon entropy $H(X) = -\sum p(x)\log_2 p(x)$
- Fixed-length baseline size vs entropy lower bound

## How This Implementation Works

1. Uses a fixed `Uint32Array(256)` counter for byte/ASCII symbols.
2. Converts non-zero counters into rows with count and probability.
3. Sorts rows by frequency so the dominant symbols are easy to inspect.
4. Computes entropy with $-\sum p(x)\log_2 p(x)$.
5. Compares a plain-text baseline (`8 * length` bits) with the entropy lower bound (`H(X) * length`).

## Run

```bash
node symbol-frequency.js
```

## Exercises

1. Change `sampleText` to a highly repetitive string and compare entropy.
2. Change `sampleText` to random-looking text and compare entropy.
3. Explain why lower entropy often means better compression potential.
