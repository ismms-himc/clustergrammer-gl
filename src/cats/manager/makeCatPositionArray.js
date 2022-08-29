export default (function makeCatPositionArray(store, inst_axis) {
  const {
    labels,
    visualization: { viz_dim },
    network,
    order,
  } = store.getState();
  const inst_order = order.new[inst_axis];
  const num_labels = labels["num_" + inst_axis];
  // category tiles have fixed heights
  // category widths depend on the number of labels
  let cat_width;
  let mat_size;
  if (inst_axis === "col") {
    mat_size = viz_dim.heat_size.x;
    cat_width = mat_size / 0.5 / num_labels;
  } else {
    mat_size = viz_dim.heat_size.y;
    cat_width = viz_dim.heat_size.y / 0.5 / num_labels;
  }
  // ///////////////////////////////
  // Cat Offset Buffer
  // ///////////////////////////////
  // row width is required to place the triangles on the 'top' of the matrix and
  // not to overlap with the matrix
  // vertical shift
  const y_offset_array = [];
  let i;
  for (i = 0; i < num_labels; i++) {
    // emperically found rules
    let order_id;
    let shift_mat_heat;
    if (inst_axis === "row") {
      order_id = num_labels - network[inst_axis + "_nodes"][i][inst_order] - 1;
      // vertical shift
      shift_mat_heat = -(viz_dim.mat_size.y - viz_dim.heat_size.y);
    } else {
      order_id = network[inst_axis + "_nodes"][i][inst_order];
      shift_mat_heat = viz_dim.mat_size.x - viz_dim.heat_size.x;
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
