const symbolToCode = {
  // Simple fixed-length codebook (2 bits/symbol).
  A: "00",
  B: "01",
  N: "10",
  _: "11",
};

const text = "BNBABNAB_ABNABNABNABNABNAB_NABNABNABNABNABNABNABNABNA_BNABNABNABNABNABNABNA";

function encodeToBitString(input, table) {
  // Convert each symbol to its codeword and concatenate.
  return input
    .split("")
    .map((ch) => table[ch])
    .join("");
}

function setBit(buffer, byteIndex, bitIndex, value) {
  // Write one bit at the chosen position in a byte.
  if (value === 1) {
    buffer[byteIndex] |= 1 << bitIndex;
  } else {
    buffer[byteIndex] &= ~(1 << bitIndex);
  }
}

function getBit(buffer, byteIndex, bitIndex) {
  // Read one bit from a byte.
  return (buffer[byteIndex] >> bitIndex) & 1;
}

function packBits(bitString) {
  // Allocate just enough bytes to hold all bits.
  const byteLength = Math.ceil(bitString.length / 8);
  const out = new Uint8Array(byteLength);

  for (let i = 0; i < bitString.length; i++) {
    // '1' has ASCII code 49; everything else here is treated as 0.
    const bitValue = bitString.charCodeAt(i) === 49 ? 1 : 0;
    const byteIndex = Math.floor(i / 8);
    const bitIndex = i % 8;
    setBit(out, byteIndex, bitIndex, bitValue);
  }

  return out;
}

function unpackBits(packed, bitCount) {
  // Rebuild the exact bit stream from packed bytes.
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
