const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

function quantize(data, levels) {
  const step = 256 / levels;
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const bucket = Math.floor(data[i] / step);
    const q = Math.min(levels - 1, bucket);
    out[i] = Math.floor((q * 255) / (levels - 1));
  }
  return out;
}

function encodeRLE(bytes) {
  const out = [];
  let i = 0;
  while (i < bytes.length) {
    const value = bytes[i];
    let count = 1;
    while (i + count < bytes.length && bytes[i + count] === value && count < 255) {
      count++;
    }
    out.push(count, value);
    i += count;
  }
  return Uint8Array.from(out);
}

async function writeAvif(filePath, width, height, grayscaleBytes) {
  await sharp(Buffer.from(grayscaleBytes), {
    raw: { width, height, channels: 1 },
  })
    .avif({ quality: 60 })
    .toFile(filePath);
}

async function main() {
  const inputPath = path.join(__dirname, "forrest.avif");
  if (!fs.existsSync(inputPath)) {
    throw new Error("Missing input file: " + inputPath);
  }

  const decoded = await sharp(inputPath)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: original, info } = decoded;
  const quantized = quantize(original, 16);
  const rle = encodeRLE(quantized);

  const originalPath = path.join(__dirname, "original.avif");
  const quantizedPath = path.join(__dirname, "quantized.avif");

  await writeAvif(originalPath, info.width, info.height, original);
  await writeAvif(quantizedPath, info.width, info.height, quantized);

  const inputBytes = fs.statSync(inputPath).size;
  const originalAvifBytes = fs.statSync(originalPath).size;
  const quantizedAvifBytes = fs.statSync(quantizedPath).size;

  console.log("Input image:", inputPath);
  console.log("Dimensions:", info.width + "x" + info.height);
  console.log("Raw grayscale pixels:", original.length, "bytes");
  console.log("RLE over quantized raw data:", rle.length, "bytes");
  console.log("Input AVIF bytes:", inputBytes);
  console.log("Original grayscale AVIF bytes:", originalAvifBytes);
  console.log("Quantized grayscale AVIF bytes:", quantizedAvifBytes);
  console.log("Wrote:", originalPath);
  console.log("Wrote:", quantizedPath);
}

main().catch((err) => {
  console.error("Image compression demo failed:", err.message);
  process.exit(1);
});
