module.exports = function make_viz_aid_tri_pos_arr(params, inst_axis, inst_order){

  var num_labels = params.labels['num_'+inst_axis];
  var mat_size;
  var tri_width;

  // keep positioned at matrix not heatmap (make room for categories)
  // making triangle smaller
  if (inst_axis === 'col'){
    mat_size = params.viz_dim.heat_size.x;
    tri_width  = mat_size/num_labels;
  } else {
    mat_size = params.viz_dim.heat_size.y;
    tri_width = mat_size/num_labels;
  }

  // make viz_aid triangle array
  /////////////////////////////////
  var tri_offset_array = [];
  var i;
  for (i = 0; i < num_labels; i++){

    // emperically found rules
    var order_id;
    var shift_mat_heat;
    if (inst_axis == 'row'){
      // row ordering rules
      order_id = num_labels - params.network[inst_axis + '_nodes'][i][inst_order] - 1;
      shift_mat_heat = -(params.viz_dim.mat_size.y - params.viz_dim.heat_size.y);
    } else {
      // col ordering rules
      order_id = params.network[inst_axis + '_nodes'][i][inst_order] ;
      shift_mat_heat = params.viz_dim.mat_size.x - params.viz_dim.heat_size.x;
    }

    // shfit the viz aid triangles down to make up
    // for the smaller size of the heatmap vs the general matrix area
    tri_offset_array[i] = mat_size - tri_width - order_id * 2 * tri_width + shift_mat_heat;
  }

  return tri_offset_array;

};