import * as d3 from "d3";
import finalMouseoverFrame from "../../interactions/finalMouseoverFrame";

const wait_time_final_mouseover = 100;
export default (function draw_mouseover(regl, state) {
  d3.selectAll(
    state.visualization.rootElementId + " .group-svg-tooltip"
  ).remove();
  state.visualization.zoom_data.x.total_mouseover =
    state.visualization.zoom_data.x.total_mouseover + 1;
  setTimeout(finalMouseoverFrame, wait_time_final_mouseover, regl, state);
});
