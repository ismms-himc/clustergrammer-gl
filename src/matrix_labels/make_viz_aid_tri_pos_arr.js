module.exports = function make_viz_aid_tri_pos_arr(params, inst_axis, inst_order){

  var num_labels = params.labels['num_'+inst_axis];
  var mat_size;
  var tri_width;
  var shift_heat;

  // keep positioned at matrix not heatmap (make room for categories)
  // making triangle smaller
  if (inst_axis === 'row'){
    mat_size = params.viz_dim.heat_size.y;
    tri_width = mat_size/num_labels;
    shift_heat = -(params.viz_dim.mat_size.y - params.viz_dim.heat_size.y);
  } else {
    mat_size = params.viz_dim.heat_size.x;
    tri_width  = mat_size/num_labels;
    shift_heat = params.viz_dim.mat_size.x - params.viz_dim.heat_size.x;
  }

  // make viz_aid triangle array
  /////////////////////////////////
  var tri_offset_array = [];
  var i;
  var inst_index;
  for (i = 0; i < num_labels; i++){

    // emperically found rules
    if (inst_axis == 'row'){
      inst_index = num_labels - params.network[inst_axis + '_nodes'][i][inst_order] - 1;
    } else {
      inst_index = params.network[inst_axis + '_nodes'][i][inst_order] ;
    }

    // shfit the viz aid triangles because of smaller size of the heatmap
    tri_offset_array[i] = mat_size - tri_width - 2 * inst_index * tri_width + shift_heat;
  }

  return tri_offset_array;

};