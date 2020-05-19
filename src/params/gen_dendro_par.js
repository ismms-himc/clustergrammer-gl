var calc_dendro_triangles = require('./../dendrogram/calc_dendro_triangles');
var make_dendro_args = require('./../dendrogram/make_dendro_args');
var slice_linkage = require('./../dendrogram/slice_linkage');

module.exports = function gen_dendro_par(cgm){

  var params = cgm.params;
  var regl = cgm.regl;

  var dendro = {};

  dendro.default_level = 5;
  dendro.tri_height = 0.10;
  dendro.trap_height = 0.03;
  dendro.trap_float = 0.005;

  dendro.dendro_args = {};
  dendro.group_level = {};
  dendro.update_dendro = false;

  dendro.selected_clust_names = []

  dendro.group_info = {};

  dendro.default_link_level = 0.5

  if ('linkage' in params.network){
    dendro.precalc_linkage = true

    let link_mat
    dendro.max_linkage_dist = {}
    let dist_thresh
    let axes = ['col', 'row']
    axes.forEach((axis) => {

      link_mat = params.network.linkage[axis]

      // set maxiumu distance to above max linkage distance
      dendro.max_linkage_dist[axis] = link_mat[link_mat.length-1][2] + 0.01

      dist_thresh = dendro.max_linkage_dist[axis] * dendro.default_link_level

      slice_linkage(params, axis, dist_thresh)

    })

  } else {
    dendro.precalc_linkage = false
  }

  dendro.increment_buttons = false

  params.dendro = dendro;

  _.each(['row', 'col'], function(axis){

    params.dendro.group_level[axis] = params.dendro.default_level;

    params.dendro.group_info[axis] = calc_dendro_triangles(params, axis);
    params.dendro.dendro_args[axis] = make_dendro_args(regl, params, axis);

  });

};