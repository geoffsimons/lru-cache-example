# lru-cache-example
Example of an LRU cache and how it might be used on an Express server. The LRU cache can be configured for max number of entries, as well as how many entries to trim to on a purge operation.

## Installation
1) Download or clone this repository.
2) Run `npm i` to install node module dependencies

## Load Test
You can test for average reponse time, cache hit rate, and overall performance. Mock user traffic assumes that 95% of all requests are for the top 100k most popular queries out of 1 billion. In order to run the test, do the following:
```
# Open up a terminal window to run the server.
npm run start
# Open up a 2nd terminal window to run the test.
npm run test test/load-test.js
```
I found that running the server and test in separate processes led to more stable results.

