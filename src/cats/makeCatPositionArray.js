export default (function make_cat_position_array(
  params,
  inst_axis,
  cat_index,
  inst_order
) {
  var num_labels = params.labels["num_" + inst_axis];
  // category tiles have fixed heights
  // category widths depend on the number of labels
  var cat_width;
  var mat_size;
  if (inst_axis === "col") {
    mat_size = params.viz_dim.heat_size.x;
    cat_width = mat_size / 0.5 / num_labels;
  } else {
    mat_size = params.viz_dim.heat_size.y;
    cat_width = params.viz_dim.heat_size.y / 0.5 / num_labels;
  }
  /////////////////////////////////
  // Cat Offset Buffer
  /////////////////////////////////
  // row width is required to place the triangles on the 'top' of the matrix and
  // not to overlap with the matrix
  // vertical shift
  var y_offset_array = [];
  var i;
  for (i = 0; i < num_labels; i++) {
    // emperically found rules
    var order_id;
    var shift_mat_heat;
    if (inst_axis == "row") {
      order_id =
        num_labels - params.network[inst_axis + "_nodes"][i][inst_order] - 1;
      // vertical shift
      shift_mat_heat = -(
        params.viz_dim.mat_size.y - params.viz_dim.heat_size.y
      );
    } else {
      order_id = params.network[inst_axis + "_nodes"][i][inst_order];
      shift_mat_heat = params.viz_dim.mat_size.x - params.viz_dim.heat_size.x;
    }
    /* need to position based on clustering order */
    // the last part is necessary to shfit the viz aid triangles down to make up for the smaller size
    // of the heatmap vs the general matrix area
    // make 2d array
    y_offset_array[i] = [
      mat_size - cat_width / 2 - order_id * cat_width + shift_mat_heat,
      0,
    ];
  }
  return y_offset_array;
});
