var initialize_params = require('./initialize_params');
var draw_commands = require('./draw_commands');
_ = require('underscore');

module.exports = function run_viz(container, network){

  var regl = require('regl')({
    extensions: ['angle_instanced_arrays'],
    container: container,
    // pixelRatio: window.devicePixelRatio/10
  });

  // console.log('run_viz loading regl')
  // console.log(network)

  // console.log('****************');
  // console.log('** initialize **');
  // console.log('****************');

  // var network = JSON.parse(assets.viz);

  // var tick = 0;
  // var has_been_both = false;
  var initialize_viz = true;

  // global params
  var params = initialize_params(regl, network);

  var first_frame = true;
  var wait_time_final_interact = 100;
  var wait_time_final_mouseover = 100;

  regl.frame(function () {

    // interaction (zoom/drag) causes a draw command, the final draw command
    // is run when the interaction stops
    if (params.still_interacting == true || initialize_viz == true){

      params.zoom_data.x.total_int = params.zoom_data.x.total_int + 1;

      draw_commands(regl, params);

      setTimeout(final_interaction_frame, wait_time_final_interact, params);

      // console.log('draw');
      initialize_viz = false;

    }

    // mouseover interaction starting then ending will cause a draw comand
    if (params.still_mouseover == true){

      // console.log('still_mouseover')
      params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover + 1;

      setTimeout(final_mouseover_frame, wait_time_final_mouseover, params);

    } else {

      /*
        Consider setting up something to run background calculations if
        necessary when the visualization is not being updated. For instance,
        we could calculate the text triangles of all rows a little at a time
        in the background.
      */

    }

    // // wait to draw
    // setTimeout(final_interaction_frame, wait_time_final_interact, params);

  });


  function final_mouseover_frame(params){

    // reduce the number of mouseovers
    params.zoom_data.x.total_mouseover = params.zoom_data.x.total_mouseover - 1;

    // console.log('check  ', params.zoom_data.x.total_mouseover)
    if (params.zoom_data.x.total_mouseover == 0 && params.still_mouseover == false){
      console.log('final mouseover', params.mouseover.row_name, params.mouseover.col_name);

      // run draw commands
      var slow_draw = true;
      var show_tooltip = false;

      if (params.zoom_data.x.total_int == 0){
        draw_commands(regl, params, slow_draw, show_tooltip=true);
      }

    }
  }

  function final_interaction_frame(params){

    // reduce the number of interactions
    params.zoom_data.x.total_int = params.zoom_data.x.total_int - 1;

    if (params.zoom_data.x.total_int == 0 && initialize_viz == false){

      // preventing from running on first frame
      if (first_frame == false){

        console.log('\n------------------\nFINAL INTERACTION');
        console.log('final interaction', params.mouseover.row_name, params.mouseover.col_name);

        // run draw commands
        var slow_draw = true;
        var show_tooltip = false;

        if (params.zoom_data.x.total_mouseover == 0){
          draw_commands(regl, params, slow_draw);
        }

        // console.log(params.kept_row_y);

      } else {
        first_frame = false;
      }
    }

  }

  return params;

};