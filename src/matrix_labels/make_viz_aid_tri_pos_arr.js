module.exports = function make_viz_aid_tri_pos_arr(params, inst_axis, inst_order){

  var num_labels = params.labels['num_'+inst_axis];
  var heat_size;
  var tri_width;
  var heat_shift;

  // keep positioned at matrix not heatmap (make room for categories)
  // making triangle smaller
  if (inst_axis === 'row'){
    heat_size = params.viz_dim.heat_size.y;
    tri_width = heat_size/num_labels;
    heat_shift = params.viz_dim.mat_size.y - params.viz_dim.heat_size.y;
  } else {
    heat_size = params.viz_dim.heat_size.x;
    tri_width  = heat_size/num_labels;
    heat_shift = -(params.viz_dim.mat_size.x - params.viz_dim.heat_size.x);
  }

  // make viz_aid triangle array
  /////////////////////////////////
  var tri_offset_array = [];
  var i;
  var inst_index;
  var order_index;
  for (i = 0; i < num_labels; i++){

    order_index = params.network[inst_axis + '_nodes'][i][inst_order];

    if (inst_axis == 'row'){
      inst_index = num_labels - order_index - 1;
    } else {
      inst_index = order_index ;
    }

    // shift the viz aid triangles because of smaller size of the heatmap
    tri_offset_array[i] = heat_size - heat_shift - 2 * tri_width * inst_index - tri_width;
  }

  return tri_offset_array;

};