var reorder_cat_args = require('./reorder_cat_args');
var reorder_matrix_args = require('./reorder_matrix_args');
var update_text_triangle_order = require('./../matrix_labels/update_text_triangle_order');

module.exports = function run_reorder(regl, params, inst_axis, ini_new_order){

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  // toggle dendro sliders (will re-display at end of animation)
  if (new_order != 'clust'){
    d3.select('.'+ inst_axis +'_dendro_slider_svg').style('display','none')
  }

  params.ani.run_animation = true;
  params.order.new[inst_axis] = new_order;

  reorder_matrix_args(regl, params);
  reorder_cat_args(regl, params);

  // preventing tmp reordering bug that happens when pre-calculated labels are
  // incorrectly animated on reordering. The bug seems to occur only when the
  // number of pre-calculated (drawn) rows is less than the total number of rows
  /*
  No need to run calc_text_offset (in network_data) during a reorder event
  */

  // either update the existing draw text_triangles or trash them
  if (params.text_triangles.draw[inst_axis] != false && params.labels['num_' + inst_axis] <= params.max_num_text){
    params.text_triangles.draw[inst_axis] = update_text_triangle_order(params, inst_axis);
  } else {
    params.text_triangles.draw[inst_axis] = false;
  }

};