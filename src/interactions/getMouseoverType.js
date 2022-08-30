import { mutateTooltipState } from "../state/reducers/tooltip/tooltipSlice";

export default (function getMouseoverType(store) {
  const state = store.getState();

  // return vars
  let in_bounds_tooltip = false;
  let tooltip_type = "out-of-bounds";
  // switch to using absolute cursor position to determine mouseover type
  // emperically found pixel parameters
  // cats are ~12px wide
  const cat_width = 12;
  const edim = {};
  edim.x = {};
  edim.x.heat_min = 125 + cat_width * state.cat_data.row.length;
  edim.x.dendro_start = 750;
  edim.x.dendro_end = 800;
  edim.y = {};
  // extra pixel prevents error *********** look into
  edim.y.heat_min = 126 + cat_width * state.cat_data.col.length;
  edim.y.dendro_start = 845;
  edim.y.dendro_end = 860;
  const inst_pix = {};
  inst_pix.x = state.visualization.zoom_data.x.cursor_position;
  inst_pix.y = state.visualization.zoom_data.y.cursor_position;
  let cat_index;
  if (
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    in_bounds_tooltip = true;
    tooltip_type = "matrix-cell";
  } else if (
    inst_pix.x <= edim.x.heat_min &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    in_bounds_tooltip = true;
    if (state.cat_data.row.length > 0) {
      cat_index = Math.floor((edim.x.heat_min - inst_pix.x) / cat_width);
      if (cat_index + 1 <= state.cat_data.row.length) {
        tooltip_type =
          "row-cat-" + String(state.cat_data.row.length - cat_index - 1);
      } else {
        tooltip_type = "row-label";
      }
    } else {
      tooltip_type = "row-label";
    }
  } else if (
    inst_pix.y <= edim.y.heat_min &&
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start
  ) {
    in_bounds_tooltip = true;
    if (state.cat_data.col.length > 0) {
      cat_index = Math.floor((edim.y.heat_min - inst_pix.y) / cat_width);
      if (cat_index + 1 <= state.cat_data.col.length) {
        tooltip_type =
          "col-cat-" + String(state.cat_data.col.length - cat_index - 1);
      } else {
        tooltip_type = "col-label";
      }
    } else {
      tooltip_type = "col-label";
    }
  } else if (
    inst_pix.x >= edim.x.dendro_start &&
    inst_pix.x < edim.x.dendro_end &&
    inst_pix.y > edim.y.heat_min &&
    inst_pix.y < edim.y.dendro_start
  ) {
    if (state.order.inst.row === "clust") {
      tooltip_type = "row-dendro";
      in_bounds_tooltip = true;
    }
  } else if (
    inst_pix.y >= edim.y.dendro_start &&
    inst_pix.y < edim.y.dendro_end &&
    inst_pix.x > edim.x.heat_min &&
    inst_pix.x < edim.x.dendro_start
  ) {
    if (state.order.inst.col === "clust") {
      tooltip_type = "col-dendro";
      in_bounds_tooltip = true;
    }
  }
  store.dispatch(
    mutateTooltipState({
      in_bounds_tooltip,
      tooltip_type,
    })
  );
});
