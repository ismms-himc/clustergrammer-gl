export default (function iniZoomRestrict(max_zoom, labels, viz_dim) {
  let inst_axis = "row";
  const num_row = labels["num_" + inst_axis];
  inst_axis = "col";
  const num_col = labels["num_" + inst_axis];
  const col_vs_row_space =
    num_col / viz_dim.heat.width / (num_row / viz_dim.heat.height);
  // working on improved matrix zooming
  const zoom_restrict = {
    x: {
      min: 1.0,
      max: num_row > num_col ? max_zoom * (1 / col_vs_row_space) : max_zoom,
      ratio: num_row > num_col ? 1 / col_vs_row_space : 1.0,
    },
    y: {
      min: 1.0,
      max: num_row > num_col ? max_zoom * col_vs_row_space : max_zoom,
      ratio: num_row > num_col ? col_vs_row_space : 1.0,
    },
  };
  return zoom_restrict;
});
