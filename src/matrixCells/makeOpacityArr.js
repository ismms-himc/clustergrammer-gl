import { scaleLinear } from "d3-scale";
import * as _ from "underscore";
import calc_inverse_zscore from "../utils/calcInverseZscore";

export default (function make_opacity_arr(store) {
  const { network, matrix } = store.getState();
  let viz_mat_data = network.mat;

  // if initially Z-scored
  if (
    network.norm.initial_status === "zscored" &&
    network.norm.zscore_status === "non-zscored" &&
    "mat_iz" in network === false
  ) {
    viz_mat_data = calc_inverse_zscore(store);
  }

  let opacity_arr = [].concat(...viz_mat_data);
  const abs_max_val = Math.abs(
    _.max(opacity_arr, function (d) {
      return Math.abs(d);
    })
  );
  const opacity_scale = scaleLinear();
  const opacity_domain = abs_max_val * matrix.opacity_scale;
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
