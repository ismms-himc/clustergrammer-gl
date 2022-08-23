import ease from "eases/cubic-in-out";

export default (function interp_fun(state) {
  const inst_ease = ease(
    (state.animation.time - state.animation.last_switch_time) /
      state.animation.ani_duration
  );
  return inst_ease;
});
