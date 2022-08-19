var d3 = require("d3");
var final_mouseover_frame = require("./../interactions/finalMouseoverFrame");
var wait_time_final_mouseover = 100;

module.exports = function draw_mouseover(regl, params) {
  d3.selectAll(params.root + " .group-svg-tooltip").remove();

  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

  setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);
};
