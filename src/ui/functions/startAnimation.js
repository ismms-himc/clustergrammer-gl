import { mutateAnimationState } from "../../state/reducers/animation/animationSlice";

export default (function start_animation(state, dispatch) {
  dispatch(
    mutateAnimationState({
      run_animation: false,
      last_switch_time: state.animation.time,
      running: true,
      duration_end:
        state.animation.last_switch_time + state.animation.ani_duration,
    })
  );
});
