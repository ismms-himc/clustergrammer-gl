let average = require('./average')

module.exports = function standard_deviation(data){
  var avg = average(data);

  var squareDiffs = data.map(function(value){
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

