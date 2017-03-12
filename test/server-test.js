'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('gws:server-test');

const server = require('../server.js');
const url = `http://localhost:${server.PORT}`;

describe('Server Test', function() {
  describe('GET /lookup', () => {
    describe('after lookup of address', () => {
      it('should be able to respond quickly for subsequent calls', done => {
        let start = Date.now();
        let u = `${url}/lookup?address=123+Fake+St`;
        request.get(u)
        .end( (err, res) => {
          let elapsed = Date.now() - start;
          debug('slow:',elapsed);
          expect(elapsed).to.be.above(100);
          start = Date.now();
          request.get(u).end( (err, res) => {
            let elapsed = Date.now() - start;
            debug('fast:',elapsed);
            expect(elapsed).to.be.below(50);
            done();
          });
        });
      });
    });
  });
});
