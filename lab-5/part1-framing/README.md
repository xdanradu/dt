# Part 1: The Data Link Layer — Framing & Checksums

## Objective

Before sending data over a network, we must **frame** it so the receiver knows where a message starts and ends. Think of a frame like an envelope around a letter: the envelope tells you where the letter begins, where it ends, and includes a seal to prove it hasn't been tampered with.

In this exercise you will:

1. Build a binary frame around a text payload using `Buffer`.
2. Compute an XOR checksum over the payload.
3. Verify frame integrity on the receiving side.

## Key Concepts

| Term | Description |
|------|-------------|
| **SOF / EOF** | Start-of-Frame (`0x02`) and End-of-Frame (`0x03`) delimiter bytes. These are special ASCII control characters (STX and ETX) historically used to mark the boundaries of a transmitted text block. |
| **Payload** | The actual data being transmitted — in our case a UTF-8 encoded string such as `"Hello Network"`. |
| **XOR Checksum** | A simple error-detection value computed by XOR-ing every payload byte together. If any single byte changes in transit, the checksum will no longer match. |
| **Buffer** | Node.js object for manipulating raw binary data. Unlike regular strings, a `Buffer` lets you work with individual bytes directly. |

## Frame Format

```
[SOF 1 byte] [Payload N bytes] [Checksum 1 byte] [EOF 1 byte]
```

For the payload `"Hi"` (ASCII `0x48`, `0x69`), the XOR checksum is `0x48 ^ 0x69 = 0x21` and the full frame is:

```
 SOF   'H'   'i'  CHK   EOF
0x02  0x48  0x69  0x21  0x03
```

That's 5 bytes total: 1 (SOF) + 2 (payload) + 1 (checksum) + 1 (EOF).

## How the Code Works

### `createFrame(dataString)`

Wraps a plain-text string in a binary frame:

```js
function createFrame(dataString) {
    // 1. Convert the string to raw bytes
    const payload = Buffer.from(dataString);
    //    e.g. "Hi" → <Buffer 48 69>

    // 2. Compute the XOR checksum across every payload byte
    const checksum = payload.reduce((acc, val) => acc ^ val, 0);
    //    e.g. 0x00 ^ 0x48 = 0x48, then 0x48 ^ 0x69 = 0x21

    // 3. Concatenate: SOF + payload + checksum + EOF
    const frame = Buffer.concat([
        Buffer.from([SOF]),       // 0x02
        payload,                   // 48 69
        Buffer.from([checksum]),   // 21
        Buffer.from([EOF])         // 0x03
    ]);
    return frame;
    // Result: <Buffer 02 48 69 21 03>
}
```

### `verifyFrame(frame)`

Checks the received frame for integrity:

```js
function verifyFrame(frame) {
    // 1. Check the delimiters (first byte = SOF, last byte = EOF)
    if (frame[0] !== SOF || frame[frame.length - 1] !== EOF) { ... }

    // 2. Extract the payload (everything between SOF and [checksum, EOF])
    const payload = frame.subarray(1, frame.length - 2);

    // 3. Read the checksum that was sent (second-to-last byte)
    const receivedChecksum = frame[frame.length - 2];

    // 4. Recalculate the checksum over the received payload
    const calculatedChecksum = payload.reduce((acc, val) => acc ^ val, 0);

    // 5. Compare — if they match, the data is intact
    return calculatedChecksum === receivedChecksum;
}
```

### XOR Checksum — Step by Step

For the string `"Hello Network"`, the checksum is computed byte-by-byte:

```
H(48) ^ e(65) = 2D
  2D   ^ l(6C) = 41
  41   ^ l(6C) = 2D
  2D   ^ o(6F) = 42
  42   ^  (20) = 62
  62   ^ N(4E) = 2C
  2C   ^ e(65) = 49
  49   ^ t(74) = 3D
  3D   ^ w(77) = 4A
  4A   ^ o(6F) = 25
  25   ^ r(72) = 57
  57   ^ k(6B) = 3C
                → checksum = 0x3C
```

If even one payload byte is altered in transit, the recalculated checksum will differ from the stored one, and `verifyFrame()` will flag the corruption.

## Running

```bash
node framing.js
```

Expected output:

```
=== Creating and verifying a valid frame ===
Transmitting Frame: <Buffer 02 48 65 6c 6c 6f 20 4e 65 74 77 6f 72 6b 3c 03>
  Hex: 0248656c6c6f204e6574776f726b3c03
✅ Integrity Verified: Hello Network

=== Simulating corruption ===
❌ Data Corrupted! Expected checksum ... but received ...
```

## Exercises

1. **Run and observe** — Execute `node framing.js` and match each hex byte in the output to the frame format above. Identify the SOF, payload, checksum, and EOF bytes.
2. **Change the payload** — Replace `"Hello Network"` with your own string (e.g. `"TCP rocks"`). Re-run and verify that the checksum value changes.
3. **Challenge: Detect corruption** — The demo already corrupts byte index 3. Try corrupting a different index (e.g. `corruptFrame[7] = 0x00;`) and confirm `verifyFrame()` still catches it.
4. **Bonus** — Add a second corruption (`corruptFrame[5] = 0x00;`) on top of the first. Does the XOR checksum still detect it? Why or why not? *(Hint: XOR has a blind spot when an even number of bits flip in a way that cancels out.)*
