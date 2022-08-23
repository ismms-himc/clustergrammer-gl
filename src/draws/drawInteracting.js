import finalInteractionFrame from "../interactions/finalInteractionFrame";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import drawCommands from "./drawCommands";

export default (function draw_interacting(
  regl,
  state,
  dispatch,
  catArgsManager,
  cameras
) {
  const wait_time_final_interact = 100;

  let ini_viz = state.animation.ini_viz;
  let time_remain = state.animation.time_remain;
  const { need_reset_cat_opacity } = drawCommands(
    regl,
    state,
    dispatch,
    catArgsManager,
    cameras
  );
  setTimeout(finalInteractionFrame, wait_time_final_interact, state, dispatch);
  ini_viz = false;
  if (state.animation.time_remain > 0) {
    time_remain = state.animation.time_remain - 1;
  }
  dispatch(
    mutateInteractionState({
      total: state.interaction.total + 1,
      need_reset_cat_opacity,
      time_remain,
      ini_viz,
    })
  );
});
