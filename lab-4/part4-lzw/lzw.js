const input = "TOBEORNOTTOBEORTOBEORNOT";

function lzwEncode(text) {
  // Initialize dictionary with all single-byte symbols.
  const dict = new Map();
  for (let i = 0; i < 256; i++) {
    dict.set(String.fromCharCode(i), i);
  }

  let nextCode = 256;
  // w is the current phrase candidate.
  let w = "";
  const output = [];

  for (const ch of text) {
    const wc = w + ch;
    if (dict.has(wc)) {
      // Keep extending while phrase already exists.
      w = wc;
    } else {
      // Emit known phrase code and learn the extended phrase.
      output.push(dict.get(w));
      dict.set(wc, nextCode++);
      w = ch;
    }
  }

  // Emit trailing phrase.
  if (w !== "") {
    output.push(dict.get(w));
  }

  return { codes: output, dictSize: nextCode };
}

function lzwDecode(codes) {
  // Decoder builds the same dictionary in the same order.
  const dict = [];
  for (let i = 0; i < 256; i++) {
    dict[i] = String.fromCharCode(i);
  }

  let nextCode = 256;
  let w = dict[codes[0]];
  let result = w;

  for (let i = 1; i < codes.length; i++) {
    const k = codes[i];
    let entry;

    if (dict[k] !== undefined) {
      entry = dict[k];
    } else if (k === nextCode) {
      // Special LZW edge case: code refers to phrase being created now.
      entry = w + w[0];
    } else {
      throw new Error("Invalid LZW code stream");
    }

    // Reconstruct output and learn next phrase.
    result += entry;
    dict[nextCode++] = w + entry[0];
    w = entry;
  }

  return { text: result, dictSize: nextCode };
}

const encoded = lzwEncode(input);
const decoded = lzwDecode(encoded.codes);

const originalBits = input.length * 8;
// Simplified fixed-width code model for easy comparison.
const codeWidth = 12;
const encodedBits = encoded.codes.length * codeWidth;

console.log("Input:", input);
console.log("LZW codes:", encoded.codes);
console.log("Round-trip equal:", decoded.text === input);
console.log("Dictionary size after encode:", encoded.dictSize);
console.log("Original bits:", originalBits);
console.log("Encoded bits (12-bit code model):", encodedBits);
console.log("Compression ratio:", (originalBits / encodedBits).toFixed(3));
