'use strict';

const expect = require('chai').expect;

const LRU = require('../lru-cache.js');

describe('LRU Cache', function() {
  describe('#get', () => {
    it('with unknown key, should return null', () => {
      let lru = new LRU();
      let value = lru.get('not_a_key');
      expect(value).to.equal(null);
    });
  });

  describe('purge items', () => {

    describe('after series of set calls', () => {
      it('oldest items should be purged', done => {
        let lru = new LRU({ max: 20, trim: 16 });
        let items = [];
        for(let i = 0; i < 40; i++) items.push(i);

        // for(let i = 0; i < 24; i++) lru.set(i, items[i]);

        let i = 0;
        function addItem() {
          lru.set(i, items[i]);
          i++;
          if(i < 24) return setTimeout(function() {
            addItem();
          }, 10);
          testResult();
        }

        function testResult() {
          // console.log(lru.items);

          expect(lru.get(1)).to.equal(null); // 0,1,2,3 should all have been purged.

          expect(lru.get(10)).to.not.equal(null);
          done();
        }

        addItem();
      });
    });

    describe('after series of set and get calls', () => {
      it('oldest items should be purged', done => {
        let lru = new LRU({ max: 20, trim: 16 });
        let items = [];
        for(let i = 0; i < 40; i++) items.push(i);

        // for(let i = 0; i < 20; i++) lru.set(i, items[i]);

        let i = 0;
        function addItem() {
          lru.set(i, items[i]);
          i++;

          //These get calls should update the timestamp.
          if(i === 20) {
            for(let i = 0; i < 5; i++) lru.get(i);
          }

          //Now different items should be purged, than without the gets.
          if(i < 24) return setTimeout(function() {
            addItem();
          }, 10);
          testResult();
        }

        function testResult() {

          // console.log(lru.items);

          expect(lru.get(1)).to.not.equal(null); // 0,1,2,3 should all have been purged.

          expect(lru.get(5)).to.equal(null);
          done();
        }

        addItem();
      });
    });


  });
});
