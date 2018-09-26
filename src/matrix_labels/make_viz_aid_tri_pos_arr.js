module.exports = function make_viz_aid_tri_pos_arr(params, inst_axis, inst_order){


  var num_labels = params['num_'+inst_axis];
  var mat_size;
  // var tri_height;
  var tri_width;

  if (inst_axis === 'col'){

    mat_size = params.viz_dim.heat_size.x;
    // keep positioned at matrix not heatmap (make room for categories)
    // making triangle smaller
    // var reduce_height = params.zoom_data.x.total_zoom;
    // tri_height = mat_size/num_labels * reduce_height;
    tri_width  = mat_size/num_labels;

    // // original top_offset calc (undercorrects)
    // top_offset = -params.viz_dim.mat_size.y - tri_height;

  } else {

    // rows have fixed viz aid triangle 'heights'
    mat_size = params.viz_dim.heat_size.y;
    // tri_height = 0.0125;
    tri_width = mat_size/num_labels;
    // top_offset = -params.viz_dim.mat_size.x - tri_height;

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
      order_id = num_labels - params.network[inst_axis + '_nodes'][i][inst_order] - 1;
      shift_mat_heat = -(params.viz_dim.mat_size.y - params.viz_dim.heat_size.y);
    } else {
      order_id = params.network[inst_axis + '_nodes'][i][inst_order] ;
      shift_mat_heat = params.viz_dim.mat_size.x - params.viz_dim.heat_size.x;
    }

    /* need to position based on clustering order */
    // the last part is necessary to shfit the viz aid triangles down to make up
    // for the smaller size of the heatmap vs the general matrix area

    tri_offset_array[i] = mat_size - tri_width - order_id * 2 * tri_width + shift_mat_heat;
  }

  return tri_offset_array;

};