export default (function average(data) {
  const sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  const avg = sum / data.length;
  return avg;
});
