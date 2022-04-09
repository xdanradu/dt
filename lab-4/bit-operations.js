let data = 'ana areee meeeeereeee';
// console.log(data.length * 8 + ' bits');

function countSymbolsLinear(text) {
  let counter = Array(256).fill(0);
  for (let i = 0; i < text.length; i++) {
    counter[text[i].charCodeAt(0)]++;
  }
  return counter.map((el, index) => {
    return { charCode: index, char: String.fromCharCode(index), count: el };
  });
}

function countBits(number) {
  return Math.floor(Math.log2(number)+1);
}

let alphabet = countSymbolsLinear(data).filter(
  el => el.count > 0
);

let fixedLength = countBits(alphabet.length);

function getBinaryCode(number) {
  return number.toString(2);
}

let ex = getBinaryCode(1);
// console.log(ex);

function getFixedLengthCode(code, length) {
  while(code.length < length) {
    code+='0';
  }
  return code;
}
// console.log(getFixedLengthCode(ex, fixedLength));

console.log(alphabet);
let codes = alphabet.map((el,index) => {
  let binaryCode = getBinaryCode(index);
  return {...el, code: getFixedLengthCode(binaryCode, fixedLength)}
})
console.log(codes);



function readBit(buffer, i, bit) {
  return (buffer[i] >> bit) % 2;
}

function setBit(buffer, i, bit, value) {
  if (value === 0) {
    buffer[i] &= ~(1 << bit);
  } else {
    buffer[i] |= 1 << bit;
  }
}


let arr = new Uint8Array([0]);// [0000000]
setBit(arr, 0, 0, parseInt(codes[0].code[0]))
setBit(arr, 0, 1, parseInt(codes[0].code[1]))
setBit(arr, 0, 2, parseInt(codes[0].code[2]))
setBit(arr, 0, 3, parseInt(codes[1].code[0]))
setBit(arr, 0, 4, parseInt(codes[1].code[1]))
setBit(arr, 0, 5, parseInt(codes[1].code[2]))
setBit(arr, 0, 6, parseInt(codes[2].code[0]))
setBit(arr, 0, 7, parseInt(codes[2].code[1]))

//00010010
console.log(
  readBit(arr, 0, 0),
  readBit(arr, 0, 1),
  readBit(arr, 0, 2),
  readBit(arr, 0, 3),
  readBit(arr, 0, 4),
  readBit(arr, 0, 5),
  readBit(arr, 0, 6),
  readBit(arr, 0, 7)
);

axios('http://localhost:3000', arr);
//backend decode: ' ', 'a'

{ text: ' a' } // size = 14*8 = 120 biti
