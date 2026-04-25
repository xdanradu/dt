const sampleText = "red, red, green, red, red, blue, red, red, yellow, yellow, red, red, red, red, red, red, red, red, red, red";

function buildFrequencyTable(text) {
  const counts = new Uint32Array(256);
  for (let i = 0; i < text.length; i++) {
    counts[text.charCodeAt(i)]++;
  }

  const total = text.length;
  const rows = [];
  for (let code = 0; code < counts.length; code++) {
    if (counts[code] > 0) {
      rows.push({
        code,
        symbol: String.fromCharCode(code),
        count: counts[code],
        probability: counts[code] / total,
      });
    }
  }
  rows.sort((a, b) => b.count - a.count);
  return rows;
}

function entropy(rows) {
  let h = 0;
  for (const row of rows) {
    h += -row.probability * Math.log2(row.probability);
  }
  return h;
}

function printAnalysis(text) {
  const rows = buildFrequencyTable(text);
  const h = entropy(rows);
  const originalBits = text.length * 8;
  const entropyLowerBoundBits = h * text.length;

  console.log("Input:", text);
  console.log("Length:", text.length, "characters");
  console.log("\nTop symbols:");
  console.table(
    rows.map((r) => ({
      symbol: r.symbol === " " ? "<space>" : r.symbol,
      count: r.count,
      probability: r.probability.toFixed(4),
    }))
  );

  console.log("Entropy H(X):", h.toFixed(4), "bits/symbol");
  console.log("Original size:", originalBits, "bits");
  console.log("Theoretical lower bound:", entropyLowerBoundBits.toFixed(2), "bits");
  console.log(
    "Estimated best-case reduction:",
    ((1 - entropyLowerBoundBits / originalBits) * 100).toFixed(2) + "%"
  );
}

printAnalysis(sampleText);
