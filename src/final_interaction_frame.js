var draw_commands = require('./draw_commands');
module.exports = function final_interaction_frame(regl, params){

  // reduce the number of interactions
  params.zoom_data.x.total_int = params.zoom_data.x.total_int - 1;

  if (params.zoom_data.x.total_int == 0 && params.initialize_viz == false){

    // preventing from running on first frame
    if (params.first_frame == false){

      // console.log('\n------------------\nFINAL INTERACTION');
      // console.log('final interaction', params.mouseover.row_name, params.mouseover.col_name);

      // run draw commands
      params.slow_draw = true;

      if (params.zoom_data.x.total_mouseover == 0){
        // console.log('SLOW_DRAW')
        // draw_commands(regl, params, slow_draw);
      }

      // console.log(params.kept_row_y);

    } else {
      params.first_frame = false;
    }
  }

}