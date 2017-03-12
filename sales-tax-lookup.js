'use strict';

module.exports = function(address) {
  // This is a slow lookup.
  return new Promise( (resolve, reject) => {
    //TODO: Fetch the actual value.
    // Not sure how sales_tax_lookup(address) is supposed to be called,
    // whether as a HTTP GET, or some SDK method call.
    
    // MOCK VALUE for now and simulate delay.
    setTimeout(function() {
      let value = 0.10; // 10% tax for all
      resolve(value);
    }, 200);
  });
}
