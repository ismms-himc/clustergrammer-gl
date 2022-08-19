import * as core from "mathjs/core";
import * as factorial from "mathjs/lib/function/probability/factorial";
import p_dict from "./binomPropPvalLookup.js";
const math = core.create();
math.import(factorial);

export default (function binom_test(actual_k, n, p) {
  var fact = math.factorial;
  var pval;
  function binom_dist(k, n, p) {
    var bin_coeff = fact(n) / (fact(k) * fact(n - k));
    p = bin_coeff * (Math.pow(p, k) * Math.pow(1 - p, n - k));
    return p;
  }
  function my_binom_test_2(actual_k, n, p) {
    var cp = 0;
    var k;
    var dp;
    for (var inst_k = actual_k; inst_k < n + 1; inst_k++) {
      k = inst_k;
      dp = binom_dist(k, n, p);
      cp = cp + dp;
    }
    return cp;
  }
  // look up p-value from z-score using table
  function binom_prop_table(actual_k, n, p) {
    // expected average number of successes
    var mu = n * p;
    // standard deviation
    var sigma = Math.sqrt(n * p * (1 - p));
    // how many standard deviations is the actual_k away
    // from the expected value
    var z = (actual_k - mu) / sigma;
    var z_vals = p_dict.z;
    var p_vals = p_dict.p;
    var found_index = -1;
    var found = false;
    for (var index = 0; index < z_vals.length; index++) {
      var inst_z = z_vals[index];
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
