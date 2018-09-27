var make_dendro_args = require('./../dendrogram/make_dendro_args');
var calc_row_dendro_triangles = require('./../dendrogram/calc_row_dendro_triangles');

module.exports = function generate_dendro_params(regl, params){

  params.dendro = {};

  params.dendro.default_level = 5;

  params.dendro.dendro_args = {};
  params.dendro.group_level = {};

  _.each(['row', 'col'], function(inst_axis){

    params.dendro.dendro_args[inst_axis] = make_dendro_args(regl, params, inst_axis);
    params.dendro.group_level[inst_axis] = params.dendro.default_level;

  });

  params.dendro.group_info = calc_row_dendro_triangles(params);

};