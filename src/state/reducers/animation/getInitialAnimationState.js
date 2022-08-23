export default function getInitialAnimationState(params) {
  return {
    time_remain: 0,
    running: false,
    run_animation: false,
    last_switch_time: 0,
    ani_duration: 3,
    duration_end: 0,
    time: 0,
    first_frame: true,
    ini_viz: true,
    last_click: 0,
    dblclick_duration: 0.5,
    update_viz: false,
  };
}
