const symbolToCode = {
  A: "00",
  B: "01",
  N: "10",
  _: "11",
};

const text = "BANANA_BANDANA";

function encodeToBitString(input, table) {
  return input
    .split("")
    .map((ch) => table[ch])
    .join("");
}

function setBit(buffer, byteIndex, bitIndex, value) {
  if (value === 1) {
    buffer[byteIndex] |= 1 << bitIndex;
  } else {
    buffer[byteIndex] &= ~(1 << bitIndex);
  }
}

function getBit(buffer, byteIndex, bitIndex) {
  return (buffer[byteIndex] >> bitIndex) & 1;
}

function packBits(bitString) {
  const byteLength = Math.ceil(bitString.length / 8);
  const out = new Uint8Array(byteLength);

  for (let i = 0; i < bitString.length; i++) {
    const bitValue = bitString.charCodeAt(i) === 49 ? 1 : 0;
    const byteIndex = Math.floor(i / 8);
    const bitIndex = i % 8;
    setBit(out, byteIndex, bitIndex, bitValue);
  }

  return out;
}

function unpackBits(packed, bitCount) {
  let out = "";
  for (let i = 0; i < bitCount; i++) {
    const byteIndex = Math.floor(i / 8);
    const bitIndex = i % 8;
    out += String(getBit(packed, byteIndex, bitIndex));
  }
  return out;
}

const bitString = encodeToBitString(text, symbolToCode);
const packed = packBits(bitString);
const unpacked = unpackBits(packed, bitString.length);

console.log("Input text:", text);
console.log("Bit string:", bitString);
console.log("Bit length:", bitString.length);
console.log("Packed bytes:", packed.length, "->", Buffer.from(packed).toString("hex"));
console.log("Round-trip equal:", unpacked === bitString);
