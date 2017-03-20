'use strict';

const express = require('express');
// const debug = require('debug')('gws:server');
const debug = function() {};

const PORT = process.env.PORT || 8080;

const app = express();

const LRU = require('./lru-cache.js');
const lru = new LRU({
  max: 50000,
});

const lookup = require('./sales-tax-lookup.js');

let count = 0;
let hits = 0;
let last = Date.now();

app.get('/lookup', function(req, res) {
  count++;
  let q = req.query;
  if(!q) return res.status(404).send();
  if(!q.address) return res.status(400).send('missing address');
  let tax = lru.get(q.address);
  if(tax) hits++;
  if(count % 100 === 0) {
    let now = Date.now();
    debug('count',count,'hits',hits,'time',(now - last),'size',lru.size);
    last = now;
  }
  if(!tax) {
    return lookup(q.address)
    .then( value => {
      lru.set(q.address, value);
      res.send(`${value}`); //TODO: Send some JSON
    })
    .catch( err => {
      debug(err);
      res.status(500).send(err.message);
    });
  }
  res.send(`${tax}`);
});

const server = module.exports = app.listen(PORT, () => {
  debug('Server up:',PORT);
  server.running = true;
});

server.PORT = PORT;
