// framing.js — Part 1: Framing & Checksums
// Demonstrates how to wrap data in a frame with start/end delimiters and
// a simple XOR checksum for integrity verification.

const SOF = 0x02; // Start of Frame
const EOF = 0x03; // End of Frame

/**
 * Creates a framed packet from a plain-text string.
 * Frame layout: [SOF] [Payload] [Checksum] [EOF]
 */
function createFrame(dataString) {
    const payload = Buffer.from(dataString);
    // XOR checksum: fold every byte together with ^.
    // Example for "Hi" (0x48, 0x69):
    //   acc starts at 0  → 0x00 ^ 0x48 = 0x48
    //                     → 0x48 ^ 0x69 = 0x21  ← final checksum
    // If any single byte changes in transit, the recomputed value won't match.
    const checksum = payload.reduce((acc, val) => acc ^ val, 0);

    const frame = Buffer.concat([
        Buffer.from([SOF]),
        payload,
        Buffer.from([checksum]),
        Buffer.from([EOF])
    ]);

    console.log("Transmitting Frame:", frame);
    console.log("  Hex:", frame.toString("hex"));
    console.log("  Frame size:", frame.length * 8, "bits (" + frame.length + " bytes)");
    return frame;
}

/**
 * Verifies the integrity of a received frame by recalculating the checksum.
 */
function verifyFrame(frame) {
    if (frame[0] !== SOF || frame[frame.length - 1] !== EOF) {
        console.error("❌ Invalid frame delimiters!");
        return false;
    }

    const payload = frame.subarray(1, frame.length - 2);
    const receivedChecksum = frame[frame.length - 2];
    const calculatedChecksum = payload.reduce((acc, val) => acc ^ val, 0);

    if (calculatedChecksum === receivedChecksum) {
        console.log("✅ Integrity Verified:", payload.toString());
        return true;
    } else {
        console.error(
            "❌ Data Corrupted! Expected checksum",
            calculatedChecksum,
            "but received",
            receivedChecksum
        );
        return false;
    }
}

// --- Demo ---
console.log("=== Creating and verifying a valid frame ===");
const myFrame = createFrame("Hello Network");
verifyFrame(myFrame);

console.log("\n=== Simulating corruption ===");
const corruptFrame = Buffer.from(myFrame); // copy
corruptFrame[3] = 0xff; // corrupt one payload byte
verifyFrame(corruptFrame);
