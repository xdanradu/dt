const input = "TOBEORNOTTOBEORTOBEORNOT";

function lzwEncode(text) {
  const dict = new Map();
  for (let i = 0; i < 256; i++) {
    dict.set(String.fromCharCode(i), i);
  }

  let nextCode = 256;
  let w = "";
  const output = [];

  for (const ch of text) {
    const wc = w + ch;
    if (dict.has(wc)) {
      w = wc;
    } else {
      output.push(dict.get(w));
      dict.set(wc, nextCode++);
      w = ch;
    }
  }

  if (w !== "") {
    output.push(dict.get(w));
  }

  return { codes: output, dictSize: nextCode };
}

function lzwDecode(codes) {
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
      entry = w + w[0];
    } else {
      throw new Error("Invalid LZW code stream");
    }

    result += entry;
    dict[nextCode++] = w + entry[0];
    w = entry;
  }

  return { text: result, dictSize: nextCode };
}

const encoded = lzwEncode(input);
const decoded = lzwDecode(encoded.codes);

const originalBits = input.length * 8;
const codeWidth = 12;
const encodedBits = encoded.codes.length * codeWidth;

console.log("Input:", input);
console.log("LZW codes:", encoded.codes);
console.log("Round-trip equal:", decoded.text === input);
console.log("Dictionary size after encode:", encoded.dictSize);
console.log("Original bits:", originalBits);
console.log("Encoded bits (12-bit code model):", encodedBits);
console.log("Compression ratio:", (originalBits / encodedBits).toFixed(3));
