module.exports = function calc_row_and_col_canvas_positions(params){

  var num_col = params.num_col;
  var num_row = params.num_row;

  // draw matrix cells
  /////////////////////////////////////////
  // set up offset array for buffer
  var offset = {};
  offset.x = 0.5;
  offset.y = 0.5;

  // generate x position array
  var x_arr = Array(num_col).fill()
    .map(function(_, i){
      return i/num_col - offset.x;
    });

  var y_arr = Array(num_row).fill()
    .map(function(_, i){
      return -i/num_row + offset.y - 1/num_row;
    });

  var canvas_pos = {};
  canvas_pos.x_arr = x_arr;
  canvas_pos.y_arr = y_arr;

  return canvas_pos;

};