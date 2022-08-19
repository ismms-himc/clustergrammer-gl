import * as d3 from "d3";
import calc_inverse_zscore from "../utils/calcInverseZscore.js";
import calc_zscore from "../utils/calcZscore.js";
export default (function make_opacity_arr(params) {
  let inst_avg;
  let inst_std;
  mat_data = params.mat_data;
  // run one or the other
  // calc_zscore(params)
  // Initially Z-scored
  let viz_mat_data;
  if (params.norm.initial_status === "zscored") {
    if (params.norm.zscore_status === "zscored") {
      viz_mat_data = params.mat_data;
    } else if (params.norm.zscore_status === "non-zscored") {
      if ("mat_data_iz" in params === false) {
        calc_inverse_zscore(params);
      }
      viz_mat_data = params.mat_data_iz;
    }
    // Not Initially Z-scored
  } else {
    // always visualize mat_data
    viz_mat_data = params.mat_data;
  }
  var opacity_arr = [].concat.apply([], viz_mat_data);
  var abs_max_val = Math.abs(
    _.max(opacity_arr, function (d) {
      return Math.abs(d);
    })
  );
  var opacity_scale = d3.scaleLinear();
  var opacity_domain = abs_max_val * params.matrix.opacity_scale;
  var opacity_range = 1.0;
  opacity_scale
    .domain([-opacity_domain, opacity_domain])
    .range([-opacity_range, opacity_range])
    .clamp(true);
  opacity_arr = opacity_arr.map(function (x) {
    return opacity_scale(x);
  });
  return opacity_arr;
});
