'use strict';

// const debug = require('debug')('gws:lru-cache');

const MAX_SIZE = 50000;
const TRIM_SIZE = 40000; // TODO: What is the optimal cache size after purge?

const LRU = module.exports = function(params) {
  params = params || {};
  this.max = params.max || MAX_SIZE;
  this.trim = params.trim || TRIM_SIZE;
  this.items = [];
  this.lookup = {};
};

LRU.prototype.get = function(key) {
  let item = this.lookup[key];
  if(item) {
    item.t = Date.now(); //Update cache time
    return item.value;
  }
  return null;
};

LRU.prototype.set = function(key, value) {

  if(this.lookup[key]) {
    // debug('set(), updating time',key);
    return this.lookup[key].t = Date.now();
  }

  if(this.items.length === this.max) purge.call(this);

  let item = {
    key: key,
    value: value,
    t: Date.now()
  };

  // debug('set(), adding new item',key);

  this.lookup[key] = item;
  this.items.push(item); //Only sort when needed.
};

function purge() {
  // debug('purge()');
  // Sorting is somewhat expensive, so we only want to purge sometimes.
  this.items.sort(function(a,b) {
    if(a.t > b.t) return -1;
    if(b.t > a.t) return 1;
    return 0;
  });

  let num = this.max - this.trim;
  // if(num > items.length) num = items.length; // Impossible?

  while(num > 0) {
    let item = this.items.pop();
    delete this.lookup[item.key];
    num--;
  }
}
