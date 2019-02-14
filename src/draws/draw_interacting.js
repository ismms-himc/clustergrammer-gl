var draw_commands = require('./draw_commands');
var final_interaction_frame = require('./../interactions/final_interaction_frame');

module.exports = function draw_interacting(regl, params){

  var wait_time_final_interact = 50;

  params.interact.total = params.interact.total + 1;

  console.log('draw_interacting')
  draw_commands(regl, params);

  setTimeout(final_interaction_frame, wait_time_final_interact, regl, params);

  params.animation.initialize_viz = false;

  if (params.animation.time_remain > 0){
    params.animation.time_remain = params.animation.time_remain - 1;
  }
};