'use strict';

const Promise = require('bluebird');
const request = require('superagent');
const debug = require('debug')('gws:mock-users');

const addresses = require('./mock-addresses.js');

// Simulate a pool of users making requests.
const PORT = process.env.PORT || 8080;

const url = `http://localhost:${PORT}/lookup?address=`;

//Promisify superagent
function makeRequest(addr) {
  // debug('makeRequest()',addr);
  return new Promise( (resolve, reject) => {
    request.get(`${url}${addr}`)
    .end( (err, res) => {
      if(err) return reject(err);
      resolve(res);
    });
  });
}

// num: number of requests to make.
module.exports = function(num, done, listener) {
  debug('mock-users',num);
  let i = 0;
  let n = 0;
  function work() {
    // debug('work()',i);
    // if(i % 10 === 0) console.log(' ***** ',i,' *****');

    i++;
    n++;

    let addr = addresses.get();
    let start = Date.now();
    return makeRequest(addr)
    .then( () => {
      if(listener) {
        listener({
          t: Date.now() - start,
          addr: addr
        });
      }
    })
    .catch( err => {
      debug(err);
    })
    .finally( () => {
      n--;
      if(i < num) return work();
      if(n === 0) {
        debug('all done mock-users');
        done();
      }
    });
  }
  for(let i = 0; i < 50; i++) work();
};
