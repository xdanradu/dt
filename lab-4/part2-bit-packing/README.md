# Part 2: Bit Packing and Unpacking

## Objective

Convert logical bit codes into actual bytes for transmission and reconstruct them on the receiver side.

## Concepts

- Bitwise operators: `<<`, `>>`, `|`, `&`
- Writing bits into `Uint8Array`
- Reconstructing bit strings from packed bytes

## How This Implementation Works

1. Encodes each symbol using a small fixed-length codebook.
2. Concatenates codewords into one logical bit string.
3. Packs bits into a `Uint8Array` by computing byte index and bit index.
4. Reads bits back from packed bytes to rebuild the original bit string.
5. Verifies round-trip equality (`unpacked === bitString`).

## Run

```bash
node bit-pack.js
```

## Exercises

1. Replace the symbol-to-code mapping with your own mapping.
2. Increase the payload length and observe packed byte count.
3. Verify that unpacking returns the exact original bit stream.
