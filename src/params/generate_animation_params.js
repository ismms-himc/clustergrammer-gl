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

};