module.exports = function generate_animation_params(params){

  // animation params
  params.ani = {};
  params.ani.time_remain = 0;

  params.ani.running = false;
  params.ani.run_animation = false;

  params.ani.last_switch_time = 0;
  params.ani.ani_duration = 3;
  params.ani.duration_end = 0;

  params.ani.time = 0;
  params.ani.first_frame = true;
  params.ani.ini_viz = true;

  params.ani.last_click = 0;
  params.ani.dblclick_duration = 0.5;

  // used to update viz after background calculations
  params.ani.update_viz = false;

};