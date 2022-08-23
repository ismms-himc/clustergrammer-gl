import average from "./average";
import average_n_minus_1 from "./averageNMinus1";

export default (function standard_deviation(data) {
  const avg = average(data);
  const squareDiffs = data.map(function (value) {
    const diff = value - avg;
    const sqrDiff = diff * diff;
    return sqrDiff;
  });
  const avgSquareDiff = average_n_minus_1(squareDiffs);
  const stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
});
