'use strict';

// const MAX = 1000000000; // 1B total addresses.
// const POP = 100000; // 100k most searched.
const MAX = 1000000000; // 1B total addresses.
const POP = 100000; // 100k most searched.

module.exports = {
  get: function() {
    let rnd = Math.random();
    if(rnd < 0.95) {
      let n = Math.floor(POP * Math.random());
      return `addr_${n}`;
    }
    let n = Math.floor((MAX-POP) * Math.random()) + POP;
    return `addr_${n}`;
  },
  round: function() {
    let rnd = Math.random();
    if(rnd < 0.95) {
      rnd = Math.random();
      let cs = Math.cos(rnd * Math.PI);
      cs += 1;
      cs /= 2;
      let x = 1 - cs;
      let n = Math.floor(x * POP);
      return `addr_${n}`;
    }
    let n = Math.floor((MAX-POP) * Math.random()) + POP;
    return `addr_${n}`;
  }
};
