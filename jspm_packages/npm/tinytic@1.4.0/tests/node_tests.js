/* */ 
var tinytic = require("../tinytic");
console.log(tinytic);
var acc = 0;
var interval = 512;
var tocDiff = 0;
var tocAcc = 0;
var iterations = 0;
var tinyticTotal;
var tinyticErr;
setInterval(function() {
  acc += interval;
  tocDiff = tinytic.toc() - interval;
  tocAcc += tocDiff;
  tinyticTotal = tinytic.total();
  tinyticErr = tinytic.total() - acc;
  console.log('/////////////////');
  console.log('iterations: ' + iterations++);
  console.log('toc error: ' + tocDiff);
  console.log('toc accumulated error: ' + tocAcc);
  console.log('total: ' + tinyticTotal);
  console.log('toc avg error: ' + (tocAcc / iterations));
  console.log('total avg error: ' + (tinyticErr / iterations));
}, interval);
