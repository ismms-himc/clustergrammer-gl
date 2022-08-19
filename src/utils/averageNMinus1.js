export default (function average_n_minus_1(data) {
  const sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  const avg = sum / (data.length - 1);
  return avg;
});
