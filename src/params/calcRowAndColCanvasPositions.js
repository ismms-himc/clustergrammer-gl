export default (function calc_row_and_col_canvas_positions(params) {
  var inst_axis = "row";
  var num_row = params.labels["num_" + inst_axis];
  inst_axis = "col";
  var num_col = params.labels["num_" + inst_axis];
  // draw matrix cells
  /////////////////////////////////////////
  // set up offset array for buffer
  var offset = {};
  offset.x = params.viz_dim.center.x;
  offset.y = params.viz_dim.center.y;
  // generate x position array
  var x_arr = Array(num_col)
    .fill()
    .map(function (_, i) {
      return i / num_col - offset.x;
    });
  var y_arr = Array(num_row)
    .fill()
    .map(function (_, i) {
      return -i / num_row + offset.y - 1 / num_row;
    });
  var canvas_pos = {};
  canvas_pos.x_arr = x_arr;
  canvas_pos.y_arr = y_arr;
  return canvas_pos;
});
