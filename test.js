const axios = require('axios');
const ethers = require('ethers');

function toNormalize(obj = {}, keys = [], rs = {}) {
  for (const key in obj) {
    const value = obj[key];
    if (typeof (value) == 'object') {
      toNormalize(value, [...keys, key], rs);
    } else {
      rs[[...keys, key].join('.')] = value;
    }
  }
}
async function run() {
  // const sumary = {
  //   a: { b: 1 },
  //   b: 2,
  //   c: { a: 3, b: 4, c: { a: 1, b: 2, c: { a: 1, b: { c: 2 } } } }
  // };
  // const sumaries = {};
  // toNormalize(sumary, ['sumaries'], sumaries);
  // console.log(sumaries);
  console.log(ethers.BigNumber.from('24366104').toHexString())
}

run();