var draw_commands = require('./draw_commands');
var final_interaction_frame = require('./../interactions/final_interaction_frame');

module.exports = function draw_interacting(regl, params){

  var wait_time_final_interact = 50;

  params.int.total = params.int.total + 1;

  draw_commands(regl, params);

  setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

  params.ani.ini_viz = false;

  if (params.ani.time_remain > 0){
    params.ani.time_remain = params.ani.time_remain - 1;
  }
};