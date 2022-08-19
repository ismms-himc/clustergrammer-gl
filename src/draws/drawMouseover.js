import * as d3 from "d3";
import final_mouseover_frame from "../interactions/finalMouseoverFrame.js";
var wait_time_final_mouseover = 100;
export default (function draw_mouseover(regl, params) {
  d3.selectAll(params.root + " .group-svg-tooltip").remove();
  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;
  setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);
});
