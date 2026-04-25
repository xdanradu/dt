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

1. Compare repetitive vs non-repetitive input.
   1. In `lzw.js`, set `input` to a repetitive string like `ABABABABABABABABABABABABABABABAB` and run `node lzw.js`.
   2. Note `Original bits`, `Encoded bits`, and `Compression rate`.
   3. Change `input` to a less repetitive string like `Q7m$2pL!x9T@vR3#K8zW1nB4cD6fH0` and run again.
   4. Compare results and explain why repetitive input usually compresses better.

2. Track dictionary growth.
   1. Add a log inside `lzwEncode` right after `dict.set(wc, nextCode++)`.
   2. Print the new phrase and dictionary size after each insert.
   3. Run `node lzw.js` and observe how quickly new phrases are created.
   4. Summarize when growth is fast and when it slows down.

   Optional snippet:

   ```js
   // Place inside lzwEncode, in the branch where a new phrase is added.
   dict.set(wc, nextCode++);
   console.log("added phrase:", wc, "| dict size:", nextCode);
   ```

3. Test dictionary size limits.
   1. Add a `MAX_DICT_SIZE` constant (example: `512`) in `lzwEncode` and `lzwDecode`.
   2. Only add new entries when `nextCode < MAX_DICT_SIZE`.
   3. Run with longer input and compare output size before and after the limit.
   4. Describe how saturation affects compression effectiveness.

   Optional snippet:

   ```js
   const MAX_DICT_SIZE = 512;

   // In lzwEncode, replace direct insert with:
   if (nextCode < MAX_DICT_SIZE) {
     dict.set(wc, nextCode++);
   }

   // In lzwDecode, replace direct insert with:
   if (nextCode < MAX_DICT_SIZE) {
     dict[nextCode++] = w + entry[0];
   }
   ```
