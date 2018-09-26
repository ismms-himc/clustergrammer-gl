var gather_text_triangles = require('./../matrix_labels/gather_text_triangles');
module.exports = function generate_text_triangle_params(params){

  // save text triangles for later use
  params.text_triangles = {};
  params.text_triangles.row = {};
  params.text_triangles.col = {};

  params.max_num_text = 200;

  params.text_triangles.draw = {};

  _.each(['row', 'col'], function(inst_axis){
    if (params.labels['num_' + inst_axis] > params.max_num_text){
      params.text_triangles.draw[inst_axis] = false;
    } else {
      gather_text_triangles(params, inst_axis);
    }
  });
};