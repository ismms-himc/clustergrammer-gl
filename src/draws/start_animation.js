module.exports = function start_animation(params){

  // console.log('start_animation')
  params.animation.run_animation = false;
  params.animation.last_switch_time = params.time
  params.animation.running = true;


  params.animation.duration_end = params.animation.last_switch_time + params.animation.ani_duration;
};