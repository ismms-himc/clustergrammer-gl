import { setRowAndColCanvasPositions } from "../../reducers/rowAndColCanvasPositionsSlice";

export default (function calc_row_and_col_canvas_positions(store) {
  const state = store.getState();
  let inst_axis = "row";
  const num_row = state.labels["num_" + inst_axis];
  inst_axis = "col";
  const num_col = state.labels["num_" + inst_axis];
  // draw matrix cells
  // ///////////////////////////////////////
  // set up offset array for buffer
  const offset = {};
  offset.x = state.visualization.viz_dim.center.x;
  offset.y = state.visualization.viz_dim.center.y;
  // generate x position array
  const x_arr = Array(num_col)
    .fill()
    .map(function (_, i) {
      return i / num_col - offset.x;
    });
  const y_arr = Array(num_row)
    .fill()
    .map(function (_, i) {
      return -i / num_row + offset.y - 1 / num_row;
    });
  const canvas_pos = {};
  canvas_pos.x_arr = x_arr;
  canvas_pos.y_arr = y_arr;

  store.dispatch(setRowAndColCanvasPositions(canvas_pos));
});
