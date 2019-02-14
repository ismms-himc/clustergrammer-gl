
module.exports = function make_position_arr(params, inst_row_order, inst_col_order){

  var num_row = params.labels.num_row;
  var num_col = params.labels.num_col;

  // pass along row and col node information
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;

  var row_order_id;
  var col_order_id;
  var canvas_pos = params.node_canvas_pos;

  function position_function(d, i){

    row_order_id = num_row - 1 - row_nodes[Math.floor(i / num_col)][inst_row_order];
    col_order_id = num_col - 1 - col_nodes[i % num_col][inst_col_order];

    return [canvas_pos.x_arr[col_order_id], canvas_pos.y_arr[row_order_id]];
  }

  var pos_arr = Array(num_row * num_col)
            .fill()
            .map(position_function);

  return pos_arr;

};