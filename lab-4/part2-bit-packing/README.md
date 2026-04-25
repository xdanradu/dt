# Part 2: Bit Packing and Unpacking

## Objective

Convert logical bit codes into actual bytes for transmission and reconstruct them on the receiver side.

## Concepts

- Bitwise operators: `<<`, `>>`, `|`, `&`
- Writing bits into `Uint8Array`
- Reconstructing bit strings from packed bytes

## Run

```bash
node bit-pack.js
```

## Exercises

1. Replace the symbol-to-code mapping with your own mapping.
2. Increase the payload length and observe packed byte count.
3. Verify that unpacking returns the exact original bit stream.
