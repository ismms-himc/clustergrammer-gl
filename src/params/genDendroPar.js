import * as _ from "underscore";
import alt_slice_linkage from "../dendrogram/altSliceLinkage";
import calc_dendro_triangles from "../dendrogram/calcDendroTriangles";
import make_dendro_args from "../dendrogram/makeDendroArgs";

export default (function gen_dendro_par(cgm) {
  const params = cgm.params;
  const regl = cgm.regl;
  const dendro = {};
  dendro.default_level = 5;
  dendro.tri_height = 0.1;
  dendro.trap_height = 0.03;
  dendro.trap_float = 0.005;
  dendro.dendro_args = {};
  dendro.group_level = {};
  dendro.update_dendro = false;
  dendro.selected_clust_names = [];
  dendro.group_info = {};
  dendro.default_link_level = 0.5;
  dendro.output_label_format = "list";
  dendro.min_dist = {};
  dendro.min_dist.row = 0; // 0.75
  dendro.min_dist.col = 0; // 0.75
  if ("linkage" in params.network) {
    dendro.precalc_linkage = true;
    // initial slices of linkage matrix
    // ////////////////////////////////////////////////////
    let link_mat;
    dendro.max_linkage_dist = {};
    let dist_thresh;
    const axes = ["col", "row"];
    axes.forEach((axis) => {
      link_mat = params.network.linkage[axis];
      dendro.max_linkage_dist[axis] = link_mat[link_mat.length - 1][2] + 0.01;
      dist_thresh = dendro.max_linkage_dist[axis] * dendro.default_link_level;
      // alternate linkage slicing code
      alt_slice_linkage(params, axis, dist_thresh, dendro.min_dist[axis]);
    });
  } else {
    dendro.precalc_linkage = false;
  }
  dendro.increment_buttons = false;
  params.dendro = dendro;
  _.each(["row", "col"], function (axis) {
    params.dendro.group_level[axis] = params.dendro.default_level;
    params.dendro.group_info[axis] = calc_dendro_triangles(params, axis);
    params.dendro.dendro_args[axis] = make_dendro_args(regl, params, axis);
  });
});
