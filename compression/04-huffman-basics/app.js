const input = "this is a huffman coding demo";

function frequencyMap(text) {
  const map = new Map();
  for (const ch of text) map.set(ch, (map.get(ch) || 0) + 1);
  return map;
}

function buildTree(freq) {
  const nodes = Array.from(freq.entries()).map(([ch, count]) => ({ ch, count, left: null, right: null }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.count - b.count);
    const left = nodes.shift();
    const right = nodes.shift();
    nodes.push({ ch: null, count: left.count + right.count, left, right });
  }

  return nodes[0];
}

function makeCodes(node, prefix = "", out = {}) {
  if (!node.left && !node.right) {
    out[node.ch] = prefix || "0";
    return out;
  }
  if (node.left) makeCodes(node.left, prefix + "0", out);
  if (node.right) makeCodes(node.right, prefix + "1", out);
  return out;
}

function encode(text, codes) {
  return text
    .split("")
    .map((ch) => codes[ch])
    .join("");
}

function decode(bits, tree) {
  let out = "";
  let node = tree;

  for (const bit of bits) {
    node = bit === "0" ? node.left : node.right;
    if (!node.left && !node.right) {
      out += node.ch;
      node = tree;
    }
  }
  return out;
}

const freq = frequencyMap(input);
const tree = buildTree(freq);
const codes = makeCodes(tree);
const encoded = encode(input, codes);
const decoded = decode(encoded, tree);

console.log("Input:", input);
console.log("Codes:", codes);
console.log("Original bits:", input.length * 8);
console.log("Encoded bits:", encoded.length);
console.log("Decoded equals input:", decoded === input);
