module.exports = function draw_interacting(regl, params){

  var wait_time_final_interact = 10;

  params.int.total = params.int.total + 1;

  require('./draw_commands')(regl, params);

  setTimeout(require('./../interactions/final_interaction_frame'),
             wait_time_final_interact, regl, params);

  params.ani.ini_viz = false;

  if (params.ani.time_remain > 0){
    params.ani.time_remain = params.ani.time_remain - 1;
  }
};