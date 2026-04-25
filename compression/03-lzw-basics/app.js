const input = "TOBEORNOTTOBEORTOBEORNOT";

function lzwEncode(text) {
  const dict = new Map();
  for (let i = 0; i < 256; i++) dict.set(String.fromCharCode(i), i);

  let nextCode = 256;
  let w = "";
  const out = [];

  for (const ch of text) {
    const wc = w + ch;
    if (dict.has(wc)) {
      w = wc;
    } else {
      out.push(dict.get(w));
      dict.set(wc, nextCode++);
      w = ch;
    }
  }
  if (w) out.push(dict.get(w));

  return { codes: out, dictSize: nextCode };
}

function lzwDecode(codes) {
  const dict = [];
  for (let i = 0; i < 256; i++) dict[i] = String.fromCharCode(i);

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
      throw new Error("Invalid LZW stream");
    }

    result += entry;
    dict[nextCode++] = w + entry[0];
    w = entry;
  }

  return result;
}

const encoded = lzwEncode(input);
const decoded = lzwDecode(encoded.codes);

console.log("Input:", input);
console.log("Codes:", encoded.codes);
console.log("Dictionary size:", encoded.dictSize);
console.log("Decoded equals input:", decoded === input);
