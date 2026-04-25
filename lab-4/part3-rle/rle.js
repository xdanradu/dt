const input = "AAAAABBBBBBBBBCCCCCCDDDDDDDDDDDDDAAAAAA";

function rleEncode(text) {
  if (text.length === 0) return [];

  // Output format: [{ symbol, count }, ...]
  const runs = [];
  let current = text[0];
  let count = 1;

  for (let i = 1; i < text.length; i++) {
    // Continue the current run while symbol stays the same.
    if (text[i] === current && count < 255) {
      count++;
    } else {
      // Run ended: store it and start a new run.
      runs.push({ symbol: current, count });
      current = text[i];
      count = 1;
    }
  }

  // Flush the final run.
  runs.push({ symbol: current, count });
  return runs;
}

function rleDecode(runs) {
  // Expand each run back to plain text.
  let out = "";
  for (const run of runs) {
    out += run.symbol.repeat(run.count);
  }
  return out;
}

const encoded = rleEncode(input);
const decoded = rleDecode(encoded);

const originalBits = input.length * 8;
// Teaching model: each run stores 1 byte symbol + 1 byte count.
const encodedBits = encoded.length * (8 + 8);
const compressionRate = ((originalBits - encodedBits) / originalBits) * 100;

console.log("Input:", input);
console.log("Runs:", encoded);
console.log("Decoded equals input:", decoded === input);
console.log("Original bits:", originalBits);
console.log("RLE model bits (8-bit symbol + 8-bit count):", encodedBits);
console.log(
  "Compression rate (%):",
  `${compressionRate.toFixed(2)}%`
);
