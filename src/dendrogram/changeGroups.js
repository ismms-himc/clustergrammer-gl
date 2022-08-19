var calc_dendro_triangles = require("./../dendrogram/calcDendroTriangles");
var make_dendro_args = require("./../dendrogram/makeDendroArgs");
var alt_slice_linkage = require("./altSliceLinkage");
var d3 = require("d3");

/* Changes the groupings (x- and y-axis color bars).
 */
module.exports = function change_groups(cgm, axis, slider_value) {
  console.log("change_groups!!!!!!");

  let regl = cgm.regl;
  let params = cgm.params;

  params.dendro.update_dendro = true;

  if (params.dendro.precalc_linkage) {
    let dist_thresh = params.dendro.max_linkage_dist[axis] * slider_value;
    alt_slice_linkage(params, axis, dist_thresh, params.dendro.min_dist[axis]);

    let rounded_slider_value = Math.round(slider_value * 100) / 100;
    // update slider
    d3.select(
      params.root + " ." + axis + "_dendro_slider_svg .dendro_level_text"
    ).text(rounded_slider_value);
  } else {
    params.dendro.group_level[axis] = slider_value;
  }

  params.dendro.group_info[axis] = calc_dendro_triangles(params, axis);
  params.dendro.dendro_args[axis] = make_dendro_args(regl, params, axis);
};
