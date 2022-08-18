module.exports = function average_n_minus_1(data) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / (data.length - 1);
  return avg;
};
