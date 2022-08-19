module.exports = function start_animation(params) {
  params.ani.run_animation = false;
  params.ani.last_switch_time = params.ani.time;
  params.ani.running = true;

  params.ani.duration_end =
    params.ani.last_switch_time + params.ani.ani_duration;
};
