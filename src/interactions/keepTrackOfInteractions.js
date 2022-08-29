import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";

export default (function keepTrackOfInteractions(store) {
  const state = store.getState();
  const dispatch = store.dispatch;

  const wait_time_final_interact = 100;
  // keep track of interactions
  if (state.interaction.still_interacting === false) {
    dispatch(mutateInteractionState({ still_interacting: true }));
    // wait some time to confirm still not interacting
    setTimeout(function () {
      dispatch(mutateInteractionState({ still_interacting: false }));
    }, wait_time_final_interact);
  }
});
