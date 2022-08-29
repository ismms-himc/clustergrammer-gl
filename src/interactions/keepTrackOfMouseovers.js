import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";

export default function keep_track_of_mouseovers(store) {
  const state = store.getState();
  const dispatch = store.dispatch;

  // keep track of mouseovers
  if (state.interaction.still_mouseover === false) {
    dispatch(mutateInteractionState({ still_mouseover: true }));
    // wait some time to confirm still not interacting
    setTimeout(function () {
      dispatch(mutateInteractionState({ still_mouseover: false }));
    }, 1000);
  }
}
