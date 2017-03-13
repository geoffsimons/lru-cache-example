'use strict';

const MAX = 1000000000; // 1B total addresses.
const POP = 100000; // 100k most searched.

function getFlat() {
  return Math.floor(POP * Math.random());
}

function getRound() {
  let rnd = Math.random();
  let cs = Math.cos(rnd * Math.PI);
  cs += 1;
  cs /= 2;
  let x = 1 - cs;
  return Math.floor(x * POP);
}

module.exports = {
  get: function() {
    let rnd = Math.random();
    if(rnd < 0.95) {
      // let n = getFlat();
      let n = getRound();
      return `addr_${n}`;
    }
    let n = Math.floor((MAX-POP) * Math.random()) + POP;
    return `addr_${n}`;
  }
};
