import average from "./average.js";
import average_n_minus_1 from "./averageNMinus1.js";
export default (function standard_deviation(data) {
  var avg = average(data);
  var squareDiffs = data.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });
  var avgSquareDiff = average_n_minus_1(squareDiffs);
  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
});
