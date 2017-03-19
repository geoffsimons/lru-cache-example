'use strict';

const MAX_SIZE = 50000;

// const debug = require('debug')('gws:lru-cache');
const debug = function() {};

function Node(key, val) {
  this.key = key;
  this.val = val;
  this.prev = null;
  this.next = null;
}

const LRU = module.exports = function(params) {
  params = params || {};
  this.max = params.max || MAX_SIZE;
  this.lookup = {};
  this.head = null;
  this.tail = null;
  this.size = 0;
};

LRU.prototype.get = function(key) {
  debug('get()',key, typeof key);
  let node = this.lookup[key];
  if(!node) return null;
  //Move node to the head.
  moveToHead.call(this, node);
  return node.val;
};

LRU.prototype.set = function(key, val) {
  debug('set()',key,val, typeof key);
  let node = this.lookup[key];
  // debug('NODE:',node);
  // debug('lookup:',this.lookup);

  if(node) {
    debug('found:',node);
    moveToHead.call(this, node);
    return node.val;
  }

  node = new Node(key, val);

  //Cache miss and no more room. Need to purge an item.
  if(this.size === this.max) {
    // Remove the tail.
    let tail = this.tail;
    //TODO: Why is tail.prev sometimes null here?
    // If size is 1, then tail.prev should be null.
    let prev = tail.prev;
    if(prev) {
      prev.next = null; //Would have been === tail, otherwise.
      this.tail = prev;
    }
    // tail.prev.next = null;
    // this.tail = tail.prev;
    this.size--;
    delete this.lookup[tail.key];
  }

  this.lookup[key] = node;
  this.size++;

  if(!this.head) {
    this.head = node;
    this.tail = node;
    return;
  }

  node.next = this.head;
  this.head.prev = node;
  this.head = node;
};

function moveToHead(node) {
  debug('moveToHead()',node);
  if(!node.prev) return node.val; //Node is already the head.

  let prev = node.prev;
  prev.next = node.next;
  if(node.next) {
    node.next.prev = prev;
  }
  else {
    //node was the tail.
    this.tail = prev;
  }
  this.head = node;
}
