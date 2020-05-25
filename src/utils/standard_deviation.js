let average = require('./average')
let average_n_minus_1 = require('./average_n_minus_1')

// https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/

module.exports = function standard_deviation(data){

  var avg = average(data);

  var squareDiffs = data.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average_n_minus_1(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

