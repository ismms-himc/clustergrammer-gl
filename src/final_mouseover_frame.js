var draw_commands = require('./draw_commands');

module.exports = function final_mouseover_frame(regl, params){

  // reduce the number of mouseovers
  params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover - 1;

  // console.log('check  ', params.zoom_data.x.total_mouseover)
  if (params.zoom_data.x.total_mouseover == 0 && params.still_mouseover == false){
    // console.log('final mouseover', params.mouseover.row_name, params.mouseover.col_name);

    // run draw commands
    var slow_draw = true;
    params.show_tooltip = true;

    // if (params.zoom_data.x.total_int == 0 && params.in_bounds_tooltip){
    //   // console.log('final_mouseover_frame', params.show_tooltip)
    //   // draw_commands(regl, params, slow_draw, show_tooltip=params.show_tooltip);
    // }
  }

};