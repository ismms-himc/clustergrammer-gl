var calc_dendro_triangles = require('./../dendrogram/calc_dendro_triangles');
var make_dendro_args = require('./../dendrogram/make_dendro_args');

module.exports = function gen_dendro_par(regl, params){

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

  params.dendro = dendro;

  _.each(['row', 'col'], function(inst_axis){

    params.dendro.group_level[inst_axis] = params.dendro.default_level;

    params.dendro.group_info[inst_axis] = calc_dendro_triangles(params, inst_axis);
    params.dendro.dendro_args[inst_axis] = make_dendro_args(regl, params, inst_axis);

  });

};