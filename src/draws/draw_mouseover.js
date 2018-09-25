var draw_commands = require('./draw_commands');
var final_mouseover_frame = require('./../interactions/final_mouseover_frame');
var wait_time_final_mouseover = 50;

module.exports = function draw_mouseover(regl, params){

  /////////////////////////////////////
  /////////////////////////////////////
  // mouseover draw is causing some flashing after animation, clean up later
  ////////////////////////////////////
  /////////////////////////////////////

  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

  // remove old tooltip
  if (params.remove_tooltip_frame){
    // console.log('remove old tooltip ***********')
    params.show_tooltip = false;

    // console.log('still mouseover')
    draw_commands(regl, params);
  }

  if (params.remove_tooltip_frame){
      // console.log('--- shut down remove_tooltip_frame')
    params.remove_tooltip_frame = false;
  }

  // wait_time_final_mouseover = 0;
  setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);
};