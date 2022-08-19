export default (function custom_round(x, n) {
  // n is the number of decimal points to round to
  return n === null ? Math.round(x) : Math.round(x * (n = Math.pow(10, n))) / n;
});
