let data = 'it is Better';

function countSymbolsLinear(text) {
  let counter = Array(256).fill(0);
  for (let i = 0; i < text.length; i++) {
    counter[text[i].charCodeAt(0)]++;
  }
  return counter.map((el, index) => {
    return { id: index, symbol: String.fromCharCode(index), count: el };
  });
}

function getSymbols(text){
  let result =[];
  for (let i=0;i<text.length;i++) {
    let exists = false;
    for (let j=0;j<result.length;j++){
      if(text[i] === result[j]) {
        exists = true;
      }
    }
    if(!exists) {
      result.push(text[i]);
    }
  }
  return result;
}

function getCount(char, text) {
  let result=0;
  for(let i=0;i<text.length;i++){
    if(char === text[i]) {
      result++;
    }
  }
  return result;
}
function countSymbolsBruteforce(text){
  let result = getSymbols(text).map((el)=>{ return {char: el, count: 0}});
  for (let i=0;i<result.length;i++){
    let count = getCount(result[i].char, text);
    result[i].count = count;
  }
  return result;
}

console.time('counter-bruteforce')
let arr1 = countSymbolsBruteforce(data);
console.timeEnd('counter-bruteforce')

console.time('counter-linear')
let arr2 = countSymbolsLinear(data).filter(el => el.count>0);
console.log(sortArrDesc((arr2)));
console.timeEnd('counter-linear')

function equals(arr1, arr2){
  if (arr1.length !== arr2.length) return false;
  for (let i=0;i<arr1.length;i++) {
    if (arr1[i].count !== arr2[i].count) return false;
  }
  return true;
}

function sortArrDesc(arr) {
  return arr.sort(function (a, b) {
    if (a.count > b.count) {
      return -1;
    }
    if (b.count > a.count) {
      return 1;
    }
    return 0;
  })
}

// console.log(sortArr(arr1))
// console.log(sortArr(arr2))
// console.log(equals(sortArr(arr1), sortArr(arr2)));

/*let testData = [2, 4, 3, 7].map((element, index) => {
    return { id: index, count: element }
})
console.log(testData);
console.log([2, 4, 3, 7].sort());
*/
