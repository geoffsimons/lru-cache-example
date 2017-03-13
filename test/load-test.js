'use strict';

const expect = require('chai').expect;
// const request = require('superagent');
const debug = require('debug')('gws:load-test');

// const server = require('../server.js');
// const url = `http://localhost:${server.PORT}`;

const mockUsers = require('./lib/mock-users.js');

describe('Load Test', function() {
  // before( () => require('../server.js'));
  this.timeout(0);
  describe('after many requests', () => {
    before( done => {
      // mockUsers(50, done);
      let numHits = 0;
      let numCalls = 0;
      let numPop = 0;
      mockUsers(100000, done, function(e) {
        if(e.t < 100) numHits++;
        numCalls++;
        if(e.addr.length < 11) numPop++;
        // debug('call:',numCalls,e.addr,e.addr.length);
        if(numCalls % 1000 === 0) debug('calls:',numCalls,'pop:',numPop,'hit:',numHits);
      });
    });
    it('should return quicker for common addresses', done => {
      let numHits = 0;
      let hitTime = 0;
      let numMiss = 0;
      let missTime = 0;
      let numCalls = 0;
      let totalTime = 0;
      let popTime = 0;
      let numPops = 0;
      let buckets = {};
      let bw = 10; //ms

      function finish() {
        let hitRate = numHits/numCalls;

        debug('calls:',numCalls,totalTime,totalTime/numCalls);
        debug('pops:',numPops,popTime,popTime/numPops);
        debug('hits:',numHits,hitTime,hitTime/numHits,'rate:',hitRate);
        debug('miss:',numMiss,missTime,missTime/numMiss);
        debug('buckets:',buckets);

        expect(hitRate).to.be.above(0.35);

        done();
      }
      mockUsers(20000, finish, function(e) {
        totalTime += e.t;

        let bi = Math.floor(e.t / bw);
        buckets[bi] = buckets[bi] ? buckets[bi] + 1 : 1;

        if(e.t < 100) {
          numHits++;
          hitTime += e.t;
        }
        else {
          numMiss++;
          missTime += e.t;
        }
        numCalls++;
        if(e.addr.length < 11) {
          numPops++;
          popTime += e.t;
        }
        if(numCalls % 1000 === 0) debug('calls:',numCalls,'pop:',numPops,'hit:',numHits);
      });
    });

  });
});
