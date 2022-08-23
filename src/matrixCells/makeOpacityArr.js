import * as d3 from "d3";
import * as _ from "underscore";
import calc_inverse_zscore from "../utils/calcInverseZscore";

export default (function make_opacity_arr(state) {
  // Initially Z-scored
  let viz_mat_data;
  if (state.network.norm.initial_status === "zscored") {
    if (state.network.norm.zscore_status === "zscored") {
      viz_mat_data = state.network.mat;
    } else if (state.network.norm.zscore_status === "non-zscored") {
      if ("mat_data_iz" in state === false) {
        viz_mat_data = calc_inverse_zscore(state);
      }
    }
    // Not Initially Z-scored
  } else {
    // always visualize mat data
    viz_mat_data = state.network.mat;
  }
  let opacity_arr = [].concat(...viz_mat_data);
  const abs_max_val = Math.abs(
    _.max(opacity_arr, function (d) {
      return Math.abs(d);
    })
  );
  const opacity_scale = d3.scaleLinear();
  const opacity_domain = abs_max_val * state.matrix.opacity_scale;
  const opacity_range = 1.0;
  opacity_scale
    .domain([-opacity_domain, opacity_domain])
    .range([-opacity_range, opacity_range])
    .clamp(true);
  opacity_arr = opacity_arr.map(function (x) {
    return opacity_scale(x);
  });
  return opacity_arr;
});
