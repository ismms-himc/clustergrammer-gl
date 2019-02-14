module.exports = function gen_ani_par(params){

  var ani = {};
  ani.time_remain = 0;
  ani.running = false;
  ani.run_animation = false;
  ani.last_switch_time = 0;
  ani.ani_duration = 3;
  ani.duration_end = 0;
  ani.time = 0;
  ani.first_frame = true;
  ani.ini_viz = true;
  ani.last_click = 0;
  ani.dblclick_duration = 0.5;
  ani.update_viz = false;

  params.ani = ani;
};