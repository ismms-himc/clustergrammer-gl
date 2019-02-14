module.exports = function generate_animation_params(params){

  // animation params
  params.animation = {};
  params.animation.time_remain = 0;

  params.animation.running = false;
  params.animation.run_animation = false;

  params.animation.last_switch_time = 0;
  params.animation.ani_duration = 3;
  params.animation.duration_end = 0;

  params.animation.time = 0;
  params.animation.first_frame = true;
  params.animation.initialize_viz = true;

  params.animation.last_click = 0;
  params.animation.dblclick_duration = 0.5;

  // used to update viz after background calculations
  params.animation.update_viz = false;

};