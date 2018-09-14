module.exports = function make_viz_aid_tri_pos_arr(params, inst_axis, inst_order){

  if (inst_axis === 'col'){

    mat_size = params.heat_size.x;
    // keep positioned at matrix not heatmap (make room for categories)
    // making triangle smaller
    var reduce_height = params.zoom_data.x.total_zoom;
    tri_height = mat_size/num_labels * reduce_height;
    tri_width  = mat_size/num_labels;

    // original top_offset calc (undercorrects)
    top_offset = -params.mat_size.y - tri_height;

  } else {

    // rows have fixed viz aid triangle 'heights'
    mat_size = params.heat_size.y;
    tri_height = 0.0125;
    tri_width = mat_size/num_labels;
    top_offset = -params.mat_size.x - tri_height;

  }

};