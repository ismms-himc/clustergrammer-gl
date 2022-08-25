import finalInteractionFrame from "../interactions/finalInteractionFrame";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import drawCommands from "./drawCommands";

export default (function drawInteracting(regl, store, catArgsManager, cameras) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const wait_time_final_interact = 100;

  let ini_viz = state.animation.ini_viz;
  let time_remain = state.animation.time_remain;
  drawCommands(regl, store, catArgsManager, cameras);
  setTimeout(finalInteractionFrame, wait_time_final_interact, store);
  ini_viz = false;
  const { animation } = store.getState();
  if (animation.time_remain > 0) {
    time_remain = animation.time_remain - 1;
  }
  // TODO: I'm pretty sure with finalInteractionFrame also setting total, this is a race condition
  //       sooo... yuck
  dispatch(
    mutateInteractionState({
      total: store.getState().interaction.total + 1,
      time_remain,
      ini_viz,
    })
  );
});
