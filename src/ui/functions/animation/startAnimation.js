import { mutateAnimationState } from "../../../state/reducers/animation/animationSlice";

export default (function start_animation(store) {
  const state = store.getState();

  const last_switch_time = state.animation.time;
  store.dispatch(
    mutateAnimationState({
      run_animation: false,
      last_switch_time,
      running: true,
      duration_end: last_switch_time + state.animation.ani_duration,
    })
  );
});
