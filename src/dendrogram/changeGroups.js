import * as d3 from "d3";
import alt_slice_linkage from "./altSliceLinkage";
import calc_dendro_triangles from "./calcDendroTriangles";

export default (function change_groups(state, axis, slider_value) {
  state.dendro.update_dendro = true;
  if (state.dendro.precalc_linkage) {
    const dist_thresh = state.dendro.max_linkage_dist[axis] * slider_value;
    alt_slice_linkage(state, axis, dist_thresh, state.dendro.min_dist[axis]);
    const rounded_slider_value = Math.round(slider_value * 100) / 100;
    // update slider
    d3.select(
      state.visualization.rootElementId +
        " ." +
        axis +
        "_dendro_slider_svg .dendro_level_text"
    ).text(rounded_slider_value);
  } else {
    state.dendro.group_level[axis] = slider_value;
  }
  state.dendro.group_info[axis] = calc_dendro_triangles(state, axis);
});
