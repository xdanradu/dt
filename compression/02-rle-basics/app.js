const input = "AAAAABBBBBBBBBCCCCCCDDDDDDDDDDDDD";

function encodeRLE(text) {
  if (!text) return [];
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

function decodeRLE(runs) {
  return runs.map((r) => r.symbol.repeat(r.count)).join("");
}

const encoded = encodeRLE(input);
const decoded = decodeRLE(encoded);

console.log("Input:", input);
console.log("Runs:", encoded);
console.log("Decoded equals input:", decoded === input);
console.log("Input bytes (UTF-8):", Buffer.byteLength(input));
console.log("RLE model bytes (symbol + count):", encoded.length * 2);
