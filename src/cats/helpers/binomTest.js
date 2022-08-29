import { factorial } from "mathjs";

export default (function binom_test(actual_k, n, p) {
  let pval;
  function binom_dist(k, n, p) {
    const bin_coeff = factorial(n) / (factorial(k) * factorial(n - k));
    p = bin_coeff * (Math.pow(p, k) * Math.pow(1 - p, n - k));
    return p;
  }
  function my_binom_test_2(actual_k, n, p) {
    let cp = 0;
    let k;
    let dp;
    for (let inst_k = actual_k; inst_k < n + 1; inst_k++) {
      k = inst_k;
      dp = binom_dist(k, n, p);
      cp = cp + dp;
    }
    return cp;
  }
  // look up p-value from z-score using table
  function binom_prop_table(actual_k, n, p) {
    // expected average number of successes
    const mu = n * p;
    // standard deviation
    const sigma = Math.sqrt(n * p * (1 - p));
    // how many standard deviations is the actual_k away
    // from the expected value
    const z = (actual_k - mu) / sigma;
    const z_vals = z;
    const p_vals = p;
    let found_index = -1;
    let found = false;
    for (let index = 0; index < z_vals.length; index++) {
      const inst_z = z_vals[index];
      // increasing inst_z until z is less than inst_z
      if (z < inst_z && found === false) {
        found_index = index;
        found = true;
      }
    }
    // give it the smallest p-val if the z-score was larger than
    // any in the table
    if (found_index === -1) {
      found_index = z_vals.length - 1;
    }
    pval = p_vals[found_index];
    return pval;
  }
  // calculate pval
  pval = my_binom_test_2(actual_k, n, p);
  if (isNaN(pval)) {
    pval = binom_prop_table(actual_k, n, p);
  }
  return pval;
});
