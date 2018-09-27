
module.exports = function make_position_arr(params, inst_row_order, inst_col_order){

  var network = params.network;
  var num_row = params.mat_data.length;
  var num_col = params.mat_data[0].length;

  // draw matrix cells
  /////////////////////////////////////////
  // set up offset array for buffer
  var offset = {};
  offset.x = params.viz_dim.mat_size.x ;//+ params.viz_dim.offcenter.x;
  offset.y = params.viz_dim.mat_size.y ;//+ params.viz_dim.offcenter.y;

  // generate x position array
  var x_arr = Array(num_col).fill()
    .map(function(_, i){
      // return   2 * params.viz_dim.heat_size.x * i/num_col - 2 * params.viz_dim.heat_size.x + offset.x;
      return      2 * params.viz_dim.heat_size.x * ( i/num_col - 1 ) + offset.x;
    });

  var y_arr = Array(num_row).fill()
    .map(function(_, i){

      // updated to take into consideration params.viz_dim.heat_size.x
      // return -(2 * params.viz_dim.heat_size.y * i/num_row - 2 * params.viz_dim.heat_size.y * (1 - 1/num_row) + offset.y);
      return    -2*params.viz_dim.heat_size.y * i/num_row + 2*params.viz_dim.heat_size.y * (1 - 1/num_row) - offset.y;
    });

  params.node_canvas_pos = {};
  params.node_canvas_pos.x_arr = x_arr;
  params.node_canvas_pos.y_arr = y_arr;

  // var canvas_pos = params.canvas_pos;

  // pass along row and col node information
  var row_nodes = network.row_nodes;
  var col_nodes = network.col_nodes;

  /*
    working on saving actual row positions (downsampling)
  */
  params.row_positions = _.range(row_nodes.length);

  var row_order_id;
  var col_order_id;

  // generate x and y positions
  ////////////////////////////////
  function position_function(_, i){

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

    var y = params.node_canvas_pos.y_arr[row_order_id];
    var x = params.node_canvas_pos.x_arr[col_order_id];

    params.row_positions[row_id] = y;

    return [x, y];
  }

  var position_arr = Array(num_row * num_col)
            .fill()
            .map(position_function);

  return position_arr;

};