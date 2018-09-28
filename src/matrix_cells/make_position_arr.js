var calc_mat_arr = require('./../params/calc_mat_arr');

module.exports = function make_position_arr(params, inst_row_order, inst_col_order){

  var num_row = params.labels.num_row;
  var num_col = params.labels.num_col;

  calc_mat_arr(params);

  // pass along row and col node information
  var row_nodes = params.network.row_nodes;
  var col_nodes = params.network.col_nodes;

  /*
    working on saving actual row positions (downsampling)
  */
  params.row_positions = _.range(num_row);

  var row_order_id;
  var col_order_id;

  // generate x and y positions
  ////////////////////////////////
  function position_function(d, i){

    // looking up x and y position
    var col_id = i % num_col;
    var row_id = Math.floor(i / num_col);

    if (params.is_downsampled){

      /*
        the downsampled matrix should be plotted in its inherent order
      */
      row_order_id = row_id;
      col_order_id = col_id;

    } else {

      /*
        regular data needs to be plotted in the order given by the order
        arguments in row_nodes/col_nodes
      */

      row_order_id = num_row - 1 - row_nodes[row_id][inst_row_order];
      col_order_id = num_col - 1 - col_nodes[col_id][inst_col_order];

    }

    var inst_y = params.node_canvas_pos.y_arr[row_order_id];
    var inst_x = params.node_canvas_pos.x_arr[col_order_id];

    params.row_positions[row_id] = inst_y;

    return [inst_x, inst_y];
  }

  var position_arr = Array(num_row * num_col)
            .fill()
            .map(position_function);

  return position_arr;

};