export default (function make_position_arr(
  state,
  inst_row_order,
  inst_col_order
) {
  const num_row = state.labels.num_row;
  const num_col = state.labels.num_col;
  const canvas_pos = state.node_canvas_pos;
  const row_nodes = state.network.row_nodes;
  const col_nodes = state.network.col_nodes;
  let row_pos;
  let col_pos;
  function position_function(d, i) {
    row_pos =
      canvas_pos.y_arr[
        num_row - 1 - row_nodes[Math.floor(i / num_col)][inst_row_order]
      ];
    col_pos =
      canvas_pos.x_arr[num_col - 1 - col_nodes[i % num_col][inst_col_order]];
    return [col_pos, row_pos];
  }
  // generate new array with position elements
  const pos_arr = Array(num_row * num_col)
    .fill()
    .map(position_function);
  return pos_arr;
});
