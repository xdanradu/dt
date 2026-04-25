const input = "AAAAABBBBBBBBBCCCCCCDDDDDDDDDDDDDAAAAAA";

function rleEncode(text) {
  if (text.length === 0) return [];

  const runs = [];
  let current = text[0];
  let count = 1;

  for (let i = 1; i < text.length; i++) {
    if (text[i] === current && count < 255) {
      count++;
    } else {
      runs.push({ symbol: current, count });
      current = text[i];
      count = 1;
    }
  }

  runs.push({ symbol: current, count });
  return runs;
}

function rleDecode(runs) {
  let out = "";
  for (const run of runs) {
    out += run.symbol.repeat(run.count);
  }
  return out;
}

const encoded = rleEncode(input);
const decoded = rleDecode(encoded);

const originalBits = input.length * 8;
const encodedBits = encoded.length * (8 + 8);

console.log("Input:", input);
console.log("Runs:", encoded);
console.log("Decoded equals input:", decoded === input);
console.log("Original bits:", originalBits);
console.log("RLE model bits (8-bit symbol + 8-bit count):", encodedBits);
console.log("Compression ratio:", (originalBits / encodedBits).toFixed(3));
