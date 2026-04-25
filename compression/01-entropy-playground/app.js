const text = "banana banana banana bandana";

function frequencies(input) {
  const map = new Map();
  for (const ch of input) {
    map.set(ch, (map.get(ch) || 0) + 1);
  }
  return map;
}

function entropy(freq, total) {
  let h = 0;
  for (const count of freq.values()) {
    const p = count / total;
    h += -p * Math.log2(p);
  }
  return h;
}

const freq = frequencies(text);
const h = entropy(freq, text.length);
const originalBits = text.length * 8;
const lowerBound = h * text.length;

console.log("Input:", text);
console.log("Length:", text.length);
console.table(
  Array.from(freq.entries()).map(([symbol, count]) => ({
    symbol: symbol === " " ? "<space>" : symbol,
    count,
  }))
);
console.log("Entropy (bits/symbol):", h.toFixed(4));
console.log("Original bits:", originalBits);
console.log("Theoretical lower bound bits:", lowerBound.toFixed(2));
