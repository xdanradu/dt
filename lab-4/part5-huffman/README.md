# Part 5: Huffman Coding

## Objective

Create a prefix-code tree from symbol frequencies, encode data with variable-length codes, and decode it exactly.

## Concepts

- Frequency-based coding
- Binary tree merge process
- Prefix-free codes
- Entropy-aware compression

## How This Implementation Works

1. Builds a symbol frequency map from input text.
2. Creates leaf nodes and repeatedly merges the two least frequent nodes.
3. Traverses the final tree (`left = 0`, `right = 1`) to build prefix codes.
4. Encodes text by replacing each symbol with its Huffman code.
5. Decodes by traversing the tree bit-by-bit until reaching leaf symbols.

## Run

```bash
node huffman.js
```

## Exercises

1. Print the Huffman tree level-by-level.
2. Compare average code length to entropy from Part 1.
3. Add binary packing to convert encoded bit string into bytes.
