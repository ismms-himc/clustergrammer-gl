var final_mouseover_frame = require('./../interactions/final_mouseover_frame');
var wait_time_final_mouseover = 50;

module.exports = function draw_mouseover(regl, params){

  d3.selectAll(params.root + ' .group-svg-tooltip')
    .remove();

  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

  if (params.tooltip.remove_tooltip_frame){
      // console.log('--- shut down remove_tooltip_frame')
    params.tooltip.remove_tooltip_frame = false;
  }

  // wait_time_final_mouseover = 0;
  setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);
};