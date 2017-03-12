'use strict';

const express = require('express');

const PORT = process.env.PORT || 8080;

const app = express();

const LRU = require('./lru-cache.js');
const lru = new LRU();

const lookup = require('./sales-tax-lookup.js');

app.get('/lookup', function(req, res) {
  let q = req.query;
  if(!q) return res.status(404).send();
  if(!q.address) return res.status(400).send('missing address');
  let tax = lru.get(q.address);
  if(!tax) {
    return lookup(q.address)
    .then( value => {
      lru.set(q.address, value);
      res.send(`${value}`); //TODO: Send some JSON
    })
    .catch( err => res.status(500).send(err.message));
  }
  res.send(`${tax}`);
});

const server = module.exports = app.listen(PORT, () => {
  console.log('Server up:',PORT);
  server.running = true;
});

server.PORT = PORT;
