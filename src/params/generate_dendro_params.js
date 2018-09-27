var make_dendro_args = require('./../dendrogram/make_dendro_args');

module.exports = function generate_dendro_params(regl, params){

  params.dendro = {};
  params.dendro.dendro_args = {};
  _.each(['row', 'col'], function(inst_axis){
    params.dendro.dendro_args[inst_axis] = make_dendro_args(regl, params, inst_axis);
  });

};