module.exports = function run_reorder(regl, params, inst_axis, ini_new_order){

  var new_order = ini_new_order.replace('sum', 'rank')
                               .replace('var', 'rankvar');

  if (new_order != 'clust'){
    d3.select('.'+ inst_axis +'_dendro_slider_svg').style('display','none')
  }

  params.ani.run_animation = true;
  params.order.new[inst_axis] = new_order;

  require('./reorder_matrix_args')(regl, params);
  require('./reorder_cat_args')(regl, params);

  // either update the existing draw text_triangles or trash them
  if (params.text_triangles.draw[inst_axis] != false && params.labels['num_' + inst_axis] <= params.max_num_text){
    params.text_triangles.draw[inst_axis] = require('./../matrix_labels/update_text_triangle_order')(params, inst_axis);
  } else {
    params.text_triangles.draw[inst_axis] = false;
  }
};