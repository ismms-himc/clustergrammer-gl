module.exports = function start_animation(params){

  // console.log('start_animation')
  params.animation.run_switch = false;
  params.animation.last_switch_time = params.time
  params.animation.running = true;


};