export default (function ini_zoom_restrict(max_zoom, labels, viz_dim) {
  let inst_axis = "row";
  const num_row = labels["num_" + inst_axis];
  inst_axis = "col";
  const num_col = labels["num_" + inst_axis];
  // working on improved matrix zooming
  const zoom_restrict = {};
  zoom_restrict.x = {};
  zoom_restrict.x.max = max_zoom;
  zoom_restrict.x.min = 1.0;
  zoom_restrict.x.ratio = 1.0;
  zoom_restrict.y = {};
  zoom_restrict.y.max = max_zoom;
  zoom_restrict.y.min = 1.0;
  zoom_restrict.y.ratio = 1.0;
  const col_vs_row_space =
    num_col / viz_dim.heat.width / (num_row / viz_dim.heat.height);
  // increase max zoom in y or x direction
  if (num_row > num_col) {
    zoom_restrict.y.max = zoom_restrict.y.max * (1 / col_vs_row_space);
    zoom_restrict.y.ratio = 1 / col_vs_row_space;
  } else {
    zoom_restrict.x.max = zoom_restrict.x.max * col_vs_row_space;
    zoom_restrict.x.ratio = col_vs_row_space;
  }
  return zoom_restrict;
});
