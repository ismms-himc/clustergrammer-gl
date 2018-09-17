var initialize_params = require('./../params/initialize_params');
var draw_commands = require('./draw_commands');
_ = require('underscore');
var final_mouseover_frame = require('./../interactions/final_mouseover_frame');
var final_interaction_frame = require('./../interactions/final_interaction_frame');
// var calc_text_triangles = require('./../matrix_labels/calc_text_triangles');
var update_text_triangle_order = require('./../matrix_labels/update_text_triangle_order');

module.exports = function run_viz(regl, network){

  // global params
  var params = initialize_params(regl, network);

  params.first_frame = true;
  var wait_time_final_interact = 100;
  var wait_time_final_mouseover = 100;


  regl.frame(function ({time}) {

    params.time = time;
    params.animation.loop = 0 ;

    if (params.animation.run_switch){

      // console.log('turn switch off')
      params.animation.run_switch = false;
      params.animation.last_switch_time = time
      params.animation.running = true;

    } else if (params.time > params.animation.last_switch_time + params.animation.switch_duration && params.animation.running === true){

      ///////////////////////////////////////
      // The transition has finished
      ///////////////////////////////////////

      params.animation.running = false;
      params.animation.run_switch = false;

      // transfer the new positions to the matrix args attributes
      params.matrix_args.regl_props.rects.attributes.pos_att_ini = {
            buffer: regl.buffer(params.arrs.position_arr.new),
            divisor: 1
          };

      // transfer the new category positions to the cat args attributes
      _.each(['row', 'col'], function(inst_axis){

        for (var cat_index = 0; cat_index < params.cat_num[inst_axis]; cat_index++) {
          // update the attribute
          params.cat_args[inst_axis][cat_index].attributes.cat_pos_att_inst = {
              buffer: regl.buffer(params.cat_arrs.new[inst_axis][cat_index]),
              divisor: 1
          };
        }
        // transfer new order to old order
        params.inst_order[inst_axis] = params.new_order[inst_axis]

      });

      // transfer new order to text triangles
      // console.log('transfer order for text triangles')
      _.each(['row', 'col'], function(inst_axis){
        // params.text_triangles.draw[inst_axis] = calc_text_triangles(params, inst_axis);
        params.text_triangles.draw[inst_axis] = update_text_triangle_order(params, inst_axis);
      });

    }

    // run draw command
    if (params.still_interacting == true || params.initialize_viz == true ||
        // params.animation.running || params.show_tooltip){
        params.animation.running){

      params.zoom_data.x.total_int = params.zoom_data.x.total_int + 1;

      draw_commands(regl, params);

      setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

      params.initialize_viz = false;

      if (params.animation.time_remain > 0){
        params.animation.time_remain = params.animation.time_remain - 1;
      }

      // // set up extra frame specifically to remove old tooltip
      // if (params.show_tooltip){
      //   params.show_tooltip = false;
      //   console.log('initialize remove_tooltip_frame')
      //   params.remove_tooltip_frame = true;
      // }

    }

    // mouseover may result in draw command
    else if (params.still_mouseover == true){

      // console.log('still_mouseover', params.remove_tooltip_frame)

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
        draw_commands(regl, params);
      }

      if (params.remove_tooltip_frame){
          // console.log('--- shut down remove_tooltip_frame')
        params.remove_tooltip_frame = false;
      }

      // wait_time_final_mouseover = 0;
      setTimeout(final_mouseover_frame, wait_time_final_mouseover, regl, params);

    } else if (params.slow_draw || params.show_tooltip){

      // console.log('SLOW DRAW!!!!!!!!!!!!!!')
      draw_commands(regl, params);
      params.remove_tooltip_frame = true;

      // set up extra frame specifically to remove old tooltip
      if (params.show_tooltip){
        params.show_tooltip = false;
        // console.log('initialize remove_tooltip_frame')
      }

    } else {

      /*

        Set up something to run background calculations if
        necessary when the visualization is not being updated. For instance,
        we could calculate the text triangles of all rows a little at a time
        in the background.

      */

    }

  });

  return params;

};