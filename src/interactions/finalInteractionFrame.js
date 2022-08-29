import { mutateAnimationState } from "../state/reducers/animation/animationSlice";
import { mutateInteractionState } from "../state/reducers/interaction/interactionSlice";
import { mutateLabelsState } from "../state/reducers/labels/labelsSlice";

export default (function final_interaction_frame(store) {
  const state = store.getState();
  const dispatch = store.dispatch;
  // reduce the number of interactions
  if (state.interaction.total === 0 && state.animation.ini_viz === false) {
    // preventing from running on first frame
    if (state.animation.first_frame === false) {
      // run draw commands
      dispatch(
        mutateLabelsState({
          draw_labels: true,
        })
      );
    } else {
      dispatch(
        mutateAnimationState({
          first_frame: false,
        })
      );
    }
  }
  dispatch(
    mutateInteractionState({
      total: state.interaction.total - 1,
    })
  );
});
