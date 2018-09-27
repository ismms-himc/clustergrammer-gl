
module.exports = function make_position_arr(params, inst_row_order, inst_col_order){

  var network = params.network;
  var num_row = params.labels.num_row;
  var num_col = params.labels.num_col;

  // draw matrix cells
  /////////////////////////////////////////
  // set up offset array for buffer
  var offset = {};
  offset.x = params.viz_dim.mat_size.x ;//+ params.viz_dim.offcenter.x;
  offset.y = params.viz_dim.mat_size.y ;//+ params.viz_dim.offcenter.y;

  // generate x position array
  params.node_canvas_pos = {};
  var inst_index;

  // _.each(['x', 'y'], function(inst_axis){

  //   params.node_canvas_pos[inst_axis + '_arr'] = Array(num_col).fill()
  //     .map(function(_, i){
  //       inst_index = i;
  //       return  2.0 * params.viz_dim.heat_size.x * (inst_index/num_col - 1) + offset.x;
  //     });

  // });

  params.node_canvas_pos.x_arr = Array(num_col).fill()
    .map(function(_, i){
      inst_index = i;
      return  2.0 * params.viz_dim.heat_size.x * (inst_index/num_col - 1) + offset.x;
    });

  params.node_canvas_pos.y_arr = Array(num_row).fill()
    .map(function(_, i){
      inst_index = i + 1;
      return -2.0 * params.viz_dim.heat_size.y * (inst_index/num_row - 1)  - offset.y;
    });

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